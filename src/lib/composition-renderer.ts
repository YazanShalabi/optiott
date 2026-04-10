/**
 * Renders an Optimizely Visual Builder composition to an HTML string.
 *
 * Each component contentType (HeroBannerBlock, MovieCarouselBlock, etc.) has a
 * matching renderer function below that produces the same markup as the
 * corresponding section in the WowTube HTML template but with authored CMS
 * values interpolated. Every editable field carries a `data-epi-edit` attribute
 * so Optimizely's on-page editor can target it.
 */

import type { ComponentNode, ExperienceData } from './composition-query'

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function attr(value: unknown): string {
  return escapeHtml(value)
}

function urlDefault(v: unknown): string {
  if (!v) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'object' && v !== null && 'default' in v) {
    const d = (v as { default?: string }).default
    return d ?? ''
  }
  return ''
}

function dataEdit(key: string | undefined, property: string): string {
  if (!key) return ''
  return ` data-epi-block-id="${attr(key)}" data-epi-edit="${attr(property)}"`
}

type Props = Record<string, unknown>

function getProps(node: ComponentNode): Props {
  const c = node.component ?? {}
  // Strip _metadata, the rest are the authored properties
  const { _metadata: _omit, ...rest } = c as Props
  return rest
}

function primaryType(node: ComponentNode): string | undefined {
  const types = node.component?._metadata?.types ?? []
  // First non-underscore type is the concrete content type
  return types.find((t) => !t.startsWith('_'))
}

/* -----------------------------------------------------------------------------
 * Individual component renderers
 * -------------------------------------------------------------------------- */

function renderHeroBannerBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const bg = urlDefault(p.BackgroundImage) || '/assets/img/home-one/home-1-banner.jpg'
  const title = (p.Title as string) || 'Featured Title'
  const duration = (p.Duration as string) || '2h 15min'
  const quality = (p.Quality as string) || '4K HDR'
  const genres = (p.Genres as string) || 'Action, Drama'
  const videoUrl =
    (p.VideoUrl as string) || 'https://www.youtube.com/watch?v=Cn4G2lZ_g2I'
  const link = urlDefault(p.LinkToDetail) || '/movie-details'

  return `
  <section class="hero-section section-padding bg-cover" style="background-image: url('/assets/img/dark-gradient-bg.jpg');" data-composition-node="${attr(k)}">
    <div class="hero-1">
      <div class="container-fluid">
        <div class="row g-4">
          <div class="col-lg-12">
            <div class="hero-image" style="background-image: url('${attr(bg)}'); background-size: cover; background-position: center; min-height: 480px; border-radius: 12px; position: relative;">
              <a href="${attr(videoUrl)}" class="video-btn ripple video-popup">
                <i class="fa-solid fa-play"></i>
              </a>
              <div class="movie-content">
                <ul class="post-time">
                  <li><i class="fa-regular fa-clock"></i> <span${dataEdit(k, 'Duration')}>${escapeHtml(duration)}</span></li>
                  <li><i class="fa-sharp fa-regular fa-tv"></i> <span${dataEdit(k, 'Quality')}>${escapeHtml(quality)}</span></li>
                </ul>
                <h3><a href="${attr(link)}"${dataEdit(k, 'Title')}>${escapeHtml(title)}</a></h3>
                <p${dataEdit(k, 'Genres')}>${escapeHtml(genres)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`
}

function renderTrendingBannerBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const title = (p.Title as string) || 'Blockbuster singles day out'
  const description =
    (p.Description as string) ||
    'The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco.'
  const bg = urlDefault(p.BackgroundImage) || '/assets/img/cta-movie/movie-bg-3.jpg'
  const videoUrl =
    (p.VideoUrl as string) || 'https://www.youtube.com/watch?v=Cn4G2lZ_g2I'
  const showPlay = p.PlayButton !== false

  return `
  <section class="movie-section fix" data-composition-node="${attr(k)}">
    <div class="container">
      <div class="cta-movie-banner-area section-padding">
        <div class="section-title text-center">
          <h2><img src="/assets/img/lightning.png" alt="trending"> TRENDING NOW</h2>
        </div>
        <div class="cta-movie-banner-items bg-cover" style="background-image: url('${attr(bg)}');">
          <div class="row g-4">
            <div class="col-xl-4">
              <div class="banner-movie-content">
                ${showPlay ? `<a href="${attr(videoUrl)}" class="video-btn ripple video-popup"><i class="fa-solid fa-play"></i></a>` : ''}
                <h2${dataEdit(k, 'Title')}>${escapeHtml(title)}</h2>
                <p${dataEdit(k, 'Description')}>${escapeHtml(description)}</p>
              </div>
            </div>
            <div class="col-xl-8"></div>
          </div>
        </div>
      </div>
    </div>
  </section>`
}

function renderSectionTitleBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const heading = (p.Heading as string) || 'Section Title'
  const subtitle = (p.Subtitle as string) || ''
  const alignment = (p.Alignment as string) || 'center'
  return `
  <div class="container" data-composition-node="${attr(k)}">
    <div class="section-title text-${attr(alignment)}">
      ${subtitle ? `<span${dataEdit(k, 'Subtitle')}>${escapeHtml(subtitle)}</span>` : ''}
      <h2${dataEdit(k, 'Heading')}>${escapeHtml(heading)}</h2>
    </div>
  </div>`
}

function renderMovieCarouselBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const sectionTitle = (p.SectionTitle as string) || "This Week's Hot Picks"
  const showDots = p.ShowDots !== false
  // Child MovieCards come from nested composition nodes if any; else render defaults
  const childCards = (node.nodes ?? [])
    .filter((n) => n.nodeType === 'component' && primaryType(n) === 'MovieCardBlock')
    .map((child, i) => renderMovieCardFromNode(child, i + 1))
    .join('')
  const cards =
    childCards.length > 0 ? childCards : [1, 2, 3, 4, 5].map((i) => renderMovieCard(i)).join('')
  return `
  <section class="movie-section style-2 section-padding fix" data-composition-node="${attr(k)}">
    <div class="container">
      <div class="section-title text-center">
        <h2${dataEdit(k, 'SectionTitle')}>${escapeHtml(sectionTitle)}</h2>
      </div>
    </div>
    <div class="swiper movie-slider-2">
      <div class="swiper-wrapper">
        ${cards}
      </div>
      ${showDots ? '<div class="swiper-dot text-center pt-5"></div>' : ''}
    </div>
  </section>`
}

function renderMovieCardFromNode(node: ComponentNode, idx: number): string {
  const p = getProps(node)
  const k = node.key
  const n = String(idx).padStart(2, '0')
  const img = urlDefault(p.Image) || `/assets/img/movie/${((idx + 5) % 20 || 1).toString().padStart(2, '0')}.jpg`
  const title = (p.Title as string) || 'Untitled'
  const duration = (p.Duration as string) || '02h 45m'
  const quality = (p.Quality as string) || '4K Quality'
  const video = (p.VideoUrl as string) || 'https://www.youtube.com/watch?v=Cn4G2lZ_g2I'
  const link = urlDefault(p.LinkToDetail) || '/movie-details'
  return `
  <div class="swiper-slide" data-composition-node="${attr(k)}">
    <div class="movie-box-items-2">
      <div class="movie-image">
        <img src="${attr(img)}" alt="movie">
        <div class="number">${n}</div>
        <div class="movie-content">
          <a href="${attr(video)}" class="video-btn ripple video-popup"><i class="fa-solid fa-play"></i></a>
          <ul class="post-time">
            <li><i class="fa-regular fa-clock"></i> <span${dataEdit(k, 'Duration')}>${escapeHtml(duration)}</span></li>
            <li><i class="fa-sharp fa-regular fa-tv"></i> <span${dataEdit(k, 'Quality')}>${escapeHtml(quality)}</span></li>
          </ul>
          <h3><a href="${attr(link)}"${dataEdit(k, 'Title')}>${escapeHtml(title)}</a></h3>
        </div>
      </div>
    </div>
  </div>`
}

function renderMovieCard(i: number): string {
  const n = String(i).padStart(2, '0')
  const img = `/assets/img/movie/${(i + 5).toString().padStart(2, '0')}.jpg`
  return `
  <div class="swiper-slide">
    <div class="movie-box-items-2">
      <div class="movie-image">
        <img src="${img}" alt="movie">
        <div class="number">${n}</div>
        <div class="movie-content">
          <a href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I" class="video-btn ripple video-popup"><i class="fa-solid fa-play"></i></a>
          <ul class="post-time">
            <li><i class="fa-regular fa-clock"></i> 02h 45m</li>
            <li><i class="fa-sharp fa-regular fa-tv"></i> 4K Quality</li>
          </ul>
          <h3><a href="/movie-details">Featured Movie ${i}</a></h3>
          <p>Sample description for the movie card. Authors can replace this with real content.</p>
        </div>
      </div>
    </div>
  </div>`
}

function renderCategoryCardBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const title = (p.Title as string) || 'Category'
  const subtitle = (p.Subtitle as string) || '120+ movies'
  const img = urlDefault(p.Image) || '/assets/img/category/01.jpg'
  const link = urlDefault(p.LinkToPage) || '/movies'
  return `
  <div class="swiper-slide" data-composition-node="${attr(k)}">
    <div class="category-box-items">
      <div class="category-image"><img src="${attr(img)}" alt="${attr(title)}"></div>
      <div class="category-content">
        <h3><a href="${attr(link)}"${dataEdit(k, 'Title')}>${escapeHtml(title)}</a></h3>
        <span${dataEdit(k, 'Subtitle')}>${escapeHtml(subtitle)}</span>
      </div>
    </div>
  </div>`
}

function renderPricingTabsBlock(node: ComponentNode): string {
  const k = node.key
  // Children are PricingCardBlock; fall back to a preset if none provided.
  const children = (node.nodes ?? []).filter(
    (n) => n.nodeType === 'component' && primaryType(n) === 'PricingCardBlock'
  )
  const cardsHtml =
    children.length > 0
      ? children.map(renderPricingCardBlock).join('')
      : [
          ['Basic', '$4.99', '/mo', 'HD streaming for casual viewers'],
          ['Standard', '$9.99', '/mo', 'Full HD streaming on 2 devices'],
          ['Premium', '$14.99', '/mo', '4K HDR streaming on 4 devices'],
        ]
          .map(
            ([name, price, period, desc]) => `
        <div class="col-lg-4 col-md-6">
          <div class="pricing-box-items">
            <div class="pricing-header"><h3>${name}</h3><h2>${price}<span>${period}</span></h2></div>
            <p>${desc}</p>
            <a href="/contact" class="theme-btn text-center">Subscribe</a>
          </div>
        </div>`
          )
          .join('')
  return `
  <section class="pricing-section section-padding fix" data-composition-node="${attr(k)}">
    <div class="container">
      <div class="row g-4 justify-content-center">
        ${cardsHtml}
      </div>
    </div>
  </section>`
}

function renderPricingCardBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const planName = (p.PlanName as string) || 'Plan'
  const description = (p.Description as string) || ''
  const price = (p.Price as string) || '$0'
  const pricePeriod = (p.PricePeriod as string) || '/mo'
  const trialText = (p.TrialButtonText as string) || ''
  const trialLink = (p.TrialButtonLink as string) || '#'
  const chooseText = (p.ChooseButtonText as string) || 'Choose'
  const chooseLink = (p.ChooseButtonLink as string) || '/contact'
  return `
  <div class="col-lg-4 col-md-6" data-composition-node="${attr(k)}">
    <div class="pricing-box-items">
      <div class="pricing-header">
        <h3${dataEdit(k, 'PlanName')}>${escapeHtml(planName)}</h3>
        <h2${dataEdit(k, 'Price')}>${escapeHtml(price)}<span${dataEdit(k, 'PricePeriod')}>${escapeHtml(pricePeriod)}</span></h2>
      </div>
      ${description ? `<p${dataEdit(k, 'Description')}>${escapeHtml(description)}</p>` : ''}
      ${trialText ? `<a href="${attr(trialLink)}" class="theme-btn style-2 me-2"${dataEdit(k, 'TrialButtonText')}>${escapeHtml(trialText)}</a>` : ''}
      <a href="${attr(chooseLink)}" class="theme-btn"${dataEdit(k, 'ChooseButtonText')}>${escapeHtml(chooseText)}</a>
    </div>
  </div>`
}

function renderFaqSectionBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const title = (p.Title as string) || 'Frequently Asked Questions'
  const description = (p.Description as string) || ''
  const ctaText = (p.CtaButtonText as string) || ''
  const ctaLink = (p.CtaButtonLink as string) || '#'
  // Children are FaqItemBlock
  const childItems = (node.nodes ?? []).filter(
    (n) => n.nodeType === 'component' && primaryType(n) === 'FaqItemBlock'
  )
  const items =
    childItems.length > 0
      ? childItems
      : ([
          {
            _def: true,
            Number: '01',
            Question: 'How much does a subscription cost?',
            Answer: 'Plans start at $4.99/month for HD streaming on one device.',
          },
          {
            _def: true,
            Number: '02',
            Question: 'Can I watch on multiple devices?',
            Answer: 'Yes, depending on your plan you can stream on 1-4 devices simultaneously.',
          },
          {
            _def: true,
            Number: '03',
            Question: 'Is there a free trial?',
            Answer: 'New members get a 7-day free trial on any plan.',
          },
        ] as unknown as ComponentNode[])

  return `
  <section class="faq-section section-padding fix" data-composition-node="${attr(k)}">
    <div class="container">
      <div class="section-title text-center">
        <h2${dataEdit(k, 'Title')}>${escapeHtml(title)}</h2>
        ${description ? `<p${dataEdit(k, 'Description')}>${escapeHtml(description)}</p>` : ''}
      </div>
      <div class="faq-content">
        <div class="accordion" id="faqAccordion-${attr(k)}">
          ${items
            .map((item, i) => {
              const isDefault = (item as unknown as { _def?: boolean })._def
              const ip = isDefault ? (item as unknown as Props) : getProps(item as ComponentNode)
              const ik = isDefault ? `d${i}` : (item as ComponentNode).key || `i${i}`
              // FaqItemBlock.Number is aliased to FaqNumber in the GraphQL query
              // (to avoid a conflict with CounterItemBlock.Number which is Int).
              const num =
                (ip.FaqNumber as string) ||
                (ip.Number as string) ||
                String(i + 1).padStart(2, '0')
              const q = (ip.Question as string) || ''
              const a = (ip.Answer as string) || ''
              return `
          <div class="accordion-item" data-composition-node="${attr(ik)}">
            <h2 class="accordion-header"><button class="accordion-button ${i === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#faq-${attr(k)}-${i}">
              <span class="me-2"${!isDefault ? dataEdit(ik, 'Number') : ''}>${escapeHtml(num)}</span>
              <span${!isDefault ? dataEdit(ik, 'Question') : ''}>${escapeHtml(q)}</span>
            </button></h2>
            <div id="faq-${attr(k)}-${i}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" data-bs-parent="#faqAccordion-${attr(k)}">
              <div class="accordion-body"${!isDefault ? dataEdit(ik, 'Answer') : ''}>${escapeHtml(a)}</div>
            </div>
          </div>`
            })
            .join('')}
        </div>
        ${ctaText ? `<div class="text-center pt-4"><a href="${attr(ctaLink)}" class="theme-btn">${escapeHtml(ctaText)}</a></div>` : ''}
      </div>
    </div>
  </section>`
}

function renderNewsletterBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const title = (p.Title as string) || 'Stay in the loop'
  const description =
    (p.Description as string) || 'Subscribe to our newsletter for new releases and exclusive content.'
  const placeholder = (p.Placeholder as string) || 'Enter your email'
  return `
  <section class="newsletter-items section-padding" data-composition-node="${attr(k)}">
    <div class="container">
      <div class="newsletter-wrapper text-center" style="padding:48px 24px;background:linear-gradient(135deg,rgba(229,9,20,.15),rgba(0,0,0,.4));border-radius:12px;">
        <h2${dataEdit(k, 'Title')}>${escapeHtml(title)}</h2>
        <p${dataEdit(k, 'Description')} style="color:#bbb;max-width:560px;margin:8px auto 24px;">${escapeHtml(description)}</p>
        <form class="newsletter-input" onsubmit="event.preventDefault()" style="display:flex;gap:8px;max-width:520px;margin:0 auto;">
          <input type="email" placeholder="${attr(placeholder)}" style="flex:1;padding:12px 16px;border-radius:6px;border:1px solid #333;background:#0e0e0e;color:#fff;">
          <button type="submit" class="theme-btn">Subscribe</button>
        </form>
      </div>
    </div>
  </section>`
}

function renderAboutSectionBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const heading = (p.Heading as string) || 'About OptiOTT'
  const storyTitle = (p.StoryTitle as string) || 'Our story'
  const storyParas = (p.StoryParagraphs as string) || 'OptiOTT is a next-generation streaming platform powered by Optimizely SaaS CMS.'
  const image = urlDefault(p.MainImage) || '/assets/img/about/01.jpg'
  const videoUrl = (p.VideoUrl as string) || ''
  // StoryParagraphs may contain newlines to separate paragraphs
  const paras = storyParas.split(/\n\s*\n|\r\n\r\n/).filter(Boolean)
  return `
  <section class="about-section section-padding fix" data-composition-node="${attr(k)}">
    <div class="container">
      <div class="row g-4 align-items-center">
        <div class="col-lg-6">
          <div class="about-image-2" style="position:relative;">
            <img src="${attr(image)}" alt="about">
            ${videoUrl ? `<a href="${attr(videoUrl)}" class="video-btn ripple video-popup" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"><i class="fa-solid fa-play"></i></a>` : ''}
          </div>
        </div>
        <div class="col-lg-6">
          <div class="about-content">
            <div class="section-title">
              <h2${dataEdit(k, 'Heading')}>${escapeHtml(heading)}</h2>
              <h4 style="color:#e50914;margin-top:16px;"${dataEdit(k, 'StoryTitle')}>${escapeHtml(storyTitle)}</h4>
            </div>
            <div${dataEdit(k, 'StoryParagraphs')}>
              ${paras.map((t) => `<p>${escapeHtml(t)}</p>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`
}

function renderUpcomingMovieBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const title = (p.Title as string) || 'Upcoming Release'
  const duration = (p.Duration as string) || ''
  const quality = (p.Quality as string) || ''
  const genres = (p.Genres as string) || ''
  const poster = urlDefault(p.Image) || '/assets/img/upcoming/01.jpg'
  const link = urlDefault(p.LinkToDetail) || '/movie-details'
  return `
  <div class="col-xl-3 col-lg-4 col-md-6" data-composition-node="${attr(k)}">
    <div class="upcoming-box-items">
      <div class="upcoming-image"><img src="${attr(poster)}" alt="upcoming"></div>
      <div class="upcoming-content">
        <h3><a href="${attr(link)}"${dataEdit(k, 'Title')}>${escapeHtml(title)}</a></h3>
        ${duration ? `<span${dataEdit(k, 'Duration')}>${escapeHtml(duration)}</span>` : ''}
        ${genres ? `<span${dataEdit(k, 'Genres')} style="margin-left:8px;">${escapeHtml(genres)}</span>` : ''}
        ${quality ? `<span${dataEdit(k, 'Quality')} style="margin-left:8px;">${escapeHtml(quality)}</span>` : ''}
      </div>
    </div>
  </div>`
}

function renderCounterSectionBlock(node: ComponentNode): string {
  const k = node.key
  // Children are CounterItemBlock
  const children = (node.nodes ?? []).filter(
    (n) => n.nodeType === 'component' && primaryType(n) === 'CounterItemBlock'
  )
  const items =
    children.length > 0
      ? children.map(renderCounterItemBlock).join('')
      : `
        <div class="col-lg-3 col-md-6 text-center"><h2>10M+</h2><p>Subscribers</p></div>
        <div class="col-lg-3 col-md-6 text-center"><h2>50K+</h2><p>Titles</p></div>
        <div class="col-lg-3 col-md-6 text-center"><h2>4K</h2><p>HDR quality</p></div>
        <div class="col-lg-3 col-md-6 text-center"><h2>190</h2><p>Countries</p></div>`
  return `
  <section class="counter-section section-padding fix" data-composition-node="${attr(k)}">
    <div class="container">
      <div class="row g-4">
        ${items}
      </div>
    </div>
  </section>`
}

function renderCounterItemBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  // CounterItemBlock.Number is aliased to CounterNumber in the GraphQL query
  // (to avoid a conflict with FaqItemBlock.Number which is String).
  const numeric =
    p.CounterNumber !== undefined && p.CounterNumber !== null
      ? p.CounterNumber
      : p.Number
  const number = numeric !== undefined && numeric !== null ? String(numeric) : '0'
  const suffix = (p.Suffix as string) || ''
  const label = (p.Label as string) || ''
  return `
  <div class="col-lg-3 col-md-6 text-center" data-composition-node="${attr(k)}">
    <h2>
      <span${dataEdit(k, 'Number')}>${escapeHtml(number)}</span><span${dataEdit(k, 'Suffix')}>${escapeHtml(suffix)}</span>
    </h2>
    <p${dataEdit(k, 'Label')}>${escapeHtml(label)}</p>
  </div>`
}

function renderTeamMemberBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const name = (p.Name as string) || 'Team Member'
  const role = (p.Role as string) || ''
  const photo = urlDefault(p.Photo) || '/assets/img/team/01.jpg'
  return `
  <div class="col-lg-3 col-md-6" data-composition-node="${attr(k)}">
    <div class="team-box-items">
      <div class="team-image"><img src="${attr(photo)}" alt="${attr(name)}"></div>
      <div class="team-content text-center">
        <h3${dataEdit(k, 'Name')}>${escapeHtml(name)}</h3>
        <p${dataEdit(k, 'Role')}>${escapeHtml(role)}</p>
      </div>
    </div>
  </div>`
}

function renderContactFormBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const title = (p.Title as string) || 'Contact Us'
  const description = (p.Description as string) || ''
  const submitText = (p.SubmitButtonText as string) || 'Send Message'
  return `
  <section class="contact-form-section section-padding fix" data-composition-node="${attr(k)}">
    <div class="container">
      <div class="section-title text-center">
        <h2${dataEdit(k, 'Title')}>${escapeHtml(title)}</h2>
        ${description ? `<p${dataEdit(k, 'Description')}>${escapeHtml(description)}</p>` : ''}
      </div>
      <form class="contact-form" style="max-width:680px;margin:0 auto;">
        <div class="row g-3">
          <div class="col-md-6"><input type="text" placeholder="Name" class="form-control" style="padding:12px;background:#1a1a1a;border:1px solid #333;color:#fff;border-radius:6px;"></div>
          <div class="col-md-6"><input type="email" placeholder="Email" class="form-control" style="padding:12px;background:#1a1a1a;border:1px solid #333;color:#fff;border-radius:6px;"></div>
          <div class="col-12"><textarea placeholder="Message" rows="5" class="form-control" style="padding:12px;background:#1a1a1a;border:1px solid #333;color:#fff;border-radius:6px;"></textarea></div>
          <div class="col-12 text-center"><button type="button" class="theme-btn"${dataEdit(k, 'SubmitButtonText')}>${escapeHtml(submitText)}</button></div>
        </div>
      </form>
    </div>
  </section>`
}

function renderContactInfoBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const label = (p.Label as string) || ''
  const value = (p.Value as string) || ''
  // ContactInfoBlock.Icon is aliased to ContactIcon in the GraphQL query
  // (to avoid a conflict with SectionTitleBlock.Icon which is ContentUrl).
  const icon = (p.ContactIcon as string) || (p.Icon as string) || 'fa-envelope'
  const link = (p.LinkUrl as string) || ''
  const body = `
      <div class="contact-info-icon"><i class="fa-solid ${attr(icon)}"></i></div>
      <div class="contact-info-content">
        <h4${dataEdit(k, 'Label')}>${escapeHtml(label)}</h4>
        <p${dataEdit(k, 'Value')}>${escapeHtml(value)}</p>
      </div>`
  return `
  <div class="col-lg-4 col-md-6" data-composition-node="${attr(k)}">
    <div class="contact-info-box-items">
      ${link ? `<a href="${attr(link)}">${body}</a>` : body}
    </div>
  </div>`
}

function renderBlogPostCardBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const title = (p.Title as string) || 'Blog post'
  const excerpt = (p.Excerpt as string) || ''
  const author = (p.Author as string) || ''
  const date = (p.Date as string) || ''
  const image = urlDefault(p.FeaturedImage) || '/assets/img/blog/01.jpg'
  const link = urlDefault(p.LinkToDetail) || '/blog'
  return `
  <div class="col-lg-4 col-md-6" data-composition-node="${attr(k)}">
    <div class="blog-box-items">
      <div class="blog-image"><img src="${attr(image)}" alt="${attr(title)}"></div>
      <div class="blog-content">
        <ul class="post-meta">
          ${author ? `<li><i class="fa-regular fa-user"></i> <span${dataEdit(k, 'Author')}>${escapeHtml(author)}</span></li>` : ''}
          ${date ? `<li><i class="fa-regular fa-calendar"></i> <span${dataEdit(k, 'Date')}>${escapeHtml(date)}</span></li>` : ''}
        </ul>
        <h3><a href="${attr(link)}"${dataEdit(k, 'Title')}>${escapeHtml(title)}</a></h3>
        ${excerpt ? `<p${dataEdit(k, 'Excerpt')}>${escapeHtml(excerpt)}</p>` : ''}
      </div>
    </div>
  </div>`
}

function renderButtonBlock(node: ComponentNode): string {
  const p = getProps(node)
  const k = node.key
  const label = (p.Label as string) || 'Click me'
  const url = (p.Url as string) || '#'
  const style = (p.Style as string) || 'primary'
  return `
  <div class="button-wrapper text-center py-3" data-composition-node="${attr(k)}">
    <a href="${attr(url)}" class="theme-btn${style === 'secondary' ? ' style-2' : ''}"${dataEdit(k, 'Label')}>${escapeHtml(label)}</a>
  </div>`
}

function renderGenericBlock(node: ComponentNode): string {
  const type = primaryType(node) || 'Unknown'
  const props = getProps(node)
  const k = node.key
  return `
  <section class="generic-block section-padding" data-composition-node="${attr(k)}" style="border:1px dashed #333; padding:40px 20px;">
    <div class="container">
      <h3 style="color:#e50914;margin-bottom:16px;">${escapeHtml(type)}</h3>
      <p style="color:#aaa;">Default rendering — no dedicated renderer yet. Authored props:</p>
      <pre style="background:#1a1a1a;color:#ddd;padding:16px;border-radius:6px;overflow:auto;font-size:12px;">${escapeHtml(
        JSON.stringify(props, null, 2)
      )}</pre>
    </div>
  </section>`
}

/* -----------------------------------------------------------------------------
 * Renderer registry + dispatcher
 * -------------------------------------------------------------------------- */

const RENDERERS: Record<string, (node: ComponentNode) => string> = {
  HeroBannerBlock: renderHeroBannerBlock,
  TrendingBannerBlock: renderTrendingBannerBlock,
  MovieCarouselBlock: renderMovieCarouselBlock,
  MovieCardBlock: (n) => renderMovieCardFromNode(n, 1),
  CategoryCardBlock: renderCategoryCardBlock,
  PricingTabsBlock: renderPricingTabsBlock,
  PricingCardBlock: renderPricingCardBlock,
  FaqSectionBlock: renderFaqSectionBlock,
  NewsletterBlock: renderNewsletterBlock,
  AboutSectionBlock: renderAboutSectionBlock,
  UpcomingMovieBlock: renderUpcomingMovieBlock,
  CounterSectionBlock: renderCounterSectionBlock,
  CounterItemBlock: renderCounterItemBlock,
  SectionTitleBlock: renderSectionTitleBlock,
  TeamMemberBlock: renderTeamMemberBlock,
  ContactFormBlock: renderContactFormBlock,
  ContactInfoBlock: renderContactInfoBlock,
  BlogPostCardBlock: renderBlogPostCardBlock,
  ButtonBlock: renderButtonBlock,
}

export function renderNode(node: ComponentNode): string {
  if (node.nodeType === 'component') {
    const type = primaryType(node)
    const r = type ? RENDERERS[type] : undefined
    if (r) return r(node)
    return renderGenericBlock(node)
  }

  // Structure nodes - render children in sequence
  const children = node.nodes ?? []
  return children.map((child) => renderNode(child)).join('\n')
}

export function renderComposition(experience: ExperienceData | null): string {
  if (!experience?.composition?.nodes || experience.composition.nodes.length === 0) {
    return `
    <section class="empty-outline section-padding" style="min-height:60vh;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:80px 20px;">
      <div style="max-width:640px;">
        <h2 style="color:#e50914;font-size:32px;margin-bottom:16px;">Empty Experience</h2>
        <p style="color:#aaa;font-size:16px;margin-bottom:8px;">This experience has no sections yet.</p>
        <p style="color:#666;font-size:14px;">Use the Outline panel on the left to add sections and components. The preview refreshes automatically as you edit.</p>
      </div>
    </section>`
  }
  return experience.composition.nodes.map((n) => renderNode(n)).join('\n')
}
