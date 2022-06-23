// Button Animations
const ARROW_X_MOVE_DISTANCE = 6

// Bounce
const bounceIn = () => ({
  '0%': { transform: 'translateX(0px)' },
  '100%': { transform: `translateX(-${ARROW_X_MOVE_DISTANCE}px)` }
})

const bounceOut = () => ({
  '0%': { transform: `translateX(-${ARROW_X_MOVE_DISTANCE}px)` },
  '100%': { transform: 'translateX(0px)' }
})

const getBounceInAnimationStyles = (motionSpecs) => ({
  animationName: bounceIn(),
  animationDuration: `${motionSpecs.motionDurations.t3}ms`,
  animationTimingFunction: motionSpecs.motionGraphs.easeOut
})

const getBounceOutAnimationStyles = (motionSpecs) => ({
  animationName: bounceOut(),
  animationDuration: `${motionSpecs.motionDurations.t3}ms`,
  animationTimingFunction: motionSpecs.motionGraphs.easeOut
})

export const getBounceAnimationStyles = (enableAnimation, motionSpecs) => {
  if (typeof enableAnimation === 'undefined') {
    return {}
  }
  return enableAnimation ? getBounceInAnimationStyles(motionSpecs) : getBounceOutAnimationStyles(motionSpecs)
}

// Fade
const fadeIn = () => ({
  '0%': { opacity: 0 },
  '100%': { opacity: 0.8 }
})

const fadeOut = () => ({
  '0%': { opacity: 0.8 },
  '100%': { opacity: 0 }
})

const getFadeInAnimationStyles = (motionSpecs) => ({
  animationName: fadeIn(),
  animationDuration: `${motionSpecs.motionDurations.t3}ms`,
  animationTimingFunction: motionSpecs.motionGraphs.easeOut,
  animationDelay: '225ms',
  animationFillMode: 'both'
})

const getFadeOutAnimationStyles = (motionSpecs) => ({
  animationName: fadeOut(),
  animationDuration: `${motionSpecs.motionDurations.t3}ms`,
  animationTimingFunction: motionSpecs.motionGraphs.easeOut,
  animationDelay: `${motionSpecs.motionDurations.t3}ms`,
  animationFillMode: 'both'
})

export const getFadeAnimationStyles = (enableAnimation, motionSpecs) => {
  return enableAnimation ? getFadeOutAnimationStyles(motionSpecs) : getFadeInAnimationStyles(motionSpecs)
}

// PIDS Animations
const PIDS_X_MOVE_DISTANCE = 80

// since the opacity change only lasts for 200ms and the total animation is 300ms you get 66.66% <=> 200 * 100 / 300
const slideFadeOut = (direction) => ({
  '0%': { transform: 'translate(0px)', opacity: 1 },
  '66.66%': { opacity: 0 },
  '100%': { transform: `translate(${direction === 'next' ? `-${PIDS_X_MOVE_DISTANCE}px` : `${PIDS_X_MOVE_DISTANCE}px`})`, opacity: 0 }
})

// since the opacity change needs a delay of 100ms and the total animation is 300ms you get 33.33% <=> 100 * 100 / 300
const slideFadeIn = (direction) => ({
  '0%': { transform: `translate(${direction === 'next' ? `${PIDS_X_MOVE_DISTANCE}px` : `-${PIDS_X_MOVE_DISTANCE}px`})`, opacity: 0 },
  '33.33%': { opacity: 0 },
  '100%': { transform: 'translate(0px)', opacity: 1 }
})

export const getSlideAnimation = (slideFadeAnimationEntering, pidDelay, direction, shouldAnimate, motionSpecs) => {
  if (typeof slideFadeAnimationEntering === 'undefined') {
    return {}
  }

  return {
    animationName: slideFadeAnimationEntering ? slideFadeIn(direction) : slideFadeOut(direction),
    animationDuration: `${motionSpecs.motionDurations.t3}ms`,
    animationTimingFunction: motionSpecs.motionGraphs.ease,
    animationDelay: `${pidDelay}ms`,
    animationFillMode: 'both',
    animationPlayState: shouldAnimate ? 'running' : 'paused'
  }
}
