import React from 'react'
'use client'


import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { CategoryCarouselStyling } from './CategoryCarouselStyling'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const CategoryCarouselBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = CategoryCarouselStyling(settings)
  const slidesPerView = Number(settings.SlidesPerView) || 4
  const showNav = settings.ShowNavigation !== 'false'

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      <div className={styles.header}>
        <h2 className={styles.title} data-epi-edit="SectionTitle">
          {data.SectionTitle}
        </h2>
        {data.Subtitle && (
          <p className={styles.subtitle} data-epi-edit="Subtitle">
            {data.Subtitle}
          </p>
        )}
      </div>
      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={2}
          navigation={showNav}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView },
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

CategoryCarouselBlock.displayName = 'CategoryCarouselBlock'
export default CategoryCarouselBlock
