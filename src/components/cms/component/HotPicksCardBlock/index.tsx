import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { HotPicksCardStyling } from './HotPicksCardStyling'
import Image from 'next/image'

const HotPicksCardBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = HotPicksCardStyling(settings)

  const imgUrl = (data.Image as any)?.url?.default ?? (data.Image as any)?.url ?? ''
  const rank = data.RankNumber ? String(data.RankNumber).padStart(2, '0') : '01'

  return (
    <div className={styles.card} data-epi-block-id={data._metadata?.key}>
      <span className={styles.rankNumber}>{rank}</span>
      <div className={styles.imageWrapper}>
        {imgUrl && (
          <Image src={imgUrl} alt={data.Title ?? ''} fill className={styles.image} />
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title} data-epi-edit="Title">
          {data.Title}
        </h3>
        {data.Description && (
          <p className={styles.description} data-epi-edit="Description">
            {data.Description}
          </p>
        )}
        <div className={styles.meta}>
          {data.Duration && <span>{data.Duration}</span>}
          {data.Quality && <span className={styles.metaBadge}>{data.Quality}</span>}
        </div>
      </div>
    </div>
  )
}

HotPicksCardBlock.displayName = 'HotPicksCardBlock'
export default HotPicksCardBlock
