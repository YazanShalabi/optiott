import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { CategoryCardStyling } from './CategoryCardStyling'
import Image from 'next/image'

const CategoryCardBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = CategoryCardStyling(settings)

  const imgUrl = (data.Image as any)?.url?.default ?? (data.Image as any)?.url ?? ''

  return (
    <div className={styles.card} data-epi-block-id={data._metadata?.key}>
      {imgUrl && (
        <Image src={imgUrl} alt={data.Title ?? ''} fill className={styles.image} />
      )}
      <div className={styles.overlay}>
        <div className={styles.textBlock}>
          {data.Subtitle && (
            <p className={styles.subtitle} data-epi-edit="Subtitle">
              {data.Subtitle}
            </p>
          )}
          <h3 className={styles.title} data-epi-edit="Title">
            {data.Title}
          </h3>
        </div>
      </div>
    </div>
  )
}

CategoryCardBlock.displayName = 'CategoryCardBlock'
export default CategoryCardBlock
