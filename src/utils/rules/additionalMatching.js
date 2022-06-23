import { USER_CATEGORY } from '@ycos/constants'

const FETCH_ERROR_MESSAGE = 'Cannot fetch products from API'

export default ({ userClass, component, locale, brand, config }) => {
  const EIPComponents = ['isc-whats-new'];

  if (userClass !== USER_CATEGORY.EIP || !EIPComponents.includes(component?.props.item.layoutVariant)) {
    // This condition only affects items inside EIPComponents array
    return true
  }

  return isEipPreviewReturningProducts(component, locale, brand, config)
}

const isEipPreviewReturningProducts = (component, locale, brand, config) => {
  const params = getProductsListParameters(component.props.item.ynapParameter)
  const { wcs } = config

  const url = getProductApiUrl({ params, locale, wcs, brand })

  return fetch(url, {
    headers: getProductApiHeaders(config),
  })
    .then(res => res.json())
    .then(res => {
      const { recordSetTotal, selectedCategory } = res
      return checkVisibility(selectedCategory?.visibility) && recordSetTotal > 30
    })
    .catch(() => {
      // eslint-disable-next-line no-console
      console.log(FETCH_ERROR_MESSAGE);
      return false
    })
}

const checkVisibility = (visibility = {}) => {
  // If the visibility state its not provided we assume that the list will live forever
  if (Object.keys(visibility).length === 0) {
    return true
  }
  const { startDate, endDate } = visibility
  const parsedStartDate = new Date(startDate)
  const parsedEndDate = new Date(endDate)
  const now = Date.now()
  return now >= parsedStartDate.getTime() && now <= parsedEndDate.getTime()
}

const getProductsListParameters = (str = '') => {
  try {
    const productsList = JSON.parse(str)
    return { ...productsList, key: str }
  } catch (e) {
    return { key: str }
  }
}

const getProductApiUrl = ({ params, showMorePageNumber, locale, wcs, brand }) => {
  const brandSite = brand.site === 'nap' ? `nap_${locale.country}` : `mrp_${locale.country}`
  const { seoUrl, sort, productsPerPage, offset } = params
  const localeKey = locale ? locale.locale : 'en_GB'
  const wcsUrlConfig = typeof window === 'undefined' ? wcs.internal : wcs.external
  const baseUrl = `${wcsUrlConfig.baseUrl}${wcs.productsByCategoryPath}`
  const pageNumber = showMorePageNumber || parseInt(offset) || 1
  let path = baseUrl
    .replace('{{brandSite}}', brandSite)
    .replace('{{seoUrl}}', seoUrl)
    .replace('{{pageSize}}', productsPerPage || 4)
    .replace('{{pageNumber}}', pageNumber)
    .replace('{{locale}}', localeKey)

  if (baseUrl.indexOf('/polyjuice') < 0) {
    path = path.replace('/designers', '/designer')
  }
  if (sort) {
    return `${path}&orderBy=${sort}`
  }
  return path
}

function getProductApiHeaders({ wcs }) {
  const wcsUrlConfig = typeof window === 'undefined' ? wcs.internal : wcs.external
  return wcsUrlConfig.clientId ? { 'X-IBM-Client-Id': wcsUrlConfig.clientId } : {}
}
