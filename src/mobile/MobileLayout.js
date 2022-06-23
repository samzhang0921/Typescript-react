import React, { useRef, useState, useEffect } from 'react'
import { object, func, bool } from 'prop-types'
import { createComponent, withTheme } from '@ycos/fela'
import { Grid } from '@ycos/component-grid'
import throttle from 'lodash.throttle'
import ProductCard from '../common-components/ProductCard'
import ShopLatestButton from '../common-components/ShopLatestButton'
import { STATUS } from '../constants'
import ProductsSliderSkeleton from '../common-components/ProductsSliderSkeleton'
import WhatsNewInfoBlock from '../common-components/WhatsNewInfoBlock'

const THROTTLE_TIME = 100
const MOBILE_WHATS_NEW_PRODUCT_WIDTH = 144

const WhatsNewInfo = createComponent('WhatsNewInfo', ({ theme }) => ({
  width: '100%',
  padding: `0 ${theme.spacingMultiplier * 2}px 0 ${theme.spacingMultiplier * 2}px`,
  boxSizing: 'border-box'
}))

const ProductCardWrapper = createComponent('ProductCardWrapper', ({ theme, productListOnly, isFullBleed }) => ({
  marginRight: `${theme.spacingMultiplier}px`,
  padding: 0,
  width: isFullBleed ? `${theme.spacingMultiplier * 4.5}vw` : `${productListOnly ? 222 : MOBILE_WHATS_NEW_PRODUCT_WIDTH}px`,
  maxWidth: productListOnly ? '222px' : `${MOBILE_WHATS_NEW_PRODUCT_WIDTH}px`,
  boxSizing: 'border-box'
}))

const WhatsNewWrapper = createComponent('WhatsNewWrapper', () => {
  return {
    width: '100%',
    overflow: 'hidden'
  }
})

const ProductsSliderWrapper = createComponent('ProductsSliderWrapper', ({ theme, productListOnly, isFullBleed }) => {
  return {
    position: 'relative',
    width: '100%',
    overflowX: 'scroll',
    scrollbarWidth: 'none',
    display: 'flex',
    minHeight: isFullBleed ? '0' : `${productListOnly ? theme.spacingMultiplier * 63 : 252}px`,
    paddingBottom: isFullBleed ? `${theme.spacingMultiplier * 5.25}vw` : undefined,
    flex: 1,
    '::-webkit-scrollbar': {
      display: 'none'
    }
  }
})

const ProductsMobileSlider = createComponent('ProductsMobileSlider', ({ theme, opacity }) => {
  return {
    display: 'flex',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 2,
    paddingLeft: `${theme.spacingMultiplier * theme.custom.whatsnew.paddingMultipliers.mobileLeft}px`,
    paddingRight: `${theme.spacingMultiplier * theme.custom.whatsnew.paddingMultipliers.mobileRight}px`,
    flex: '1 0 auto',
    opacity,
    transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.easeOut}`
  }
})

const MobileScrollBar = createComponent('MobileScrollBar', ({ theme, opacity }) => {
  return {
    width: '90px',
    height: '3px',
    margin: `${theme.spacingMultiplier * 4}px auto`,
    position: 'relative',
    backgroundColor: theme.typography.colors.SecondaryGreySteel,
    opacity,
    transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.easeOut}`
  }
})

const MobileScrollThumb = createComponent('MobileScrollThumb', ({ theme, scrollPercentage }) => {
  const positionLeft = (scrollPercentage * (90 - 30)).toFixed(0)
  return {
    width: '30px',
    height: '3px',
    backgroundColor: theme.typography.colors.PrimaryBlack,
    transform: `translateX(${positionLeft}px)`,
    transition: 'translateX 200ms ease 200ms'
  }
})

const BottomSpacer = createComponent('BottomSpacer', ({ theme }) => ({
  margin: `${theme.spacingMultiplier * 5}px 0 0 0`
}))

const MobileLayout = ({
  locale,
  imageSphere,
  item,
  products,
  productUrl,
  onTargetClick,
  onProductClick,
  loadingState,
  defaultProductsLength,
  campaignInfo,
  lazy,
  theme,
  productListOnly,
  withDetails,
  isFullBleed,
  brand
}) => {
  const { teaserTitle, teaserTextPlain, target, subTitlePlain, layoutVariant } = item
  const { totalProducts } = products
  const [scrollPercentage, updateScrollPercentage] = useState(0)
  const mobileSliderWrapperEl = useRef(null)
  const mobileSliderEl = useRef(null)
  const mobileScrollHandler = throttle(() => {
    if (mobileSliderEl.current && mobileSliderWrapperEl.current) {
      const { width: parentWidth, left: parentLeft } = mobileSliderWrapperEl.current.getBoundingClientRect()
      const { left, width, right } = mobileSliderEl.current.getBoundingClientRect()
      const percentage =
        theme.direction === 'ltr'
          ? -Math.min(0, left) / (width - parentWidth - parentLeft)
          : Math.max(0, right - parentWidth) / (width - parentWidth - parentLeft)
      return updateScrollPercentage(percentage)
    }
  }, THROTTLE_TIME)

  useEffect(() => {
    if (mobileSliderWrapperEl.current) {
      mobileSliderWrapperEl?.current.addEventListener('scroll', mobileScrollHandler)
    }

    return () => {
      if (mobileSliderWrapperEl.current) {
        mobileSliderWrapperEl?.current.removeEventListener('scroll', mobileScrollHandler)
      }
    }
  }, [mobileSliderEl, mobileSliderWrapperEl])

  const renderWhatsnewInfo = () => (
    <Grid.Row
      small={{
        offset: 0,
        width: 6
      }}
      medium={{
        offset: 0,
        width: 12
      }}
      large={{
        offset: 0,
        width: 12
      }}
      xlarge={{
        offset: 0,
        width: 12
      }}
    >
      <Grid.Span
        small={{
          offset: 0,
          width: 6
        }}
        medium={{
          offset: 0,
          width: 4
        }}
        large={{
          offset: 0,
          width: 4
        }}
        xlarge={{
          offset: 0,
          width: 4
        }}
      >
        <WhatsNewInfo>
          <WhatsNewInfoBlock
            totalProducts={totalProducts}
            teaserTitle={teaserTitle}
            teaserTextPlain={teaserTextPlain}
            buttonHref={target.href}
            buttonText={target.teaserTitle}
            subTitlePlain={subTitlePlain}
            showButton={false}
            locale={locale}
            onTargetClick={onTargetClick}
            showBlockPreTitle={loadingState === STATUS.LOADED}
            layoutVariant={layoutVariant}
            brand={brand.brandId}
          />
        </WhatsNewInfo>
      </Grid.Span>
    </Grid.Row>
  )

  return (
    <WhatsNewWrapper>
      {!productListOnly && renderWhatsnewInfo()}
      <ProductsSliderWrapper innerRef={mobileSliderWrapperEl} productListOnly={productListOnly} isFullBleed={isFullBleed} >
        <ProductsSliderSkeleton slidesToShow={defaultProductsLength || 4} opacity={loadingState === STATUS.LOADED ? 0 : 1} isFullBleed={isFullBleed} />
        <ProductsMobileSlider opacity={loadingState === STATUS.LOADED ? 1 : 0} innerRef={mobileSliderEl}>
          {products &&
            products.items &&
            products.items.map((product, index) => {
              return (
                <ProductCardWrapper key={index + (product?.productId || 0)} productListOnly={productListOnly} isFullBleed={isFullBleed}>
                  <ProductCard
                    product={product}
                    imageSphere={imageSphere}
                    key={index}
                    index={index}
                    locale={locale}
                    onProductClick={onProductClick}
                    productUrlTemplate={productUrl.productUrlTemplate}
                    dataSource={products.dataSource}
                    campaignInfo={campaignInfo}
                    lazy={lazy}
                    withDetails={withDetails}
                  />
                </ProductCardWrapper>
              )
            })}
        </ProductsMobileSlider>
      </ProductsSliderWrapper>
      {!productListOnly && (
        <>
          <MobileScrollBar opacity={loadingState === STATUS.LOADED ? 1 : 0}>
            <MobileScrollThumb scrollPercentage={scrollPercentage} />
          </MobileScrollBar>
          <ShopLatestButton
            buttonHref={target.href}
            buttonText={target.teaserTitle}
            showButton
            onTargetClick={onTargetClick}
            opacity={loadingState === STATUS.LOADED ? 1 : 0}
          />
          <BottomSpacer />
        </>
      )}
    </WhatsNewWrapper>
  )
}

MobileLayout.propTypes = {
  locale: object,
  item: object.isRequired,
  products: object.isRequired,
  productUrl: object,
  onTargetClick: func,
  onProductClick: func,
  theme: object.isRequired,
  productListOnly: bool,
  brand: object
}

MobileLayout.defaultProps = {
  locale: {
    id: 'en-gb'
  },
  productUrl: {
    productUrlTemplate: '/{{LOCALE}}/shop/product{{SEO_URLKEYWORD}}'
  },
  onTargetClick: () => {},
  onProductClick: () => {},
  brand: {
    brandId: 'nap'
  }
}

export default withTheme(MobileLayout)
