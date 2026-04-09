import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { HeroBannerStyling } from './HeroBannerStyling'
import Image from 'next/image'

const HeroBannerBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = HeroBannerStyling(settings)

  const bgUrl = (data.BackgroundImage as any)?.url?.default ?? (data.BackgroundImage as any)?.url ?? ''

  return (
    <section className={styles.wrapper} data-epi-block-id={data._metadata?.key}>
      {bgUrl && (
        <Image
          src={bgUrl}
          alt={data.Title ?? ''}
          fill
          className={styles.backgroundImage}
          priority
        />
      )}
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <h1 className={styles.title} data-epi-edit="Title">
            {data.Title}
          </h1>
          <div className={styles.meta}>
            {data.Duration && <span>{data.Duration}</span>}
            {data.Quality && <span className={styles.metaBadge}>{data.Quality}</span>}
          </div>
          {data.Genres && (
            <p className={styles.genres} data-epi-edit="Genres">
              {data.Genres}
            </p>
          )}
          {data.VideoUrl && (
            <a href={data.VideoUrl as string} className={styles.playButton}>
              <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

HeroBannerBlock.displayName = 'HeroBannerBlock'
export default HeroBannerBlock
