// Components
import HeroBannerBlock from './component/HeroBannerBlock'
import MovieCardBlock from './component/MovieCardBlock'
import MovieCarouselBlock from './component/MovieCarouselBlock'
import TrendingBannerBlock from './component/TrendingBannerBlock'
import HotPicksCardBlock from './component/HotPicksCardBlock'
import CategoryCardBlock from './component/CategoryCardBlock'
import CategoryCarouselBlock from './component/CategoryCarouselBlock'
import UpcomingMovieBlock from './component/UpcomingMovieBlock'
import PricingCardBlock from './component/PricingCardBlock'
import PricingTabsBlock from './component/PricingTabsBlock'
import FaqItemBlock from './component/FaqItemBlock'
import FaqSectionBlock from './component/FaqSectionBlock'
import TeamMemberBlock from './component/TeamMemberBlock'
import CounterItemBlock from './component/CounterItemBlock'
import CounterSectionBlock from './component/CounterSectionBlock'
import AwardsBlock from './component/AwardsBlock'
import BrandLogoBlock from './component/BrandLogoBlock'
import BrandSliderBlock from './component/BrandSliderBlock'
import AboutSectionBlock from './component/AboutSectionBlock'
import ProgressBarBlock from './component/ProgressBarBlock'
import ContactInfoBlock from './component/ContactInfoBlock'
import ContactFormBlock from './component/ContactFormBlock'
import MapEmbedBlock from './component/MapEmbedBlock'
import BlogPostCardBlock from './component/BlogPostCardBlock'
import BlogSidebarBlock from './component/BlogSidebarBlock'
import NewsletterBlock from './component/NewsletterBlock'
import ButtonBlock from './component/ButtonBlock'
import SectionTitleBlock from './component/SectionTitleBlock'

// Experiences
import BlankExperience from './experience/BlankExperience'
import HomePageExperience from './experience/HomePageExperience'
import ContentPageExperience from './experience/ContentPageExperience'

// Compositions
import Section from './composition/Section'
import Row from './composition/Row'
import Column from './composition/Column'

export const CmsComponents = [
  // Elements
  { type: 'HeroBannerBlock', component: HeroBannerBlock },
  { type: 'MovieCardBlock', component: MovieCardBlock },
  { type: 'MovieCarouselBlock', component: MovieCarouselBlock },
  { type: 'TrendingBannerBlock', component: TrendingBannerBlock },
  { type: 'HotPicksCardBlock', component: HotPicksCardBlock },
  { type: 'CategoryCardBlock', component: CategoryCardBlock },
  { type: 'CategoryCarouselBlock', component: CategoryCarouselBlock },
  { type: 'UpcomingMovieBlock', component: UpcomingMovieBlock },
  { type: 'PricingCardBlock', component: PricingCardBlock },
  { type: 'PricingTabsBlock', component: PricingTabsBlock },
  { type: 'FaqItemBlock', component: FaqItemBlock },
  { type: 'FaqSectionBlock', component: FaqSectionBlock },
  { type: 'TeamMemberBlock', component: TeamMemberBlock },
  { type: 'CounterItemBlock', component: CounterItemBlock },
  { type: 'CounterSectionBlock', component: CounterSectionBlock },
  { type: 'AwardsBlock', component: AwardsBlock },
  { type: 'BrandLogoBlock', component: BrandLogoBlock },
  { type: 'BrandSliderBlock', component: BrandSliderBlock },
  { type: 'AboutSectionBlock', component: AboutSectionBlock },
  { type: 'ProgressBarBlock', component: ProgressBarBlock },
  { type: 'ContactInfoBlock', component: ContactInfoBlock },
  { type: 'ContactFormBlock', component: ContactFormBlock },
  { type: 'MapEmbedBlock', component: MapEmbedBlock },
  { type: 'BlogPostCardBlock', component: BlogPostCardBlock },
  { type: 'BlogSidebarBlock', component: BlogSidebarBlock },
  { type: 'NewsletterBlock', component: NewsletterBlock },
  { type: 'ButtonBlock', component: ButtonBlock },
  { type: 'SectionTitleBlock', component: SectionTitleBlock },
  // Experiences
  { type: 'Experience/BlankExperience', component: BlankExperience },
  { type: 'Experience/HomePageExperience', component: HomePageExperience },
  { type: 'Experience/ContentPageExperience', component: ContentPageExperience },
  // Compositions
  { type: 'Composition/Section', component: Section },
  { type: 'Composition/Row', component: Row },
  { type: 'Composition/Column', component: Column },
]

export default CmsComponents
