# What's New Carousel component

# Tags

# Component specs:

- Type: `YNAPTeaser`
- Layout variant: [`isc-whats-new`, `isc-whats-new-personalized`]

Note: You can customize specif brands by adding a new `layoutVariant` and editing the theme on `packages/utils/themes/src`

# Coremedia

1. Create a YNAPTeaser with one layout variants `isc-whats-new` for NAP or `isc-whats-new-personalized` for other brands
2. Insert the desired fields - teaserTitle, teaserText, ynapParameter, cta
3. Add the required tags under the metadata area of the teaser.
`WhatsnewCarousel.productListOnly`: display product list carousel only
`WhatsnewCarousel.withDetails`: display product details
4. Pull the teaser into the content with an outer collection (isc-single-column-fullbleed)
