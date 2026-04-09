import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { MapEmbedStyling } from './MapEmbedStyling'

const MapEmbedBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = MapEmbedStyling(settings)

  const embedUrl = (data.EmbedUrl as string) || (data.MapUrl as string) || ''

  return (
    <div className={styles.wrapper} data-epi-block-id={data._metadata?.key}>
      {embedUrl && (
        <iframe
          src={embedUrl}
          className={styles.iframe}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
        />
      )}
    </div>
  )
}

MapEmbedBlock.displayName = 'MapEmbedBlock'
export default MapEmbedBlock
