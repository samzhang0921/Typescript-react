export const getImgUrlFromProduct = (p, type, imageSphere = {}) => {
  const productShotIndex = {
    in: 0,
    outfit: 2
  }

  let imageTemplate

  if (p.productColours) {
    const productVariant = p.productColours[0]
    if (!productVariant.imageTemplate) return undefined
    imageTemplate = productVariant.imageTemplate.replace(
      '{view}',
      productVariant.imageViews[productShotIndex[type]] || productVariant.imageViews[productShotIndex.in]
    )
  } else {
    imageTemplate = p.thumbnailUrlTemplate.replace('{view}', p.imageViews[productShotIndex.in])
  }

  const templateIsImageSphere = imageTemplate.indexOf('/w{width}.jpg') !== -1
  const width = templateIsImageSphere ? `300${imageSphere.extraWidth || ''}` : 'l'

  return imageTemplate.replace('{width}', width)
}
