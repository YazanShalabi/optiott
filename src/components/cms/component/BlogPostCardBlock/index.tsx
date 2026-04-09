import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { BlogPostCardStyling } from './BlogPostCardStyling'
import Image from 'next/image'

const BlogPostCardBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = BlogPostCardStyling(settings)

  const imgUrl = (data.FeaturedImage as any)?.url?.default ?? (data.FeaturedImage as any)?.url ?? (data.Image as any)?.url?.default ?? (data.Image as any)?.url ?? ''

  return (
    <article className={styles.card} data-epi-block-id={data._metadata?.key}>
      <div className={styles.imageWrapper}>
        {imgUrl && (
          <Image src={imgUrl} alt={data.Title ?? ''} fill className={styles.image} />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.metaRow}>
          {data.Author && <span className={styles.author}>{data.Author}</span>}
          {data.Author && data.Date && <span className={styles.dot} />}
          {data.Date && <span className={styles.date}>{data.Date}</span>}
        </div>
        <h3 className={styles.title} data-epi-edit="Title">
          {data.Title}
        </h3>
        {data.Excerpt && (
          <p className={styles.excerpt} data-epi-edit="Excerpt">
            {data.Excerpt}
          </p>
        )}
        <span className={styles.readMore}>
          Read More
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </article>
  )
}

BlogPostCardBlock.displayName = 'BlogPostCardBlock'
export default BlogPostCardBlock
