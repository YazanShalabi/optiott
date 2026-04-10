#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# populate-compositions.sh
#
# Populates the Visual Builder composition (outline section nodes) of every
# OptiOTT experience in Optimizely SaaS CMS via PATCH to preview3 REST API.
#
# The CMS side of things already knows these block content types are
# sectionEnabled, so we drop them directly at the outline level as
# nodeType:"component" under the nodeType:"experience" root.
###############################################################################

API_BASE="https://api.cms.optimizely.com"
CLIENT_ID="8c7498ddde7e4e539272617aec9f3fa0"
CLIENT_SECRET="ZCYbsH1LXqWAIcMT3QCbP0EZPhmCtCZX0eehNyYiYS3aD4U3"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TOKEN=""
TOKEN_EXPIRES=0

refresh_token() {
  local now
  now=$(date +%s)
  if [ "$now" -lt "$TOKEN_EXPIRES" ] && [ -n "$TOKEN" ]; then
    return
  fi
  local resp
  resp=$(curl -s -X POST "$API_BASE/oauth/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET")
  TOKEN=$(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
  TOKEN_EXPIRES=$(( now + 240 ))
}

###############################################################################
# get_latest_version KEY  -> prints version number for ?locale=en
###############################################################################
get_latest_version() {
  local key="$1"
  refresh_token
  curl -s "$API_BASE/preview3/experimental/content/$key/versions?locale=en" \
    -H "Authorization: Bearer $TOKEN" \
    | python3 -c "
import sys, json
data = json.load(sys.stdin)
items = data.get('items', [])
if not items:
    print('')
else:
    # Pick the newest version
    items.sort(key=lambda v: int(v.get('version', 0)), reverse=True)
    print(items[0]['version'])
"
}

###############################################################################
# patch_composition KEY VERSION COMPOSITION_JSON
###############################################################################
patch_composition() {
  local key="$1" version="$2" comp="$3"
  refresh_token

  # Build merge-patch body
  local body
  body=$(python3 -c "
import json, sys
comp = json.loads(sys.argv[1])
print(json.dumps({'composition': comp}))
" "$comp")

  local resp http
  resp=$(curl -s -w '\n%{http_code}' -X PATCH \
    "$API_BASE/preview3/experimental/content/$key/versions/$version?locale=en" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/merge-patch+json" \
    -d "$body")
  http=$(echo "$resp" | tail -n1)
  body_out=$(echo "$resp" | sed '$d')

  if [ "$http" = "200" ] || [ "$http" = "201" ]; then
    return 0
  fi
  echo -e "${RED}  PATCH $key v$version -> HTTP $http${NC}" >&2
  echo "$body_out" | head -c 400 >&2
  echo >&2
  return 1
}

###############################################################################
# make_component_node DISPLAY_NAME CONTENT_TYPE PROPS_JSON
#
# Emits a JSON object for one composition component node. UUID is generated.
###############################################################################
make_component_node() {
  local dn="$1" ct="$2" props="$3"
  python3 -c "
import json, sys, uuid
node = {
  'id': str(uuid.uuid4()),
  'displayName': sys.argv[1],
  'nodeType': 'component',
  'component': {
    'contentType': sys.argv[2],
    'properties': json.loads(sys.argv[3]) if sys.argv[3] else {}
  }
}
print(json.dumps(node))
" "$dn" "$ct" "$props"
}

###############################################################################
# make_experience_composition NAME NODE_JSON [NODE_JSON ...]
###############################################################################
make_experience_composition() {
  local name="$1"; shift
  local nodes_json="["
  local first=1
  for n in "$@"; do
    if [ $first -eq 0 ]; then nodes_json+=","; fi
    nodes_json+="$n"
    first=0
  done
  nodes_json+="]"
  python3 -c "
import json, sys, uuid
comp = {
  'id': str(uuid.uuid4()),
  'displayName': sys.argv[1],
  'nodeType': 'experience',
  'layoutType': 'outline',
  'nodes': json.loads(sys.argv[2])
}
print(json.dumps(comp))
" "$name" "$nodes_json"
}

###############################################################################
# make_container_node DISPLAY_NAME CONTENT_TYPE PROPS_JSON CHILD_NODE_JSON...
# Component node with nested component children (e.g. PricingTabs > PricingCards)
###############################################################################
make_container_node() {
  local dn="$1" ct="$2" props="$3"; shift 3
  local children_json="["
  local first=1
  for c in "$@"; do
    if [ $first -eq 0 ]; then children_json+=","; fi
    children_json+="$c"
    first=0
  done
  children_json+="]"
  python3 -c "
import json, sys, uuid
node = {
  'id': str(uuid.uuid4()),
  'displayName': sys.argv[1],
  'nodeType': 'component',
  'component': {
    'contentType': sys.argv[2],
    'properties': json.loads(sys.argv[3]) if sys.argv[3] else {}
  },
  'nodes': json.loads(sys.argv[4])
}
print(json.dumps(node))
" "$dn" "$ct" "$props" "$children_json"
}

###############################################################################
# Preset composition builders per page type
#
# NOTE: the SaaS CMS Visual Builder outline layout is flat at the component
# level — nested `nodes` under a nodeType:'component' parent are silently
# stripped by the server. So our carousel/pricing/counter/FAQ containers are
# plain component nodes at outline level; the live-preview renderer fills them
# with sensible default children (movie cards, pricing plans, FAQ items) until
# an author replaces them through the CMS.
###############################################################################

movie_carousel_block() {
  local title="$1"
  make_component_node "Movie Carousel" "MovieCarouselBlock" "$(json_props SectionTitle "$title")"
}

pricing_tabs_block() {
  make_component_node "Subscription Plans" "PricingTabsBlock" '{}'
}

counter_block() {
  make_component_node "By the numbers" "CounterSectionBlock" '{}'
}

faq_block() {
  make_component_node "FAQ" "FaqSectionBlock" '{"Title":"Frequently Asked Questions","Description":"Everything you need to know before signing up."}'
}

# --- Page compositions ------------------------------------------------------

comp_home() {
  local hero trending movies pricing faq newsletter
  hero=$(make_component_node "Hero Banner" "HeroBannerBlock" '{"Title":"Welcome to OptiOTT","Duration":"2h 15min","Quality":"4K HDR","Genres":"Action, Drama, Thriller","BackgroundImage":"/assets/img/home-one/home-1-banner.jpg","LinkToDetail":"/movies/the-dark-knight","VideoUrl":"https://www.youtube.com/watch?v=Cn4G2lZ_g2I"}')
  trending=$(make_component_node "Trending Banner" "TrendingBannerBlock" '{"Title":"Blockbuster Singles Day Out","Description":"Stream the biggest cinematic events with crystal-clear 4K HDR on any device.","BackgroundImage":"/assets/img/cta-movie/movie-bg-3.jpg","VideoUrl":"https://www.youtube.com/watch?v=Cn4G2lZ_g2I","PlayButton":true}')
  movies=$(movie_carousel_block "This Week's Hot Picks")
  pricing=$(pricing_tabs_block)
  faq=$(faq_block)
  newsletter=$(make_component_node "Newsletter" "NewsletterBlock" '{"Title":"Stay in the loop","Description":"Get notified about new releases and exclusive premieres.","Placeholder":"your@email.com"}')
  make_experience_composition "Home" "$hero" "$trending" "$movies" "$pricing" "$faq" "$newsletter"
}

comp_movies_listing() {
  local title carousel
  title=$(make_component_node "Movies Title" "SectionTitleBlock" '{"Heading":"All Movies","Subtitle":"Browse our full library","Alignment":"center"}')
  carousel=$(movie_carousel_block "Popular This Week")
  make_experience_composition "Movies" "$title" "$carousel"
}

comp_tv_listing() {
  local title carousel
  title=$(make_component_node "TV Shows Title" "SectionTitleBlock" '{"Heading":"TV Shows","Subtitle":"Binge-worthy series","Alignment":"center"}')
  carousel=$(movie_carousel_block "Currently Trending")
  make_experience_composition "TV Shows" "$title" "$carousel"
}

comp_web_series_listing() {
  local title carousel
  title=$(make_component_node "Web Series Title" "SectionTitleBlock" '{"Heading":"Web Series","Subtitle":"Original productions","Alignment":"center"}')
  carousel=$(movie_carousel_block "Featured Series")
  make_experience_composition "Web Series" "$title" "$carousel"
}

comp_about() {
  local about counter faq newsletter
  about=$(make_component_node "About OptiOTT" "AboutSectionBlock" '{"Heading":"About OptiOTT","StoryTitle":"Stream smarter","StoryParagraphs":"OptiOTT is a next-generation streaming platform powered by Optimizely SaaS CMS.\n\nMillions of titles, 4K HDR quality, and personalized recommendations across every device you own.","MainImage":"/assets/img/about/01.jpg"}')
  counter=$(counter_block)
  faq=$(faq_block)
  newsletter=$(make_component_node "Newsletter" "NewsletterBlock" '{"Title":"Stay connected","Description":"Updates on new releases and company news.","Placeholder":"your@email.com"}')
  make_experience_composition "About Us" "$about" "$counter" "$faq" "$newsletter"
}

comp_pricing() {
  local title pricing faq newsletter
  title=$(make_component_node "Pricing Title" "SectionTitleBlock" '{"Heading":"Choose Your Plan","Subtitle":"Flexible plans for every viewer","Alignment":"center"}')
  pricing=$(pricing_tabs_block)
  faq=$(faq_block)
  newsletter=$(make_component_node "Newsletter" "NewsletterBlock" '{"Title":"Not sure which plan?","Description":"Sign up for a 7-day free trial, cancel anytime.","Placeholder":"your@email.com"}')
  make_experience_composition "Pricing" "$title" "$pricing" "$faq" "$newsletter"
}

comp_contact() {
  local title form newsletter
  title=$(make_component_node "Contact Title" "SectionTitleBlock" '{"Heading":"Get in touch","Subtitle":"We would love to hear from you","Alignment":"center"}')
  form=$(make_component_node "Contact Form" "ContactFormBlock" '{"Title":"Send us a message","Description":"Reach our support team at support@optiott.com or use the form below.","SubmitButtonText":"Send Message"}')
  newsletter=$(make_component_node "Newsletter" "NewsletterBlock" '{"Title":"Stay in touch","Description":"Subscribe for product updates.","Placeholder":"your@email.com"}')
  make_experience_composition "Contact Us" "$title" "$form" "$newsletter"
}

comp_team() {
  local title about
  title=$(make_component_node "Team Title" "SectionTitleBlock" '{"Heading":"Meet the Team","Subtitle":"The people behind OptiOTT","Alignment":"center"}')
  about=$(make_component_node "Team Story" "AboutSectionBlock" '{"Heading":"Built by streaming nerds","StoryTitle":"Our story","StoryParagraphs":"A small team with big ideas about how content should be delivered.\n\nWe believe streaming should be fast, personal, and beautiful.","MainImage":"/assets/img/about/01.jpg"}')
  make_experience_composition "Our Team" "$title" "$about"
}

comp_blog_listing() {
  local title carousel
  title=$(make_component_node "Blog Title" "SectionTitleBlock" '{"Heading":"OptiOTT Blog","Subtitle":"Behind the scenes","Alignment":"center"}')
  carousel=$(movie_carousel_block "Latest Posts")
  make_experience_composition "Blog" "$title" "$carousel"
}

comp_coming_soon() {
  local hero
  hero=$(make_component_node "Coming Soon Hero" "HeroBannerBlock" '{"Title":"Something big is coming","Duration":"Coming Soon","Quality":"4K HDR","Genres":"Stay tuned","BackgroundImage":"/assets/img/coming-soon-bg.jpg"}')
  make_experience_composition "Coming Soon" "$hero"
}

comp_login() {
  local title
  title=$(make_component_node "Login Title" "SectionTitleBlock" '{"Heading":"Sign in to OptiOTT","Subtitle":"Welcome back","Alignment":"center"}')
  make_experience_composition "Login" "$title"
}

comp_404() {
  local title
  title=$(make_component_node "Not Found" "SectionTitleBlock" '{"Heading":"404 \u2014 Page not found","Subtitle":"The title you are looking for has left the library","Alignment":"center"}')
  make_experience_composition "404" "$title"
}

# json_props KEY VALUE [KEY VALUE ...]   -> outputs a JSON object string
json_props() {
  python3 -c "
import json, sys
pairs = sys.argv[1:]
obj = {pairs[i]: pairs[i+1] for i in range(0, len(pairs), 2)}
print(json.dumps(obj))
" "$@"
}

comp_movie_detail() {
  local name="$1"
  local hero carousel hero_props
  hero_props=$(json_props \
    Title "$name" \
    Duration "2h 28m" \
    Quality "4K HDR" \
    Genres "Action, Drama" \
    BackgroundImage "/assets/img/movie-details-bg.jpg" \
    VideoUrl "https://www.youtube.com/watch?v=Cn4G2lZ_g2I" \
    LinkToDetail "/movies")
  hero=$(make_component_node "Movie Hero" "HeroBannerBlock" "$hero_props")
  carousel=$(movie_carousel_block "More Like This")
  make_experience_composition "$name" "$hero" "$carousel"
}

comp_show_detail() {
  local name="$1"
  local hero carousel hero_props
  hero_props=$(json_props \
    Title "$name" \
    Duration "Season 1" \
    Quality "4K HDR" \
    Genres "Drama, Mystery" \
    BackgroundImage "/assets/img/tv-show-details-bg.jpg" \
    VideoUrl "https://www.youtube.com/watch?v=Cn4G2lZ_g2I" \
    LinkToDetail "/tv-shows")
  hero=$(make_component_node "Show Hero" "HeroBannerBlock" "$hero_props")
  carousel=$(movie_carousel_block "Similar Shows")
  make_experience_composition "$name" "$hero" "$carousel"
}

comp_blog_detail() {
  local name="$1"
  local title about title_props
  title_props=$(json_props Heading "$name" Subtitle "OptiOTT Blog" Alignment "center")
  title=$(make_component_node "Post Title" "SectionTitleBlock" "$title_props")
  about=$(make_component_node "Post Body" "AboutSectionBlock" '{"Heading":"Article","StoryTitle":"Read more","StoryParagraphs":"Placeholder article body. Content authors can replace this with real article copy, images, and embeds via the Outline editor.\n\nOptiOTT editors can drag in additional sections\u2014text, images, video\u2014directly from the Visual Builder panel.","MainImage":"/assets/img/blog/01.jpg"}')
  make_experience_composition "$name" "$title" "$about"
}

###############################################################################
# do_populate KEY DISPLAY_NAME COMPOSITION_JSON
###############################################################################
do_populate() {
  local key="$1" name="$2" comp="$3"
  refresh_token
  local version
  version=$(get_latest_version "$key")
  if [ -z "$version" ]; then
    echo -e "${RED}  SKIP $name ($key) - no version found${NC}"
    return
  fi
  if patch_composition "$key" "$version" "$comp"; then
    echo -e "${GREEN}  OK   $name ($key v$version)${NC}"
  else
    echo -e "${RED}  FAIL $name ($key v$version)${NC}"
  fi
}

###############################################################################
# Run
###############################################################################

echo "============================================="
echo " OptiOTT Composition Populator"
echo "============================================="
refresh_token
echo -e "${GREEN}Token acquired${NC}"
echo

# Home variants
do_populate "c2f3b023d8354cecb018c1fee678bfb2" "Home (/home/)" "$(comp_home)"
do_populate "3ed9383c6f434bba87e2915040e07358" "Home (/en/)"   "$(comp_home)"

# Listings
do_populate "e00d399e6ff543ccb4bb57da30f2dd38" "Movies listing"     "$(comp_movies_listing)"
do_populate "0502ef5fe12141a7a07c37eef1301d5e" "TV Shows listing"   "$(comp_tv_listing)"
do_populate "7d3ae66702a74117a56ae7e0d2ea8aa0" "Web Series listing" "$(comp_web_series_listing)"
do_populate "2fa35f20cc794d808a5b7a8053638c20" "Blog listing"       "$(comp_blog_listing)"

# Standard pages
do_populate "669d0b5b85c742569bd38bafa69246da" "About Us"       "$(comp_about)"
do_populate "5541e3d5755d4e7bbf8dd5abdb1778fd" "Pricing"        "$(comp_pricing)"
do_populate "c76839b8c9c947ebb65121257440df1f" "Contact Us"     "$(comp_contact)"
do_populate "c2d4d7cdf85b492ba26ed6f6cec2349b" "Our Team"       "$(comp_team)"
do_populate "da7a604071da445894be4a8112b3fc1c" "Coming Soon"    "$(comp_coming_soon)"
do_populate "c862305c64a94daf9cafd93cd1ac3460" "Login"          "$(comp_login)"
do_populate "659e031783e845feb3ddab21ac3da515" "404"            "$(comp_404)"

# Movie details
do_populate "93995899c84b4839912c303ae9852e84" "The Dark Knight"    "$(comp_movie_detail 'The Dark Knight')"
do_populate "2587e29cb7de42b59399e35ca8e38f82" "Inception"          "$(comp_movie_detail 'Inception')"
do_populate "9159494ad0be4304b52648610d8fcbc0" "The Batman"         "$(comp_movie_detail 'The Batman')"
do_populate "a10360ab93f34be689e851efb09d60f9" "Interstellar"       "$(comp_movie_detail 'Interstellar')"
do_populate "fb65e7a59eb347029cf643de4243fa72" "Oppenheimer"        "$(comp_movie_detail 'Oppenheimer')"
do_populate "5577a27df2004c06ab4893e123efd8c5" "Dune Part Two"      "$(comp_movie_detail 'Dune Part Two')"

# TV show details
do_populate "56b0f0a5f12c4a4ea823b323cd91d502" "Stranger Things"      "$(comp_show_detail 'Stranger Things')"
do_populate "0fa842112b304363be884218ae65bae8" "The Last of Us"       "$(comp_show_detail 'The Last of Us')"
do_populate "a533b6b43baf4bf8adcc9c827e22fe48" "House of the Dragon"  "$(comp_show_detail 'House of the Dragon')"
do_populate "3373fe616b864d3bbfaaa10f7aa68a4b" "The Boys"             "$(comp_show_detail 'The Boys')"

# Web series details
do_populate "2dea344c649c42229c65ede1c98944bf" "Dark"        "$(comp_show_detail 'Dark')"
do_populate "336ae6e71076462d8f47689781e9dfb2" "Wednesday"   "$(comp_show_detail 'Wednesday')"
do_populate "031dd550af9e4ca393b270350f15bd29" "Mindhunter"  "$(comp_show_detail 'Mindhunter')"

# Blog posts
do_populate "3977a79e393f413d9ced97a473f2b50b" "Behind the Scenes"         "$(comp_blog_detail 'Behind the Scenes')"
do_populate "3d9ce045b78b4d8b8877bac5bc6d86d9" "The Future of Streaming"   "$(comp_blog_detail 'The Future of Streaming')"
do_populate "71337b8f7bf14e0e95cb61e30b77a635" "Top 10 Movies of 2026"     "$(comp_blog_detail 'Top 10 Movies of 2026')"

echo
echo "============================================="
echo -e "${GREEN}Composition population complete${NC}"
echo "============================================="
