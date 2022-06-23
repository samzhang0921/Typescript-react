import React, { useRef, useState } from 'react'
import { object, func, bool } from 'prop-types'
import Slider from 'react-slick'
import { createComponent } from '@ycos/fela'
import ProductCardDeskTop from './ProductCardDeskTop'
import { PrevArrow, NextArrow } from './Arrow'

import { STATUS } from '../constants'
import ProductsSliderSkeleton from '../common-components/ProductsSliderSkeleton'

const PID_ANIMATION_ENTERING_DELAY = 225
const PREVENT_CLICK_DELAY = 675

const SliderContainer = createComponent('SliderContainer', () => ({
  position: 'relative',
  width: '100%',
  display: 'flex'
}))

const SliderMarginWrapper = createComponent('SliderMarginWrapper', ({ theme }) => ({
  marginRight: -theme.custom.whatsnew.marginMultipliers.desktopRight * theme.spacingMultiplier,
  display: 'flex',
  flex: 1
}))

const SliderWrapper = createComponent('SliderWrapper', ({ opacity, theme, productListOnly }) => {
  const isRtl = theme.direction === 'rtl'
  const { desktopRight, rtlDesktopRight } = theme.custom.whatsnew.marginMultipliers
  return {
    position: 'absolute',
    width: productListOnly ? '100%' : `calc(100% + ${desktopRight * theme.spacingMultiplier}px)`,
    height: '100%',
    top: 0,
    zIndex: 1,
    opacity,
    transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.easeOut}`,
    'screen-xlarge': {
      width: `calc(100% + ${(isRtl ? rtlDesktopRight : desktopRight) * theme.spacingMultiplier}px)`
    }
  }
})

const DesktopCarousel = ({ locale, imageSphere, products, productUrl, onProductClick, onArrowClick, loadingState, onNavigationClick, campaignInfo, lazy, brand, withDetails, productListOnly }) => {
  const [slideIndex, setSlideIndex] = useState(0)
  const [nextActiveSlide, setNextActiveSlide] = useState(0)
  const [slideFadeAnimationEntering, setSlideFadeAnimationEntering] = useState(undefined)
  const [direction, setDirection] = useState('previous')
  const [animationGroupNeedle, setAnimationGroupNeedle] = useState(0)
  const [preventClickWhilePidsAnimating, setpreventClickWhilePidsAnimating] = useState(false)
  const totalItems = products?.items?.length
  const carouselRef = useRef(null)

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    speed: 0,
    useCSS: false,
    useTransform: false,
    draggable: false,
    swipe: false,
    beforeChange(current, next) {
      setNextActiveSlide(next)
    },
    afterChange: (current) => {
      setSlideIndex(current)
    }
  }

  const handleClick = (direction) => {
    onArrowClick(direction)
    setpreventClickWhilePidsAnimating(true)
    setDirection(direction)
    setSlideFadeAnimationEntering(false)
    setTimeout(() => {
      const safeAnimationGroupNeedle = animationGroupNeedle + (direction === 'previous' ? -1 : 1)
      setAnimationGroupNeedle(safeAnimationGroupNeedle)
      setSlideFadeAnimationEntering(true)
      if (carouselRef.current) {
        direction === 'previous' ? carouselRef.current.slickPrev() : carouselRef.current.slickNext()
      }
    }, PID_ANIMATION_ENTERING_DELAY)
    setTimeout(() => {
      setpreventClickWhilePidsAnimating(false)
    }, PREVENT_CLICK_DELAY)

    const index = direction === 'previous' ? slideIndex - 3 : slideIndex + 5
    onNavigationClick(direction, `${index}-${index + settings.slidesToShow - 1}`)
  }

  return (
    <SliderContainer>
      <SliderMarginWrapper>
        <ProductsSliderSkeleton slidesToShow={settings.slidesToShow} opacity={loadingState !== STATUS.LOADED ? 1 : 0} productListOnly={productListOnly} />
        <SliderWrapper opacity={loadingState === STATUS.LOADED ? 1 : 0} productListOnly={productListOnly} >
          <PrevArrow
            brand={brand}
            onClick={() => handleClick('previous')}
            slideIndex={slideIndex}
            nextActiveSlide={nextActiveSlide}
            preventClickWhilePidsAnimating={preventClickWhilePidsAnimating}
            productListOnly={productListOnly}
          />

          <Slider {...settings} ref={carouselRef}>
            {products &&
              products.items &&
              products.items.map((product, index) => {
                const visible = index >= nextActiveSlide && index < nextActiveSlide + settings.slidesToShow
                return (
                  <ProductCardDeskTop
                    key={index + (product?.productId || 0)}
                    locale={locale}
                    imageSphere={imageSphere}
                    productUrlTemplate={productUrl.productUrlTemplate}
                    product={product}
                    visible={visible}
                    itemsPerSlide={settings.slidesToScroll}
                    index={index}
                    onProductClick={onProductClick}
                    slideFadeAnimationEntering={slideFadeAnimationEntering}
                    direction={direction}
                    animationGroupNeedle={animationGroupNeedle}
                    dataSource={products.dataSource}
                    campaignInfo={campaignInfo}
                    lazy={lazy}
                    withDetails={withDetails}
                  />
                )
              })}
          </Slider>

          <NextArrow
            brand={brand}
            onClick={() => handleClick('next')}
            slideIndex={slideIndex}
            nextActiveSlide={nextActiveSlide}
            totalItems={totalItems}
            preventClickWhilePidsAnimating={preventClickWhilePidsAnimating}
            productListOnly={productListOnly}
          />
        </SliderWrapper>
      </SliderMarginWrapper>
    </SliderContainer>
  )
}

DesktopCarousel.propTypes = {
  locale: object,
  products: object.isRequired,
  productUrl: object,
  onProductClick: func,
  onArrowClick: func,
  brand: object,
  productListOnly: bool
}

DesktopCarousel.defaultProps = {
  locale: {
    id: 'en-gb'
  },
  brand: {
    brandId: 'nap'
  },
  productUrl: {
    productUrlTemplate: '/{{LOCALE}}/shop/product{{SEO_URLKEYWORD}}'
  },
  onProductClick: () => {}
}

export default DesktopCarousel
