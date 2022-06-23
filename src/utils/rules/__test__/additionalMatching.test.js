import additionalMatching from '../additionalMatching'

/**
 * additionalMatching function returns a boolean.
 * If the response is True, uses the default logic from UserAttributesCollection.
 * If False, stays as fallback and don't change to EIP.
 *
 * This logic is exclusive to Whats New component for now.
 */

describe('additionalMatching', () => {

  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
        json: () => ({
          selectedCategory: {
            visibility: {
              startDate: '2020-11-04T09:00:00Z',
              endDate: '2020-11-06T05:59:59Z',
            },
          },
          recordSetTotal: 31
        })
      })
    )
  })

  afterEach(() => {
    fetch.mockClear()
    Date.now.mockClear()
  })

  const component = {
    props: {
      item: {
        layoutVariant: 'isc-whats-new',
        ynapParameter: '{ "seoUrl": "/eip-preview" }'
      }
    }
  }

  const parameters = {
    userClass: 'EIP',
    component: component,
    locale: {
      country: 'gb',
      language: 'en',
      id: 'en-gb',
      locale: 'en_GB',
    },
    brand: 'nap',
    config: {
      wcs: {
        external: {
          baseUrl: 'http://xpto.xyz',
        },
        internal: {
          baseUrl: 'http://xpto.xyz',
        },
        productsByCategoryPath:
          '/search/resources/store/{{brandSite}}/productview/byCategory?category={{seoUrl}}&pageSize={{pageSize}}&pageNumber={{pageNumber}}&locale={{locale}}',
      },
    },
  }

  it('Should return true when successfully EIP is returning products', async () => {
    Date.now = jest.fn(() => 1604599397648)
    const result = await additionalMatching(parameters)
    expect(result).toBe(true);
  })

  it('Should return true when userClass is not EIP', async () => {
    // We return true to let UserAttributesCollection match with its default logic
    Date.now = jest.fn(() => 1604599397648)
    const newParameters = { ...parameters };
    newParameters.userClass = 'default'

    const result = await additionalMatching(newParameters)
    expect(result).toBe(true);
  })

  it('Should return false when response has no products', async () => {
    Date.now = jest.fn(() => 1604599397648)

    fetch.mockClear()

    global.fetch = jest.fn(async () => ({
      json: () => ({
        products: [],
        selectedCategory: {
          visibility: {
            startDate: '2020-11-04T09:00:00Z',
            endDate: '2020-11-06T05:59:59Z',
          },
        },
      })
    }))

    const result = await additionalMatching(parameters)
    expect(result).toBe(false);
  })

  it('Should return false when date is outside visibility range', async () => {
    Date.now = jest.fn(() => 1604642400000)

    const result = await additionalMatching(parameters)
    expect(result).toBe(false);
  })

  it('Should return true when response has no visibility date range', async () => {
    Date.now = jest.fn(() => 1604599397648)

    fetch.mockClear()

    global.fetch = jest.fn(async () => ({
      json: () => ({
        recordSetTotal: 31,
      })
    }))

    const result = await additionalMatching(parameters)
    expect(result).toBe(true);
  })

  it('Should return false when response is an error', async () => {
    Date.now = jest.fn(() => 1604599397648)

    fetch.mockClear()

    global.fetch = jest.fn(async () => {
      throw new Error('Oops!')
    })

    const result = await additionalMatching(parameters)
    expect(result).toBe(false);
  })
})
