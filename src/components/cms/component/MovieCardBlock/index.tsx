import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { MovieCardStyling } from './MovieCardStyling'
import Image from 'next/image'

const MovieCardBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = MovieCardStyling(settings)
  const showMeta = settings.ShowMetadata !== 'false'
  const showPlay = settings.ShowPlayButton !== 'false'

  const imgUrl = (data.Image as any)?.url?.default ?? (data.Image as any)?.url ?? ''

  return (
    <div className={styles.card} data-epi-block-id={data._metadata?.key}>
      <div className={styles.imageWrapper}>
        {imgUrl && (
          <Image src={imgUrl} alt={data.Title ?? ''} fill className={styles.image} />
        )}
        {showPlay && (
          <div className={styles.playOverlay}>
            <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
      <h3 className={styles.title} data-epi-edit="Title">
        {data.Title}
      </h3>
      {showMeta && (
        <div className={styles.meta}>
          {data.Duration && <span>{data.Duration}</span>}
          {data.Quality && <span className={styles.metaBadge}>{data.Quality}</span>}
        </div>
      )}
    </div>
  )
}

MovieCardBlock.displayName = 'MovieCardBlock'
export default MovieCardBlock
