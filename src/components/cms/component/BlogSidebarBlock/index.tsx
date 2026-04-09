import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { BlogSidebarStyling } from './BlogSidebarStyling'

const BlogSidebarBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = BlogSidebarStyling(settings)

  return (
    <aside className={styles.sidebar} data-epi-block-id={data._metadata?.key}>
      {/* Search Widget */}
      <div className={styles.searchWrapper}>
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>Search</h3>
          <div className="relative">
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search articles..."
            />
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </div>

      {/* Categories Widget */}
      <div className={styles.categoriesWrapper}>
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>Categories</h3>
          <div className={styles.categoryList}>
            {children}
          </div>
        </div>
      </div>

      {/* Recent Posts Widget */}
      <div className={styles.recentPostsWrapper}>
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>Recent Posts</h3>
          <div className={styles.recentPostList}>
            {/* Recent posts rendered via children or data */}
          </div>
        </div>
      </div>

      {/* Tags Widget */}
      <div className={styles.tagsWrapper}>
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>Tags</h3>
          <div className={styles.tagList}>
            {/* Tags rendered via children or data */}
          </div>
        </div>
      </div>
    </aside>
  )
}

BlogSidebarBlock.displayName = 'BlogSidebarBlock'
export default BlogSidebarBlock
