import additionalMatching from "./additionalMatching"

export default ({ item }) => {
  const { layoutVariant, items } = item

  if (layoutVariant === 'isc-user-attributes-collection') {
    item.items = items.map(item => {
      if (item.layoutVariant === 'isc-whats-new') item.additionalMatching = additionalMatching
    })
  }

  return { item }
}
