import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { TrendingBannerStyling } from './TrendingBannerStyling'
import Image from 'next/image'

const TrendingBannerBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = TrendingBannerStyling(settings)

  const bgUrl = (data.BackgroundImage as any)?.url?.default ?? (data.BackgroundImage as any)?.url ?? ''

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      {bgUrl && (
        <Image src={bgUrl} alt="" fill className="absolute inset-0 object-cover opacity-20" />
      )}
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h2 className={styles.title} data-epi-edit="Title">
            {data.Title}
          </h2>
          {data.Description && (
            <p className={styles.description} data-epi-edit="Description">
              {data.Description}
            </p>
          )}
          {data.PlayButton && data.VideoUrl && (
            <a href={data.VideoUrl as string} className={styles.playButton}>
              <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Now
            </a>
          )}
        </div>
        <div className={styles.rightSide}>
          <div className={styles.trendingList}>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

TrendingBannerBlock.displayName = 'TrendingBannerBlock'
export default TrendingBannerBlock
