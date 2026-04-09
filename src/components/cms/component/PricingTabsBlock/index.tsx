import React from 'react'
'use client'

import { useState } from 'react'

import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { PricingTabsStyling } from './PricingTabsStyling'

const PricingTabsBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = PricingTabsStyling(settings)
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly')

  const childArray = children ? (Array.isArray(children) ? children : [children]) : []
  const monthlyCount = Array.isArray(data.MonthlyPlans) ? data.MonthlyPlans.length : 0
  const monthlyChildren = childArray.slice(0, monthlyCount)
  const yearlyChildren = childArray.slice(monthlyCount)

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      <div className={styles.container}>
        <div className={styles.tabsWrapper}>
          <div className={styles.tabList}>
            <button
              className={styles.tab(activeTab === 'monthly')}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly
            </button>
            <button
              className={styles.tab(activeTab === 'yearly')}
              onClick={() => setActiveTab('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className={styles.grid}>
          {activeTab === 'monthly' ? monthlyChildren : yearlyChildren}
        </div>
      </div>
    </section>
  )
}

PricingTabsBlock.displayName = 'PricingTabsBlock'
export default PricingTabsBlock
