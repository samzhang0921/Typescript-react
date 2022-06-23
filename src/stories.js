import React, { useEffect, useState } from 'react'
import { StoryEntry, StoryRenderer } from '@ycos/storybook'
import { storiesOf } from '@storybook/react'
import querystring from 'querystring'
import { iscPreset } from '@ycos/coremedia-renderer'
import WhatsNewArea from './index'
import { WhatsNewData } from './__mock__/dataNap'
import { WhatsNewDataPersonalized } from './__mock__/dataPersonalized'

const StoryComp = ({ productListOnly }) => {
  const [brand, setBrand] = useState()

  useEffect(() => {
    const brand = querystring.parse(location.search.slice(1))?.brand || sessionStorage.getItem('brand')
    setBrand(brand || 'mrp')
  }, [])
  
  const options = {
    nap: {
      data: WhatsNewData(productListOnly),
      layoutVariant: 'isc-whats-new'
    },
    mrp: {
      data: WhatsNewDataPersonalized(productListOnly),
      layoutVariant: 'isc-whats-new-personalized'
    },
    'mrp-rtl': {
      data: WhatsNewDataPersonalized(productListOnly),
      layoutVariant: 'isc-whats-new-personalized'
    },
    'nap-rtl': {
      data: WhatsNewData(productListOnly),
      layoutVariant: 'isc-whats-new'
    },
    ton: {
      data: WhatsNewDataPersonalized(productListOnly),
      layoutVariant: 'isc-whats-new-personalized'
    }
  }[brand || 'mrp']

  return (
    <StoryEntry component="WhatsNewCarousel" layoutVariant={options.layoutVariant}>
      {StoryRenderer(options.data, [WhatsNewArea], {
        rules: [
          ...iscPreset(
            {
              brand: {
                site: {
                  brandId: brand
                }
              },
              imageSphere: {
                mrp: {
                  nonTransformableUrls: [
                    '.svg',
                    '.gif',
                    'cache.net-a-porter.com/images/products',
                    'cache.mrporter.com/variants/images',
                    'iris-integ.dev.product.ext.net-a-porter.com/mrp'
                  ],
                  quality: 65,
                  extraWidth: '_a3-4_ccrop',
                  aspectRatio: 1.333,
                  noPadding: true
                },
                'mrp-rtl': {
                  nonTransformableUrls: [
                    '.svg',
                    '.gif',
                    'cache.net-a-porter.com/images/products',
                    'cache.mrporter.com/variants/images',
                    'iris-integ.dev.product.ext.net-a-porter.com/mrp'
                  ],
                  quality: 65,
                  extraWidth: '_a3-4_ccrop',
                  aspectRatio: 1.333,
                  noPadding: true
                },
                nap: {
                  nonTransformableUrls: [
                    '.svg',
                    '.gif',
                    'cache.net-a-porter.com/images/products',
                    'cache.mrporter.com/variants/images',
                    'iris-integ.dev.product.ext.net-a-porter.com/mrp'
                  ],
                  quality: 65
                },
                ton: {
                  nonTransformableUrls: [
                    '.svg',
                    '.gif',
                    'cache.net-a-porter.com/images/products',
                    'cache.mrporter.com/variants/images',
                    'iris-integ.dev.product.ext.net-a-porter.com/mrp'
                  ],
                  quality: 65,
                  extraWidth: '_a3-4_ccrop',
                  aspectRatio: 1.333,
                  noPadding: true
                },
                'nap-rtl': {
                  nonTransformableUrls: [
                    '.svg',
                    '.gif',
                    'cache.net-a-porter.com/images/products',
                    'cache.mrporter.com/variants/images',
                    'iris-integ.dev.product.ext.net-a-porter.com/mrp'
                  ],
                  quality: 65
                }
              }[brand || 'mrp'],
              wcs: {
                internal: {
                  baseUrl: 'https://legacy-nap-e2e-master.eks-dev.inseason.aws.dev.e-comm/legacy-api/polyjuice/',
                  clientId: '3eeee1b1-ebfd-41be-92d9-4bed5e860989'
                },
                external: {
                  baseUrl: 'https://legacy-nap-e2e-master.eks-dev.inseason.aws.dev.e-comm/legacy-api/polyjuice/',
                  clientId: '3eeee1b1-ebfd-41be-92d9-4bed5e860989'
                }
              }
            },
            {
              locale: {
                id: 'en-gb',
                country: 'gb',
                language: 'en'
              }
            }
          )
        ]
      })}
    </StoryEntry>
  )
}

storiesOf('Components/WhatsNewCarousel', module).add('default', () => {
  return <StoryComp />
})
.add('productListOnly', () => {
  return <StoryComp productListOnly={true} />
})
