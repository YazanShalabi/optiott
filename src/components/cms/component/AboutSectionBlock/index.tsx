import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { AboutSectionStyling } from './AboutSectionStyling'
import Image from 'next/image'

const AboutSectionBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = AboutSectionStyling(settings)

  const imgUrl = (data.Image as any)?.url?.default ?? (data.Image as any)?.url ?? ''

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      <div className={styles.container}>
        <div className={styles.mediaBlock}>
          <div className={styles.imageWrapper}>
            {imgUrl && (
              <Image src={imgUrl} alt={data.Heading ?? ''} fill className={styles.image} />
            )}
            {data.VideoUrl && (
              <div className={styles.playButton}>
                <a href={data.VideoUrl as string} className={styles.playCircle}>
                  <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
        <div className={styles.textBlock}>
          <h2 className={styles.heading} data-epi-edit="Heading">
            {data.Heading}
          </h2>
          {data.Story && (
            <p className={styles.story} data-epi-edit="Story">
              {data.Story}
            </p>
          )}
          <div className={styles.progressBars}>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

AboutSectionBlock.displayName = 'AboutSectionBlock'
export default AboutSectionBlock
