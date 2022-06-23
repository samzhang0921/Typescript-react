import React from 'react'
import { createComponent, withTheme } from '@ycos/fela'
import { string, object, func, bool, number, oneOf } from 'prop-types'
import ProductCard from '../common-components/ProductCard'
import getDelays from './getDelays'
import { getSlideAnimation } from './Animations'

const ProductCardWrapper = createComponent('ProductCardWrapper', ({ theme, slideFadeAnimationEntering, pidDelay, direction, shouldAnimate }) => {
  return {
    padding: `0 ${theme.spacingMultiplier}px`,
    ...getSlideAnimation(slideFadeAnimationEntering, pidDelay, direction, shouldAnimate, theme.motionSpecs),
    'screen-xlarge': {
      padding: `0 ${theme.spacingMultiplier * 1.5}px`
    }
  }
})

const ProductCardDeskTop = ({
  locale,
  imageSphere,
  productUrlTemplate,
  product,
  visible,
  itemsPerSlide,
  index,
  onProductClick,
  slideFadeAnimationEntering,
  direction,
  animationGroupNeedle,
  dataSource,
  campaignInfo,
  withDetails,
  lazy
}) => {
  const pidDelay = getDelays(itemsPerSlide, index, direction)
  const pidsGroupToAnimate = [animationGroupNeedle * itemsPerSlide, animationGroupNeedle * itemsPerSlide + itemsPerSlide]
  const [bottomLimit, topLimit] = pidsGroupToAnimate
  const shouldAnimate = index >= bottomLimit && index < topLimit

  return (
    <ProductCardWrapper slideFadeAnimationEntering={slideFadeAnimationEntering} pidDelay={pidDelay} direction={direction} shouldAnimate={shouldAnimate}>
      <ProductCard
        index={index}
        imageSphere={imageSphere}
        onProductClick={onProductClick}
        locale={locale}
        productUrlTemplate={productUrlTemplate}
        product={product}
        visible={visible}
        dataSource={dataSource}
        campaignInfo={campaignInfo}
        lazy={lazy}
        withDetails={withDetails}
      />
    </ProductCardWrapper>
  )
}

ProductCardDeskTop.propTypes = {
  locale: object,
  productUrlTemplate: string,
  product: object.isRequired,
  visible: bool,
  itemsPerSlide: number,
  index: number.isRequired,
  onProductClick: func,
  slideFadeAnimationEntering: oneOf([undefined, false, true]),
  direction: string,
  animationGroupNeedle: number
}

ProductCardDeskTop.defaultProps = {
  locale: {
    id: 'en-gb'
  },
  productUrlTemplate: '/{{LOCALE}}/shop/product{{SEO_URLKEYWORD}}',
  visible: false,
  itemsPerSlide: 4,
  onProductClick: () => {},
  slideFadeAnimationEntering: undefined,
  direction: 'previous',
  animationGroupNeedle: 0
}

export default withTheme(ProductCardDeskTop)
