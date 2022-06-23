import React, { useEffect, useState } from 'react'
import { createComponent } from '@ycos/fela'
import { hasTag } from '@ycos/coremedia-renderer'
import { object, func, bool } from 'prop-types'
import 'cross-fetch/polyfill'
import DesktopLayout from './desktop/DesktopLayout'
import TabletLayout from './tablet/TabletLayout'
import MobileLayout from './mobile/MobileLayout'
import { getProductsListParameters, getProductApiHeaders } from './utils/ProductUtils'
import { STATUS } from './constants'

const FETCH_ERROR_MESSAGE = 'Cannot fetch products from API'
const FADEOUT_TRIGGER_TIME = 1000

const MobileBreakpoint = createComponent('MobileBreakpoint', ({ theme, productListOnly }) => ({
  display: 'block',
  marginTop: productListOnly ? 0 : (-theme.spacingMultiplier * 3),
  'screen-medium': {
    display: 'none'
  }
}))

const TabletBreakpoint = createComponent('TabletBreakpoint', ({ theme, productListOnly }) => ({
  display: 'none',
  'screen-medium': {
    display: 'block',
    marginTop: productListOnly ? 0 : (-theme.spacingMultiplier * 4)
  },
  'screen-large': {
    display: 'none'
  }
}))

const DesktopBreakpoint = createComponent('DesktopBreakpoint', ({ theme }) => ({
  display: 'none',
  'screen-large': {
    paddingTop: 1 * theme.spacingMultiplier,
    display: 'block',
    boxSizing: 'border-box'
  }
}))

const WhatsNewOuter = createComponent(
  'WhatsNewInfo',
  ({ theme, productListOnly }) => {
    const { mobile, medium, large, xLarge } = theme.custom.whatsnew.heights;
    const customHeight = {
      minHeight: mobile,
      'screen-medium': {
        minHeight: medium
      },
      'screen-large': {
        minHeight: large
      },
      'screen-xlarge': {
        minHeight: xLarge
      }
    }
    return ({
      position: 'relative',
      ...(!productListOnly && customHeight)
    })
  },
  'div',
  ['data-error']
)

const WhatsNewOuterHolder = createComponent('WhatsNewOuterHolder', ({ productListOnly }) => ({
  direction: 'ltr',
  position: 'static',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  'screen-medium': {
    position: productListOnly ? 'relative' : 'absolute'
  },
  'screen-large': {
    position: 'relative'
  }
}))

const fetchProductsData = (url, config, setLoadingState, isComponentMatched, onProductLoad) => {
  let isSubscribed = false
  const [data, setData] = useState([])

  const fetchProducts = async () => {
    const headers = getProductApiHeaders(config)
    const response = await fetch(url, {
      headers: { ...headers }
    })

    const result = await response.json()
    const { products, pageNumber, totalPages, recordSetTotal, dataSource } = result
    return { items: products, pageNumber, totalPages, totalProducts: recordSetTotal, dataSource }
  }

  useEffect(() => {
    if (isComponentMatched) {
      isSubscribed = true
      setLoadingState(STATUS.LOADING)
      fetchProducts(isSubscribed)
        .then((response) => {
          if (isSubscribed) {
            if (typeof onProductLoad === 'function') {
              const dataSource = {
                pop: 'popular',
                rec: 'recommended',
                ran: 'random'
              }
              onProductLoad(response.items, dataSource[response.dataSource])
            }
            setData(response)
            setTimeout(() => {
              setLoadingState(STATUS.LOADED)
            }, FADEOUT_TRIGGER_TIME + 200)
          }
        })
        .catch(() => {
          if (isSubscribed) {
            setLoadingState(STATUS.ERROR)
            // eslint-disable-next-line no-console
            console.error(FETCH_ERROR_MESSAGE)
          }
        })

      return () => (isSubscribed = false)
    }
  }, [isComponentMatched])

  return data
}

const WhatsNewArea = ({
  locale,
  brand,
  item,
  urlConfig,
  onTargetClick,
  onProductClick,
  onArrowClick,
  config,
  productsData,
  isComponentMatched,
  customerId,
  getProductApiUrl,
  maxProducts,
  onNavigationClick,
  onProductLoad,
  campaignInfo,
  lazy
}) => {
  const [loadingState, setLoadingState] = useState(productsData.items.length === 0 ? STATUS.NOTLOADED : STATUS.LOADED)
  const productListParameters = getProductsListParameters(item.ynapParameter)
  const { productsPerPage } = productListParameters
  const { wcs, imageSphere } = config
  let productsToRender
  if (productsData.items.length === 0) {
    const url = getProductApiUrl({
      params: productListParameters,
      locale,
      wcs,
      brand,
      customerId
    })
    productsToRender = fetchProductsData(url, config, setLoadingState, isComponentMatched, onProductLoad)
  } else {
    productsToRender = productsData
  }

  let trimItems = productsToRender?.items

  if (trimItems?.length > maxProducts) {
    trimItems = trimItems.slice(0, maxProducts)
  }

  if (trimItems?.length % 4) {
    trimItems = trimItems.slice(0, -trimItems?.length % 4)
  }

  productsToRender = {
    ...productsToRender,
    items: trimItems
  }

  const productUrl = {
    productUrlTemplate: urlConfig.pdp.construct
  }

  const { tags = '' } = item
  const productListOnly = hasTag(tags, 'WhatsnewCarousel.productListOnly')
  const withDetails = hasTag(tags, 'WhatsnewCarousel.withDetails')
  const isFullBleed = hasTag(tags, 'WhatsnewCarousel.fullBleed')

  const layoutParams = {
    locale,
    imageSphere,
    item,
    products: productsToRender,
    productUrl,
    onTargetClick,
    onProductClick,
    onArrowClick,
    defaultProductsLength: productsPerPage,
    loadingState,
    onNavigationClick,
    campaignInfo,
    lazy,
    brand,
    productListOnly,
    withDetails,
    isFullBleed
  }
  const WhatsNewLayout = () => {
    return (
      <WhatsNewOuterHolder productListOnly={productListOnly}>
        <MobileBreakpoint data-testid="whats-new-wrapper-mobile" productListOnly={productListOnly}>
          <MobileLayout {...layoutParams} />
        </MobileBreakpoint>

        <TabletBreakpoint data-testid="whats-new-wrapper-tablet" productListOnly={productListOnly}>
          <TabletLayout {...layoutParams} />
        </TabletBreakpoint>

        <DesktopBreakpoint data-testid="whats-new-wrapper-desktop">
          <DesktopLayout {...layoutParams} />
        </DesktopBreakpoint>
      </WhatsNewOuterHolder>
    )
  }

  return (
    <WhatsNewOuter
      data-cm-metadata={item?.dataCmMetadata}
      data-testid="whats-new-outer"
      data-error={loadingState === STATUS.ERROR}
      data-automation={`whats-new-loaded-${loadingState === STATUS.LOADED}`}
      productListOnly={productListOnly}
    >
      <WhatsNewLayout />
    </WhatsNewOuter>
  )
}

WhatsNewArea.layoutVariant = ['isc-whats-new', 'isc-whats-new-personalized']

WhatsNewArea.propTypes = {
  locale: object,
  item: object.isRequired,
  productsData: object,
  urlConfig: object,
  onTargetClick: func,
  onProductClick: func,
  onArrowClick: func,
  isComponentMatched: bool,
  getProductApiUrl: func.isRequired,
  lazy: bool,
  brand: object
}

WhatsNewArea.defaultProps = {
  locale: {
    id: 'en-gb'
  },
  brand: {
    brandId: 'nap'
  },
  urlConfig: {
    pdp: {
      construct: '/{{LOCALE}}/shop/product{{SEO_URLKEYWORD}}'
    }
  },
  onTargetClick: () => {},
  onProductClick: () => {},
  onArrowClick: () => {},
  getProductApiUrl: () => {},
  onNavigationClick: () => {},
  productsData: {
    items: [],
    pageNumber: 0,
    totalPages: 0,
    totalProducts: 0,
    dataSource: ''
  },
  isComponentMatched: true,
  lazy: true,
  maxProducts: 16,
}

export default WhatsNewArea
