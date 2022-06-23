import nock from 'nock'
import { CoremediaRenderer, iscPreset } from '@ycos/coremedia-renderer'
import { NAPMount, MRPMount, wait } from '@ycos/fela-test'
import { napBreakpoints, mrpBreakpoints } from '@ycos/themes'
import { WhatsNewData, productsData } from '../__mock__/dataNap'
import { WhatsNewDataPersonalized, productsDataPersonalized } from '../__mock__/dataPersonalized'
import WhatsNewArea from '../index'
import { truncateText } from '../common-components/ProductCard'
import '../test-utils/mockIntersectionObserver'

const scenarios = ['mobile', 'tablet', 'desktop']
const breakpoints = {
  mobile: 576,
  tablet: 768,
  desktop: 1024
}

describe('<WhatsNewArea />', () => {
  describe('nap', () => {
    const publicRuntimeConfig = {
      brand: {
        site: 'nap',
        brandId: 'nap'
      },
      wcs: {
        external: {
          baseUrl: 'http://xpto.xyz'
        },
        internal: {
          baseUrl: 'http://xpto.xyz'
        }
      },
      imagesphere: {
        nonTransformableUrls: [
          '.svg',
          '.gif',
          'cache.net-a-porter.com/images/products',
          'cache.mrporter.com/variants/images',
          'iris-integ.dev.product.ext.net-a-porter.com/mrp'
        ],
        quality: 65
      }
    }
    const extraProps = {
      locale: {
        country: 'gb',
        language: 'en',
        id: 'en-gb',
        locale: 'en_GB'
      },
      urlConfig: {
        pdp: {
          construct: '/{{LOCALE}}/shop/product{{SEO_URLKEYWORD}}'
        }
      },
      brand: {
        site: 'nap',
        brandId: 'nap'
      },
      getProductApiUrl: (_) =>
        'http://xpto.xyz/search/resources/store/nap_gb/productview/byCategory?category=/whats-new&pageSize=12&pageNumber=1&locale=en_GB&orderBy=10',
      onProductLoad: jest.fn()
    }

    const options = {
      rules: [...iscPreset(publicRuntimeConfig, extraProps)]
    }

    describe('Valid response from the server (200)', () => {
      beforeEach(() => {
        nock('http://xpto.xyz')
          .get('/search/resources/store/nap_gb/productview/byCategory?category=/whats-new&pageSize=12&pageNumber=1&locale=en_GB&orderBy=10')
          .reply(200, {
            products: productsData.items,
            pageNumber: 1,
            pageSize: 12,
            totalPages: 44,
            recordSetTotal: 535
          })
      })

      afterEach(() => {
        nock.cleanAll()
      })

      scenarios.forEach((scenario) => {
        it(`renders with mock data, when viewport in `, async (done) => {
          window.testMediaQueryValues = breakpoints[scenario]
          const { getByTestId, asFragment } = NAPMount(CoremediaRenderer(WhatsNewData(), [WhatsNewArea], options), napBreakpoints)

          await wait(() => {
            const element = getByTestId(`whats-new-wrapper-${scenario}`)
            const childrens = element.querySelectorAll('[data-testid=whats-new-product-card]')
            const whatsnewInfoBlock = element.querySelectorAll('[data-testid=whats-new-info-block]')
            const productDetail = element.querySelector('[data-automation=price]')

            expect(element).toBeDefined()
            expect(childrens.length).toBe(16)
            expect(whatsnewInfoBlock.length).toBe(1)
            expect(productDetail).toBeNull()

            // last of mock product missing imageTemplate value, but we still can see 16 products have been rendered as we expect
          })
          expect(asFragment()).toMatchSnapshot()
          done()
        })

        it(`renders product list only with mock data, when viewport in `, async (done) => {
          window.testMediaQueryValues = breakpoints[scenario]
          const { getByTestId } = NAPMount(CoremediaRenderer(WhatsNewData(true), [WhatsNewArea], options), napBreakpoints)

          await wait(() => {
            const element = getByTestId(`whats-new-wrapper-${scenario}`)
            const childrens = element.querySelectorAll('[data-testid=whats-new-product-card]')
            const whatsnewInfoBlock = element.querySelectorAll('[data-testid=whats-new-info-block]')
            const productDetail = element.querySelector('[data-automation=price]')

            expect(element).toBeDefined()
            expect(childrens.length).toBe(16)
            expect(whatsnewInfoBlock.length).toBe(0)
            expect(productDetail).toBeDefined()
          })
          done()
        })
      })

      it(`renders with custom subTitlePlain`, async (done) => {
        window.testMediaQueryValues = breakpoints['desktop']
        const data = {
          ...WhatsNewData(),
          subTitlePlain: 'RANDOM NUMBER OF ITEMS'
        }

        const { getByTestId, asFragment } = NAPMount(CoremediaRenderer(data, [WhatsNewArea], options), napBreakpoints)

        await wait(() => {
          const element = getByTestId(`whats-new-wrapper-desktop`)
          const childrens = element.querySelectorAll('[data-testid=whats-new-product-card]')

          expect(element).toBeDefined()
          expect(childrens.length).toBe(16)
        })

        expect(asFragment()).toMatchSnapshot()
        done()
      })
    })

    describe('Invalid response from the server (404)', () => {
      beforeEach(() => {
        console.error = jest.fn()
        nock('http://xpto.xyz')
          .get('/search/resources/store/nap_gb/productview/byCategory?category=/whats-new&pageSize=12&pageNumber=1&locale=en_GB&orderBy=10')
          .reply(404)
      })

      afterEach(() => {
        console.error.mockClear()
        nock.cleanAll()
      })

      scenarios.forEach((scenario) => {
        it(`renders skeleton with mock data, when viewport in ${scenario}`, async (done) => {
          window.testMediaQueryValues = breakpoints[scenario]

          const { getByTestId, asFragment } = NAPMount(CoremediaRenderer(WhatsNewData(), [WhatsNewArea], options), mrpBreakpoints)
          await wait(() => {
            return expect(getByTestId('whats-new-outer').getAttribute('data-error')).toBe('true')
          })

          expect(console.error).toHaveBeenCalled()
          expect(asFragment()).toMatchSnapshot()

          done()
        })
      })
    })
  })

  describe('mrp', () => {
    const onProductLoadSpy = jest.fn()
    const publicRuntimeConfig = {
      brand: {
        site: 'mrp',
        brandId: 'mrp'
      },
      wcs: {
        external: {
          baseUrl: 'http://xpto.xyz'
        },
        internal: {
          baseUrl: 'http://xpto.xyz'
        }
      }
    }
    const extraProps = {
      locale: {
        country: 'gb',
        language: 'en',
        id: 'en-gb',
        locale: 'en_GB'
      },
      brand: {
        site: 'mrp',
        brandId: 'mrp'
      },
      getProductApiUrl: (_) => 'http://xpto.xyz/personalization/MRP_GB/suggestions',
      onProductLoad: onProductLoadSpy
    }

    const options = {
      rules: [...iscPreset(publicRuntimeConfig, extraProps)]
    }

    describe('Valid response from the server (200)', () => {
      beforeEach(() => {
        nock('http://xpto.xyz')
          .get('/personalization/MRP_GB/suggestions')
          .reply(200, {
            products: productsDataPersonalized.items,
            dataSource: 'pop'
          })
      })

      afterEach(() => {
        nock.cleanAll()
      })

      scenarios.forEach((scenario) => {
        it(`renders with mock data, when viewport in `, async (done) => {
          window.testMediaQueryValues = breakpoints[scenario]
          const { getByTestId, asFragment } = MRPMount(CoremediaRenderer(WhatsNewDataPersonalized(), [WhatsNewArea], options), mrpBreakpoints)

          await wait(() => {
            const element = getByTestId(`whats-new-wrapper-${scenario}`)
            const childrens = element.querySelectorAll('[data-testid=whats-new-product-card]')

            expect(element).toBeDefined()
            expect(childrens.length).toBe(16)
          })
          expect(onProductLoadSpy).toHaveBeenCalledTimes(1)
          expect(onProductLoadSpy).toHaveBeenCalledWith(productsDataPersonalized.items, 'popular')
          expect(asFragment()).toMatchSnapshot()
          done()
        })
      })

      it(`renders with custom subTitlePlain`, async (done) => {
        window.testMediaQueryValues = breakpoints['desktop']
        const data = {
          ...WhatsNewDataPersonalized(),
          subTitlePlain: 'RANDOM NUMBER OF ITEMS'
        }

        const { getByTestId, asFragment } = MRPMount(CoremediaRenderer(data, [WhatsNewArea], options), mrpBreakpoints)

        await wait(() => {
          const element = getByTestId(`whats-new-wrapper-desktop`)
          const childrens = element.querySelectorAll('[data-testid=whats-new-product-card]')

          expect(element).toBeDefined()
          expect(childrens.length).toBe(16)
        })
        expect(asFragment()).toMatchSnapshot()
        done()
      })
    })

    describe('Invalid response from the server (404)', () => {
      beforeEach(() => {
        console.error = jest.fn()
        nock('http://xpto.xyz')
          .get('/personalization/MRP_GB/suggestions')
          .reply(404)
      })

      afterEach(() => {
        console.error.mockClear()
        nock.cleanAll()
      })

      scenarios.forEach((scenario) => {
        it(`renders skeleton with mock data, when viewport in ${scenario}`, async (done) => {
          window.testMediaQueryValues = breakpoints[scenario]

          const { getByTestId, asFragment } = MRPMount(CoremediaRenderer(WhatsNewDataPersonalized(), [WhatsNewArea], options), mrpBreakpoints)
          await wait(() => {
            return expect(getByTestId('whats-new-outer').getAttribute('data-error')).toBe('true')
          })

          expect(console.error).toHaveBeenCalled()
          expect(asFragment()).toMatchSnapshot()

          done()
        })
      })
    })
  })
})

describe('utilsFunction', () => {
  it('truncatedDesignerName should return the right characters of designerName', () => {
    const mockDesignerName = [
      'MAISON FRANCIS KURKDJIAN',
      'FALKE ERGONOMIC SPORT SYSTEM',
      'NAUSHEEN SHAH X MONICA SORDO',
      'PROENZA SCHOULER WHITE LABEL PROENZA SCHOULER WHITE LABEL'
    ]
    const result1 = truncateText(mockDesignerName[3], 12)
    expect(result1).toBe('PROENZA SCHO...')
    const result2 = truncateText(mockDesignerName[3], 24)
    expect(result2).toBe('PROENZA SCHOULER WHITE L...')
    const result3 = truncateText(mockDesignerName[0], 30)
    expect(result3).toBe('MAISON FRANCIS KURKDJIAN')
    const result4 = truncateText(mockDesignerName[0], 6)
    expect(result4).toBe('MAISON...')
    const result5 = truncateText(mockDesignerName[1], 9)
    expect(result5).toBe('FALKE ERG...')
    const result6 = truncateText(mockDesignerName[2], 18)
    expect(result6).toBe('NAUSHEEN SHAH X MO...')
  })
})
