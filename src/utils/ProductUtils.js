export const getProductsListParameters = (str = '') => {
  try {
    const productsList = JSON.parse(str)
    return { ...productsList, key: str }
  } catch (e) {
    return { key: str }
  }
}

export function getProductApiHeaders({ wcs }) {
  const wcsUrlConfig = typeof window === 'undefined' ? wcs.internal : wcs.external

  return wcsUrlConfig.clientId ? { 'X-IBM-Client-Id': wcsUrlConfig.clientId } : {}
}
