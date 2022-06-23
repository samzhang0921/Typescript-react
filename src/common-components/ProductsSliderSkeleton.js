import React from 'react'
import { createComponent, withTheme } from '@ycos/fela'
import ProductTextSkeleton from '../common-components/DesignerNameLabel'

const TABLET_WHATS_NEW_PRODUCT_WIDTH = 140
const MOBILE_WHATS_NEW_PRODUCT_WIDTH = 144
const MOBILE_PRODUCTLIST_PRODUCT_WIDTH = 222
const MOBILE_PRODUCTLIST_PRODUCT_FULLBLEED_WIDTH = 36

const SliderSkeleton = createComponent('SliderSkeleton', ({ opacity, theme }) => {
  return {
    display: 'inline-flex',
    paddingLeft: `${theme.spacingMultiplier * 2}px`,
    paddingRight: `${theme.spacingMultiplier}px`,
    opacity,
    transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.easeOut} ${theme.motionSpecs.motionDurations.t3}ms`,

    'screen-medium': {
      display: 'flex',
      flexWrap: 'nowrap',
      paddingLeft: 0,
      paddingRight: 0
    },

    'screen-large': {
      flexWrap: 'wrap',
      width: '100%',
      margin: `0 -${theme.spacingMultiplier}`
    }
  }
})

const ProductCardSkeleton = createComponent('ProductCardSkeleton', ({ theme, slidesToShow, productListOnly, isFullBleed }) => {
  const paddingBottom = productListOnly ? '8%' : 0
  return {
    width: isFullBleed ? `${MOBILE_PRODUCTLIST_PRODUCT_FULLBLEED_WIDTH}vw` : `${productListOnly ? MOBILE_PRODUCTLIST_PRODUCT_WIDTH : MOBILE_WHATS_NEW_PRODUCT_WIDTH}px`,
    maxWidth: `${productListOnly ? MOBILE_PRODUCTLIST_PRODUCT_WIDTH : MOBILE_WHATS_NEW_PRODUCT_WIDTH}px`,
    marginRight: `${theme.spacingMultiplier}px`,
    padding: 0,
    boxSizing: 'border-box',

    'screen-medium': {
      display: 'inline-block',
      flex: isFullBleed ? '1 0 auto' : `1 0 ${productListOnly ? MOBILE_PRODUCTLIST_PRODUCT_WIDTH :TABLET_WHATS_NEW_PRODUCT_WIDTH}px`,
      marginRight: `${3 * theme.spacingMultiplier}px`,
      maxWidth: 'none',
      width: isFullBleed ? `${3.25 * theme.spacingMultiplier}vw` : undefined
    },

    'screen-large': {
      display: 'block',
      width: `calc((100% -${slidesToShow * theme.spacingMultiplier}px) / ${slidesToShow})`,
      maxWidth: `calc((100% -${slidesToShow * theme.spacingMultiplier}px) / ${slidesToShow})`,
      margin: `0 0 ${theme.spacingMultiplier * theme.custom.whatsnew.pids.skeletonBottonMargin}px 0`,
      padding: `0 ${theme.spacingMultiplier}px ${paddingBottom} ${theme.spacingMultiplier}px`
    },

    'screen-xlarge': {
      padding: `0 ${theme.spacingMultiplier * 1.5}px ${paddingBottom} ${theme.spacingMultiplier * 1.5}px`,
      margin: 0
    }
  }
})

const ProductCardImageSkeleton = createComponent('ProductCardImageSkeleton', ({ theme }) => {
  const IMAGE_RATIO = (theme.custom.whatsnew.pids.defaultWidth / theme.custom.whatsnew.pids.defaultHeight) * 100
  return {
    display: 'block',
    width: '100%',
    padding: `${IMAGE_RATIO}% 0`,
    background: theme.typography.colors.PrimaryGrey,
    'screen-xlarge': {
      paddingLeft: `${theme.spacingMultiplier * 3}px`
    }
  }
})

const renderProductSkeletons = (slidesToShow, theme, productListOnly, isFullBleed) => {
  const items = []
  for (let index = 0; index < slidesToShow; index += 1) {
    items.push(
      <ProductCardSkeleton slidesToShow={slidesToShow} key={index} productListOnly={productListOnly} isFullBleed={isFullBleed} >
        <ProductCardImageSkeleton />
        <ProductTextSkeleton>&#8203;</ProductTextSkeleton>
      </ProductCardSkeleton>
    )
  }
  return items
}

const ProductsSliderSkeleton = ({ opacity, slidesToShow, theme, productListOnly, isFullBleed }) => {
  return <SliderSkeleton opacity={opacity}>{renderProductSkeletons(slidesToShow, theme, productListOnly, isFullBleed)}</SliderSkeleton>
}

export default withTheme(ProductsSliderSkeleton)
