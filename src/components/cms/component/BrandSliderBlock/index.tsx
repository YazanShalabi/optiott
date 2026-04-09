import React from 'react'
'use client'


import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { BrandSliderStyling } from './BrandSliderStyling'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const BrandSliderBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = BrandSliderStyling(settings)

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      <div className={styles.container}>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2}
          loop={true}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={3000}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {children
            ? (Array.isArray(children) ? children : [children]).map((child, i) => (
                <SwiperSlide key={i}>{child}</SwiperSlide>
              ))
            : null}
        </Swiper>
      </div>
    </section>
  )
}

BrandSliderBlock.displayName = 'BrandSliderBlock'
export default BrandSliderBlock
