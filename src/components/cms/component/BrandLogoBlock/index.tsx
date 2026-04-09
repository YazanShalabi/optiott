import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { BrandLogoStyling } from './BrandLogoStyling'
import Image from 'next/image'

const BrandLogoBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = BrandLogoStyling(settings)

  const logoUrl = (data.Logo as any)?.url?.default ?? (data.Logo as any)?.url ?? (data.Image as any)?.url?.default ?? (data.Image as any)?.url ?? ''
  const link = (data.Link as string) || (data.Url as string) || ''

  const content = (
    <div className={styles.wrapper} data-epi-block-id={data._metadata?.key}>
      {logoUrl && (
        <Image
          src={logoUrl}
          alt={data.Title ?? data.Name ?? 'Brand logo'}
          width={160}
          height={48}
          className={styles.image}
        />
      )}
    </div>
  )

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  )
}

BrandLogoBlock.displayName = 'BrandLogoBlock'
export default BrandLogoBlock
