export interface ContentUrl {
  url?: {
    default?: string
    hierarchical?: string
  }
}

export interface LinkItem {
  label?: string
  url?: string
}

export interface NavigationItem {
  label?: string
  url?: string
  isActive?: boolean
  children?: NavigationItem[]
}

export interface SocialLink {
  platform?: string
  url?: string
}

export interface SiteSettingsData {
  siteName?: string
  logo?: ContentUrl
  favicon?: ContentUrl
  mainNavigation?: NavigationItem[]
  categoryOptions?: string
  searchPlaceholder?: string
  offcanvasDescription?: string
  contactAddress?: string
  contactEmail?: string
  contactHours?: string
  contactPhone?: string
  socialLinks?: SocialLink[]
  footerCompanyLinks?: LinkItem[]
  footerExploreLinks?: LinkItem[]
  newsletterTitle?: string
  newsletterDescription?: string
  copyrightText?: string
}
