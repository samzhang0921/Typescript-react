import React from 'react'
import { createComponent, withTheme } from '@ycos/fela'
import { Picture } from '@ycos/picture'
import { constructUrl } from '@ynap/url-configuration'
import { string, object, func, number, bool } from 'prop-types'
import { getImgUrlFromProduct } from '../utils/GetImgUrlFromProduct'
import Designer from './DesignerNameLabel'
import { createFontStyle } from '@ycos/primitives'
import ProductPrice from '@ycos/component-product-price';

const MAX_DESIGNER_NAME_LENGTH = 28

const LinkWrapper = createComponent(
  'LinkWrapper',
  () => ({
    width: '100%',
    height: '100%',
    display: 'block',
    paddingTop: 3
  }),
  'a'
)

const ImageWrapper = createComponent('ImageWrapper', ({ theme, pidPaddingConfig }) => {
  const IMAGE_RATIO = (1 - theme.custom.whatsnew.pids.defaultWidth / theme.custom.whatsnew.pids.defaultHeight) * 100
  const pidPadding = !pidPaddingConfig ? theme.custom.whatsnew.pids.pidPadding : false
  return {
    display: 'block',
    width: '100%',
    position: 'relative',
    ...(pidPadding
      ? {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${IMAGE_RATIO}% ${theme.spacingMultiplier * 1.5}px`,
        boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'
      }
      : {})
  }
})

const PictureHoverState = createComponent('PictureHoverState', ({ theme }) => {
  return {
    width: '100%',
    height: '100%',
    backgroundColor: theme.typography.colors.PrimaryWhite,
    opacity: 0,
    position: 'absolute',
    zIndex: 2,
    transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.ease}`,
    ':hover': {
      opacity: '0.3'
    }
  }
})

const ImageContentWrapper = createComponent('ImageContentWrapper', () => {
  return {
    width: '100%',
    position: 'relative'
  }
})

const ProductCardImageHolder = createComponent('ProductCardImageHolder', ({ theme }) => {
  return {
    display: 'block',
    width: '100%',
    height: '100%',
    background: theme.typography.colors.PrimaryGrey,
    position: 'absolute',
    top: '0'
  }
})

const Description = createFontStyle('Description', {
  type: 'Paragraph',
  name: '4',
}, ({ theme }) => ({
  color: theme.custom.productCard.descriptionColor,
  textAlign: 'center',
  minHeight: `${theme.spacingMultiplier * 5.25}px`
}))


export const truncateText = (str, maxLength) => {
  const trimStr = str.substring(0, maxLength)
  return str.length > maxLength ? `${trimStr}...` : str
}

const ProductCard = ({ index, locale, imageSphere, productUrlTemplate, product, onProductClick, dataSource, theme, campaignInfo, lazy, withDetails = false }) => {
  const {
    custom: {
      whatsnew: {
        pids: { imageAspectRatio }
      }
    }
  } = theme
  const { designerName, designerNameEN, seo, productColours, productUrl, name, price } = product
  const productSEO = productColours?.find((color) => color.selected)?.seo || productColours?.[0]?.seo || seo
  const templateParams = {
    LOCALE: locale.id,
    SEO_URLKEYWORD: productSEO?.seoURLKeyword || productUrl
  }
  const source = {
    pop: 'popular',
    rec: 'recommended',
    ran: 'random'
  }[dataSource]
  let productLink = constructUrl(productUrlTemplate, templateParams)

  if (campaignInfo) {
    productLink = productLink.concat(
      `?cm_sp=${campaignInfo?.placement}-_-${campaignInfo?.position}-_-${campaignInfo?.campaignName}-product${index + 1}-${source}-_-${campaignInfo?.campaignStartDate
      }`
    )
  }

  const inImgUrl = getImgUrlFromProduct(product, 'in', imageSphere)
  const truncatedDesignerName = truncateText(designerName || designerNameEN, MAX_DESIGNER_NAME_LENGTH)
  // the logic is flawed, but roughly 28 character because...
  // consider a designer name in mobile view where each word in the name contains two wide letters (i.e W or M) and the rest "normal" letters (i.e A)
  // should the designer name consist of two words, a word for each line, 14 is the max number of letters in the first word before overflow, 13 in the second word should we need to include "..."
  // The longest first word in a designer name is "LOVESHACKFANCY" at 14
  // test string "WWAAAAAAAAAAAA WWAAAAAAAAAAA"

  const images = [
    {
      type: 'image',
      imageUrl: inImgUrl
    }
  ]

  const imageSphereObj = { ...imageSphere, wZero: false }
  const aspectRatio = imageSphere?.aspectRatio ? imageSphere.aspectRatio : imageAspectRatio

  return (
    <>
      <LinkWrapper data-testid="whats-new-product-card" href={productLink} onClick={() => onProductClick(product, index, source)}>
        <ImageWrapper pidPaddingConfig={imageSphere.noPadding}>
          <ImageContentWrapper>
            <PictureHoverState />
            <Picture
              imagesphere={imageSphereObj}
              images={images}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '100%',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
              forceAspectRatioDesktop={aspectRatio}
              forceAspectRatioMobile={aspectRatio}
              lazy={lazy}
            />
            {!inImgUrl && <ProductCardImageHolder />}
          </ImageContentWrapper>
        </ImageWrapper>
        <Designer>{truncatedDesignerName}</Designer>
        {withDetails && 
          <>
              <Description>{name}</Description>
              <ProductPrice {...product} currencyDisplay={price.currency.symbol} />
          </>
        }
      </LinkWrapper>
    </>
  )
}

ProductCard.propTypes = {
  index: number.isRequired,
  locale: object,
  productUrlTemplate: string,
  product: object.isRequired,
  onProductClick: func,
  theme: object,
  withDetails: bool
}

ProductCard.defaultProps = {
  locale: {
    id: 'en-gb'
  },
  imageSphere: {
    nonTransformableUrls:
      ['.svg',
        '.gif',
        'cache.net-a-porter.com/images/products',
        'cache.mrporter.com/variants/images',
        'iris-integ.dev.product.ext.net-a-porter.com/mrp'
      ],
    quality: 65
  },
  productUrlTemplate: '/shop/product{seoURLKeyword}',
  onProductClick: () => { },
  theme: {
    custom: {
      whatsnew: {
        pids: 1.044
      }
    }
  }
}

export default withTheme(ProductCard)
