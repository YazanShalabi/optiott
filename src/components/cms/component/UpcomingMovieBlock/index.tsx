import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { UpcomingMovieStyling } from './UpcomingMovieStyling'
import Image from 'next/image'

const UpcomingMovieBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = UpcomingMovieStyling(settings)

  const imgUrl = (data.Image as any)?.url?.default ?? (data.Image as any)?.url ?? ''

  return (
    <div className={styles.card} data-epi-block-id={data._metadata?.key}>
      <div className={styles.imageWrapper}>
        {imgUrl && (
          <Image src={imgUrl} alt={data.Title ?? ''} fill className={styles.image} />
        )}
        <span className={styles.badge}>Upcoming</span>
      </div>
      <h3 className={styles.title} data-epi-edit="Title">
        {data.Title}
      </h3>
      <div className={styles.meta}>
        {data.Duration && <span>{data.Duration}</span>}
        {data.Quality && <span className={styles.metaBadge}>{data.Quality}</span>}
        {data.Genres && <span>{data.Genres}</span>}
      </div>
    </div>
  )
}

UpcomingMovieBlock.displayName = 'UpcomingMovieBlock'
export default UpcomingMovieBlock
