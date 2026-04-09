export function BlogSidebarStyling(settings: Record<string, string>) {
  const showSearch = settings.ShowSearch !== 'false'
  const showCategories = settings.ShowCategories !== 'false'
  const showRecentPosts = settings.ShowRecentPosts !== 'false'
  const showTags = settings.ShowTags !== 'false'

  return {
    sidebar: 'space-y-8',
    widget: 'bg-[#1a1a2e] rounded-2xl p-6',
    widgetTitle: 'text-white font-semibold text-lg mb-4 pb-3 border-b border-[#2a2a4a]',
    searchWrapper: showSearch ? 'relative' : 'hidden',
    searchInput: 'w-full bg-[#0e0e0e] border border-[#2a2a4a] rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors duration-200',
    searchIcon: 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5',
    categoriesWrapper: showCategories ? '' : 'hidden',
    categoryList: 'space-y-2',
    categoryItem: 'flex items-center justify-between text-gray-400 hover:text-[#e50914] transition-colors duration-200 cursor-pointer py-1',
    categoryCount: 'text-xs bg-[#2a2a4a] px-2 py-0.5 rounded-full',
    recentPostsWrapper: showRecentPosts ? '' : 'hidden',
    recentPostList: 'space-y-4',
    recentPostItem: 'flex gap-3 group cursor-pointer',
    recentPostImage: 'relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0',
    recentPostImg: 'w-full h-full object-cover',
    recentPostInfo: 'min-w-0 flex flex-col justify-center',
    recentPostTitle: 'text-white text-sm font-medium line-clamp-2 group-hover:text-[#e50914] transition-colors duration-200',
    recentPostDate: 'text-gray-500 text-xs mt-1',
    tagsWrapper: showTags ? '' : 'hidden',
    tagList: 'flex flex-wrap gap-2',
    tag: 'px-3 py-1.5 bg-[#0e0e0e] border border-[#2a2a4a] rounded-lg text-gray-400 text-xs hover:border-[#e50914] hover:text-[#e50914] transition-colors duration-200 cursor-pointer',
  }
}
