#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# create-content.sh
# Creates all OptiOTT content items in Optimizely SaaS CMS via the REST API.
###############################################################################

API_BASE="https://api.cms.optimizely.com"
CLIENT_ID="8c7498ddde7e4e539272617aec9f3fa0"
CLIENT_SECRET="ZCYbsH1LXqWAIcMT3QCbP0EZPhmCtCZX0eehNyYiYS3aD4U3"
GRAPH_KEY="MWBKNPSKoVqXrDvDmmB0k34X2HpAMR3hPWggE5WTXek4ineE"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TOKEN=""
TOKEN_EXPIRES=0

###############################################################################
# get_token  – refresh only when expired
###############################################################################
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
  TOKEN_EXPIRES=$(( now + 240 ))   # refresh 60 s before the 300 s TTL
}

###############################################################################
# create_content
#   $1  contentType   $2  displayName   $3  container
#   $4  routeSegment  $5  locale ("en" or "none")
#   $6  properties JSON string
# Prints the new content key to stdout.
###############################################################################
create_content() {
  local ct="$1" dn="$2" ctr="$3" rs="$4" loc="$5" props="$6"
  refresh_token

  local body
  body=$(python3 -c "
import json, sys
body = {'contentType': sys.argv[1], 'displayName': sys.argv[2],
        'status': 'published', 'container': sys.argv[3]}
if sys.argv[4]:
    body['routeSegment'] = sys.argv[4]
if sys.argv[5] != 'none':
    body['locale'] = sys.argv[5]
props = json.loads(sys.argv[6]) if sys.argv[6] else {}
if props:
    body['properties'] = props
print(json.dumps(body))
" "$ct" "$dn" "$ctr" "$rs" "$loc" "$props")

  local resp key err
  resp=$(curl -s -X POST "$API_BASE/preview3/experimental/content" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$body")

  key=$(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('key',''))" 2>/dev/null || true)

  if [ -n "$key" ] && [ "$key" != "" ]; then
    printf "${GREEN}  OK  %-30s key=%s${NC}\n" "$dn" "$key" >&2
    echo "$key"
  else
    err=$(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('detail',''))" 2>/dev/null || true)
    printf "${RED}  FAIL %-30s %s${NC}\n" "$dn" "$err" >&2
    echo ""
  fi
}

###############################################################################
# cap – alias for create_content (creates as published directly)
###############################################################################
cap() {
  create_content "$@"
}

###############################################################################
echo "============================================="
echo " OptiOTT Content Creation Script"
echo "============================================="
echo ""

# ── 1. Auth ──────────────────────────────────────────────────────────────────
echo "[1/5] Authenticating..."
refresh_token
echo -e "${GREEN}  Token acquired${NC}"
echo ""

# ── 2. Root key ──────────────────────────────────────────────────────────────
echo "[2/5] Finding root content key..."
ROOT_KEY=$(curl -s "https://cg.optimizely.com/content/v2?auth=$GRAPH_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ _Content(where:{_metadata:{types:{eq:\"BlankExperience\"}}},limit:1){ items{ _metadata{ key } } } }"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['_Content']['items'][0]['_metadata']['key'])" 2>/dev/null)

if [ -z "$ROOT_KEY" ]; then
  echo -e "${RED}Could not find root key${NC}"; exit 1
fi
echo -e "${GREEN}  Root key: $ROOT_KEY${NC}"
echo ""

# ── 3. SiteSettings ─────────────────────────────────────────────────────────
echo "[3/5] Creating SiteSettings..."
SITE_SETTINGS_KEY=$(cap "SiteSettings" "Site Settings" "$ROOT_KEY" "" "en" \
  '{"SiteName":"OptiOTT","ContactAddress":"1234 Streaming Ave, Hollywood, CA","ContactEmail":"info@optiott.com","ContactPhone":"+1 (555) 123-4567","ContactHours":"Mon-Fri: 9am-6pm","SearchPlaceholder":"Search movies, shows...","OffcanvasDescription":"Your ultimate streaming destination for movies, TV shows, and web series.","NewsletterTitle":"Stay Updated","NewsletterDescription":"Subscribe to get the latest updates on new releases","CopyrightText":"\u00a9 2026 OptiOTT. All rights reserved."}')
echo ""

# ── 4. Pages ─────────────────────────────────────────────────────────────────
echo "[4/5] Creating pages under root..."

echo "  -- HomePage --"
HOME_KEY=$(cap "HomePage" "Home" "$ROOT_KEY" "" "en" \
  '{"MetaTitle":"OptiOTT - Your Ultimate Streaming Destination"}')

echo "  -- AboutPage --"
ABOUT_KEY=$(cap "AboutPage" "About Us" "$ROOT_KEY" "about" "en" \
  '{"MetaTitle":"About Us - OptiOTT","BreadcrumbTitle":"About Us"}')

echo "  -- ContactPage --"
CONTACT_KEY=$(cap "ContactPage" "Contact Us" "$ROOT_KEY" "contact" "en" \
  '{"MetaTitle":"Contact Us - OptiOTT","BreadcrumbTitle":"Contact Us"}')

echo "  -- PricingPage --"
PRICING_KEY=$(cap "PricingPage" "Pricing" "$ROOT_KEY" "pricing" "en" \
  '{"MetaTitle":"Pricing - OptiOTT","BreadcrumbTitle":"Pricing Plans"}')

echo "  -- TeamPage --"
TEAM_KEY=$(cap "TeamPage" "Our Team" "$ROOT_KEY" "team" "en" \
  '{"MetaTitle":"Our Team - OptiOTT","BreadcrumbTitle":"Our Team"}')

echo "  -- MovieListingPage (Movies) --"
MOVIES_KEY=$(cap "MovieListingPage" "Movies" "$ROOT_KEY" "movies" "en" \
  '{"MetaTitle":"Movies - OptiOTT","BreadcrumbTitle":"Movies","ContentType":"movie"}')

echo "  -- MovieListingPage (TV Shows) --"
TVSHOWS_KEY=$(cap "MovieListingPage" "TV Shows" "$ROOT_KEY" "tv-shows" "en" \
  '{"MetaTitle":"TV Shows - OptiOTT","BreadcrumbTitle":"TV Shows","ContentType":"tvshow"}')

echo "  -- BlogListingPage --"
BLOG_KEY=$(cap "BlogListingPage" "Blog" "$ROOT_KEY" "blog" "en" \
  '{"MetaTitle":"Blog - OptiOTT","BreadcrumbTitle":"Latest News"}')

echo "  -- ComingSoonPage --"
COMINGSOON_KEY=$(cap "ComingSoonPage" "Coming Soon" "$ROOT_KEY" "coming-soon" "en" \
  '{"MetaTitle":"Coming Soon - OptiOTT","Title":"Something Amazing is Coming","Description":"We are working on something incredible."}')

echo "  -- LoginPage --"
LOGIN_KEY=$(cap "LoginPage" "Login" "$ROOT_KEY" "login" "en" \
  '{"MetaTitle":"Login - OptiOTT","FormTitle":"Welcome Back"}')

echo "  -- ErrorPage --"
ERROR_KEY=$(cap "ErrorPage" "404" "$ROOT_KEY" "404" "en" \
  '{"Title":"Page Not Found","Subtitle":"Error 404","Description":"The page you are looking for does not exist.","ButtonText":"Go Home","ButtonLink":"/"}')

echo ""

# ── 5. Child content ─────────────────────────────────────────────────────────
echo "[5/5] Creating child content..."

if [ -n "$MOVIES_KEY" ]; then
  echo "  -- Sample Movies (ContentDetailPage under Movies) --"

  DK_KEY=$(cap "ContentDetailPage" "The Dark Knight" "$MOVIES_KEY" "the-dark-knight" "en" \
    '{"MetaTitle":"The Dark Knight","Synopsis":"When the menace known as the Joker wreaks havoc...","Duration":"2h 32min","Quality":"HD","Rating":"9.0","Genres":"Action, Crime, Drama","Cast":"Christian Bale, Heath Ledger","ReleaseDate":"2008"}')

  INC_KEY=$(cap "ContentDetailPage" "Inception" "$MOVIES_KEY" "inception" "en" \
    '{"MetaTitle":"Inception","Synopsis":"A thief who steals corporate secrets through dream-sharing...","Duration":"2h 28min","Quality":"4K","Rating":"8.8","Genres":"Action, Sci-Fi","Cast":"Leonardo DiCaprio, Joseph Gordon-Levitt","ReleaseDate":"2010"}')

  INT_KEY=$(cap "ContentDetailPage" "Interstellar" "$MOVIES_KEY" "interstellar" "en" \
    '{"MetaTitle":"Interstellar","Synopsis":"A team of explorers travel through a wormhole...","Duration":"2h 49min","Quality":"4K","Rating":"8.7","Genres":"Adventure, Drama, Sci-Fi","Cast":"Matthew McConaughey, Anne Hathaway","ReleaseDate":"2014"}')
else
  echo -e "${YELLOW}  Skipping movies – Movies page missing${NC}"
fi

if [ -n "$BLOG_KEY" ]; then
  echo "  -- Sample Blog Posts (BlogDetailPage under Blog) --"

  BP1_KEY=$(cap "BlogDetailPage" "The Future of Streaming" "$BLOG_KEY" "future-of-streaming" "en" \
    '{"MetaTitle":"The Future of Streaming","Author":"OptiOTT Team","Tags":"streaming, technology","Category":"Technology"}')

  BP2_KEY=$(cap "BlogDetailPage" "Top 10 Movies of 2026" "$BLOG_KEY" "top-10-movies-2026" "en" \
    '{"MetaTitle":"Top 10 Movies of 2026","Author":"Film Critic","Tags":"movies, reviews","Category":"Reviews"}')
else
  echo -e "${YELLOW}  Skipping blog posts – Blog page missing${NC}"
fi

echo ""
echo "============================================="
echo " Done!  Summary of content keys:"
echo "============================================="
printf "  %-20s %s\n" "Root"           "$ROOT_KEY"
printf "  %-20s %s\n" "SiteSettings"   "${SITE_SETTINGS_KEY:-FAILED}"
printf "  %-20s %s\n" "Home"           "${HOME_KEY:-FAILED}"
printf "  %-20s %s\n" "About"          "${ABOUT_KEY:-FAILED}"
printf "  %-20s %s\n" "Contact"        "${CONTACT_KEY:-FAILED}"
printf "  %-20s %s\n" "Pricing"        "${PRICING_KEY:-FAILED}"
printf "  %-20s %s\n" "Team"           "${TEAM_KEY:-FAILED}"
printf "  %-20s %s\n" "Movies"         "${MOVIES_KEY:-FAILED}"
printf "  %-20s %s\n" "TV Shows"       "${TVSHOWS_KEY:-FAILED}"
printf "  %-20s %s\n" "Blog"           "${BLOG_KEY:-FAILED}"
printf "  %-20s %s\n" "Coming Soon"    "${COMINGSOON_KEY:-FAILED}"
printf "  %-20s %s\n" "Login"          "${LOGIN_KEY:-FAILED}"
printf "  %-20s %s\n" "404"            "${ERROR_KEY:-FAILED}"
printf "  %-20s %s\n" "Dark Knight"    "${DK_KEY:-SKIPPED}"
printf "  %-20s %s\n" "Inception"      "${INC_KEY:-SKIPPED}"
printf "  %-20s %s\n" "Interstellar"   "${INT_KEY:-SKIPPED}"
printf "  %-20s %s\n" "Blog Post 1"    "${BP1_KEY:-SKIPPED}"
printf "  %-20s %s\n" "Blog Post 2"    "${BP2_KEY:-SKIPPED}"
