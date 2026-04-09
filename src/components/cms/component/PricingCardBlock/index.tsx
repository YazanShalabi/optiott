import React from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { PricingCardStyling } from './PricingCardStyling'

const PricingCardBlock: React.FC<any> = ({ data, displaySettings }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = PricingCardStyling(settings)

  return (
    <div className={styles.card} data-epi-block-id={data._metadata?.key}>
      <span className={styles.highlightBadge}>Popular</span>
      <h3 className={styles.planName} data-epi-edit="PlanName">
        {data.PlanName}
      </h3>
      <div className={styles.price} data-epi-edit="Price">
        ${data.Price}
      </div>
      <span className={styles.period} data-epi-edit="PricePeriod">
        {data.PricePeriod}
      </span>
      {data.Description && (
        <p className={styles.description} data-epi-edit="Description">
          {data.Description}
        </p>
      )}
      {data.TrialButtonText && (
        <a
          href={(data.TrialButtonLink as string) || '#'}
          className={styles.trialButton}
        >
          {data.TrialButtonText}
        </a>
      )}
      {data.ChooseButtonText && (
        <a
          href={(data.ChooseButtonLink as string) || '#'}
          className={styles.chooseButton}
        >
          {data.ChooseButtonText}
        </a>
      )}
    </div>
  )
}

PricingCardBlock.displayName = 'PricingCardBlock'
export default PricingCardBlock
