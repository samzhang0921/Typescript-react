const getDelays = (itemsPerSlide, index, direction) => {
  const animationIndex = index % itemsPerSlide
  const baseDelays = [0, 50, 100, 150]
  const pidsDelays = direction === 'next' ? baseDelays : baseDelays.reverse()

  return pidsDelays[animationIndex]
}

export default getDelays
