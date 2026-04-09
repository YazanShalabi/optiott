import React from 'react'
'use client'


import { getDictionaryFromDisplaySettings } from '@/lib/utils'
import { MovieCarouselStyling } from './MovieCarouselStyling'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const MovieCarouselBlock: React.FC<any> = ({ data, displaySettings, children }) => {
  const settings = getDictionaryFromDisplaySettings(displaySettings)
  const styles = MovieCarouselStyling(settings)
  const slidesPerView = Number(settings.SlidesPerView) || 4
  const showNav = settings.ShowNavigation !== 'false'
  const showPagination = settings.ShowPagination === 'true'
  const autoPlay = settings.AutoPlay === 'true'

  return (
    <section className={styles.section} data-epi-block-id={data._metadata?.key}>
      <div className={styles.header}>
        <h2 className={styles.title} data-epi-edit="SectionTitle">
          {data.SectionTitle}
        </h2>
      </div>
      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          navigation={showNav}
          pagination={showPagination ? { clickable: true } : false}
          autoplay={autoPlay ? { delay: 4000, disableOnInteraction: false } : false}
          breakpoints={{
            640: { slidesPerView: Math.min(slidesPerView, 3) },
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

MovieCarouselBlock.displayName = 'MovieCarouselBlock'
export default MovieCarouselBlock
