import React from 'react'
import { createComponent, withTheme } from '@ycos/fela'
import { Grid } from '@ycos/component-grid'
import { object, func, bool } from 'prop-types'
import DesktopCarousel from './DesktopCarousel'
import WhatsNewInfoBlock from '../common-components/WhatsNewInfoBlock'

import { STATUS } from '../constants'

const WhatsNewInfoNap = createComponent('WhatsNewInfo', ({ brand }) => ({
  position: 'absolute',
  top: brand === 'mrp' ? '0' : '50%',
  left: '50%',
  transform: brand === 'mrp' ? 'translate(-50%)' : 'translate(-50%, -50%)',
  width: '100%',
  margin: '0'
}))

const LayoutWrapper = createComponent('LayoutWrapper', () => ({
  position: 'relative'
}))

const WhatsNewInfoPersonalized = createComponent('WhatsNewInfo', () => ({
  position: 'absolute',
  top: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  margin: '0'
}))

const DesktopLayout = ({
  locale,
  imageSphere,
  item,
  products,
  productUrl,
  onTargetClick,
  onProductClick,
  onArrowClick,
  loadingState,
  onNavigationClick,
  campaignInfo,
  lazy,
  brand,
  productListOnly,
  withDetails
}) => {
  const { teaserTitle, teaserTextPlain, target, subTitlePlain, layoutVariant } = item
  const { totalProducts } = products
  const WhatsNewInfo = {
    'isc-whats-new': WhatsNewInfoNap,
    'isc-whats-new-personalized': WhatsNewInfoPersonalized
  }[layoutVariant]

  const renderCarousel = () => (
    <DesktopCarousel
      locale={locale}
      imageSphere={imageSphere}
      products={products}
      onProductClick={onProductClick}
      onArrowClick={onArrowClick}
      productUrl={productUrl}
      loadingState={loadingState}
      onNavigationClick={onNavigationClick}
      campaignInfo={campaignInfo}
      lazy={lazy}
      brand={brand}
      withDetails={withDetails}
      productListOnly={productListOnly}
    />
  )

  const renderWhatsnewSection = () => (
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
        <WhatsNewInfo brand={brand.brandId}>
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
        </WhatsNewInfo>
      </Grid.Span>
      <Grid.Span
        small={{
          offset: 0,
          width: 6
        }}
        medium={{
          offset: 0,
          width: 8
        }}
        large={{
          offset: 0,
          width: 8
        }}
        xlarge={{
          offset: 0,
          width: 8
        }}
      >
        {renderCarousel()}
      </Grid.Span>
    </Grid.Row>
  )

  return <LayoutWrapper>{productListOnly ? renderCarousel() : renderWhatsnewSection()}</LayoutWrapper>
}

DesktopLayout.propTypes = {
  locale: object,
  item: object.isRequired,
  products: object.isRequired,
  productUrl: object,
  onTargetClick: func,
  onProductClick: func,
  onArrowClick: func,
  brand: object,
  productListOnly: bool
}

DesktopLayout.defaultProps = {
  locale: {
    id: 'en-gb'
  },
  brand: {
    brandId: 'nap'
  },
  productUrl: {
    productUrlTemplate: '/{{LOCALE}}/shop/product{{SEO_URLKEYWORD}}'
  },
  onTargetClick: () => {},
  onProductClick: () => {},
  onArrowClick: () => {}
}

export default withTheme(DesktopLayout)
