import React, { useRef, useState, useEffect } from 'react'
import { createComponent, withTheme } from '@ycos/fela'
import throttle from 'lodash.throttle'
import { object, func, bool } from 'prop-types'
import ProductCard from '../common-components/ProductCard'
import HeadText from './HeadText'
import { STATUS } from '../constants'
import ProductsSliderSkeleton from '../common-components/ProductsSliderSkeleton'
import WhatsNewInfoBlock from '../common-components/WhatsNewInfoBlock'

const TABLET_WHATS_NEW_INFO_WIDTH = 360
const TABLET_WHATS_NEW_PRODUCT_WIDTH = 140
const THROTTLE_TIME = 100

const WhatsNewInfo = createComponent('WhatsNewInfo', ({ theme }) => ({
  width: '280px',
  padding: '0',
  margin: `0 ${10 * theme.spacingMultiplier}px 0 ${4 * theme.spacingMultiplier}px`
}))
const WhatsNewWrapper = createComponent('WhatsNewWrapper', () => {
  return {
    width: '100%',
    overflow: 'hidden'
  }
})

const ProductCardWrapper = createComponent('ProductCardWrapper', ({ theme, productListOnly, isFullBleed }) => ({
  padding: 0,
  boxSizing: 'border-box',
  width: isFullBleed ? `${theme.spacingMultiplier * 3.25}vw` : `${productListOnly ? 222 : TABLET_WHATS_NEW_PRODUCT_WIDTH}px`,
  marginRight: `${3 * theme.spacingMultiplier}px`
}))

const ProductsSliderWrapper = createComponent('ProductsSliderWrapper', ({ theme, productListOnly, isFullBleed }) => {
  return {
    width: '100%',
    overflowX: 'scroll',
    scrollbarWidth: 'none',
    display: 'flex',
    flex: 1,
    '::-webkit-scrollbar': {
      display: 'none'
    },
    minHeight: productListOnly && !isFullBleed ? `${theme.spacingMultiplier * 63}px` : 'auto',
    paddingBottom: isFullBleed ? `${theme.spacingMultiplier * 2}vw` : undefined,
  }
})

const ProductsTabletSlider = createComponent('ProductsTabletSlider', ({ theme }) => {
  return {
    position: 'relative',
    display: 'flex',
    boxSizing: 'border-box',
    paddingLeft: `${theme.spacingMultiplier * theme.custom.whatsnew.paddingMultipliers.mobileLeft}px`,
    paddingRight: `${theme.spacingMultiplier * theme.custom.whatsnew.paddingMultipliers.mobileRight}px`,
    flex: '1 0 auto'
  }
})

const ProductSliderContainer = createComponent('ProductSliderContainer', ({ numberOfProducts }) => {
  return {
    position: 'relative',
    display: 'block',
    width: `${(TABLET_WHATS_NEW_PRODUCT_WIDTH + 24) * numberOfProducts}px`
  }
})

const ProductsSliderPositioner = createComponent('ProductsSliderPositioner', ({ opacity, theme }) => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexWrap: 'nowrap',
    opacity,
    transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.easeOut}`
  }
})

const TabletLayout = ({
  locale,
  imageSphere,
  item,
  products,
  productUrl,
  onTargetClick,
  onProductClick,
  defaultProductsLength,
  loadingState,
  campaignInfo,
  lazy,
  theme,
  productListOnly,
  withDetails,
  isFullBleed,
  brand
}) => {
  const { teaserTitle, teaserTextPlain, target, preTitlePlain, subTitlePlain, layoutVariant } = item
  const { totalProducts } = products
  const [showHeadText, updateShowHeadText] = useState(false)
  const tabletSliderWrapperEl = useRef(null)
  const tabletSliderEl = useRef(null)
  const tabletScrollHandler = throttle(() => {
    if (tabletSliderEl.current && tabletSliderWrapperEl.current) {
      const { left, right } = tabletSliderEl.current.getBoundingClientRect()
      const { width: parentWidth } = tabletSliderWrapperEl.current.getBoundingClientRect()
      if (theme.direction === 'ltr') {
        if (Math.abs(left) >= TABLET_WHATS_NEW_INFO_WIDTH - 50) {
          return updateShowHeadText(!showHeadText)
        }
        return updateShowHeadText(false)
      }
      if (right >= parentWidth + TABLET_WHATS_NEW_INFO_WIDTH - 50) {
        return updateShowHeadText(!showHeadText)
      }
      return updateShowHeadText(false)
    }
  }, THROTTLE_TIME)

  useEffect(() => {
    if (tabletSliderWrapperEl.current) {
      tabletSliderWrapperEl?.current.addEventListener('scroll', tabletScrollHandler)
    }
    return () => {
      if (tabletSliderWrapperEl.current) {
        tabletSliderWrapperEl?.current.removeEventListener('scroll', tabletScrollHandler)
      }
    }
  }, [tabletSliderWrapperEl, tabletSliderEl])

  return (
    <WhatsNewWrapper>
      {!productListOnly && <HeadText showHeadText={showHeadText} preTitlePlain={preTitlePlain} />}
      <ProductsSliderWrapper innerRef={tabletSliderWrapperEl} productListOnly={productListOnly} isFullBleed={isFullBleed}>
        <ProductsTabletSlider innerRef={tabletSliderEl}>
          {!productListOnly && <WhatsNewInfo>
            <WhatsNewInfoBlock
              totalProducts={totalProducts}
              teaserTitle={teaserTitle}
              teaserTextPlain={teaserTextPlain}
              buttonHref={target.href}
              buttonText={target.teaserTitle}
              subTitlePlain={subTitlePlain}
              locale={locale}
              onTargetClick={onTargetClick}
              showBlockPreTitle={loadingState === STATUS.LOADED}
              layoutVariant={layoutVariant}
              brand={brand.brandId}
            />
          </WhatsNewInfo>}
          <ProductSliderContainer numberOfProducts={defaultProductsLength}>
            <ProductsSliderSkeleton slidesToShow={defaultProductsLength || 4} opacity={loadingState === STATUS.LOADED ? 0 : 1} isFullBleed={isFullBleed} />
            <ProductsSliderPositioner opacity={loadingState === STATUS.LOADED ? 1 : 0}>
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
            </ProductsSliderPositioner>
          </ProductSliderContainer>
        </ProductsTabletSlider>
      </ProductsSliderWrapper>
    </WhatsNewWrapper>
  )
}

TabletLayout.propTypes = {
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

TabletLayout.defaultProps = {
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

export default withTheme(TabletLayout)
