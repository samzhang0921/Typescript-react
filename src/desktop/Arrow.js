import React, { useState, useEffect } from 'react'
import { createComponent, withTheme } from '@ycos/fela'
import { bool, object, func, number } from 'prop-types'
import NavigationButton from './NavigationButton'

const commonStyling = {
  zIndex: 999,
  position: 'absolute',
  top: 'calc(50% - 18px)'
}

const NavigationButtonRight = createComponent(
  'NavigationButtonRight',
  ({ theme, buttonVisibilityState, brandId, productListOnly }) => {
    const isRtl = theme.direction === 'rtl'
    const ltrArrowStyle = {
      right: `${theme.spacingMultiplier * theme.custom.whatsnew.marginMultipliers.arrowRight}px`,
      'screen-xlarge': {
        right: productListOnly ? `${theme.spacingMultiplier * theme.custom.whatsnew.marginMultipliers.arrowRightLarge-3}px`:`${theme.spacingMultiplier * theme.custom.whatsnew.marginMultipliers.arrowRightLarge}px`
      }
    }
    const adjustmentsRtl = brandId === 'mrp' ? (theme.custom.whatsnew.marginMultipliers.rtlArrowLarge) : (theme.custom.whatsnew.marginMultipliers.rtlArrowLarge + 0.5) || 5.5
    const rtlArrowStyle = {
      left: `-${theme.spacingMultiplier * theme.custom.whatsnew.marginMultipliers.rtlArrow}px`,
      'screen-xlarge': {
        left: `-${theme.spacingMultiplier * adjustmentsRtl}px`
      }
    }
    const arrowStyle = isRtl ? rtlArrowStyle : ltrArrowStyle

    return {
      ...commonStyling,
      ...arrowStyle,
      display: !buttonVisibilityState ? 'none' : 'flex'
    }
  },
  NavigationButton,
  ['dataAutomation', 'onClick', 'additionalStyles', 'disabled', 'runBounceAnimation', 'runButtonAnimationFade']
)

export const NextArrow = withTheme((props) => {
  const { onClick, additionalStyles, slideIndex, nextActiveSlide, totalItems, theme, preventClickWhilePidsAnimating, brand, productListOnly } = props
  const { brandId } = brand
  const arrowStyleByBrand = {
    nap: {
      transform: `translate(100%, ${productListOnly ? '-155%' : '-65%'}) scaleX(-1)`
    },
    'nap-rtl': {
      transform: `translate(100%, ${productListOnly ? '-155%' : '-65%'}) scaleX(-1)`
    },
    // This is only for storybook nap-rtl and test purpose
    mrp: {
      transform: `translate(100%, ${productListOnly ? '-205%' : '-100%'}) scaleX(-1)`,
      'screen-xlarge': {
        transform: `translate(100%, ${productListOnly ? '-190%' : '-70%'}) scaleX(-1)`
      }
    },
    ton: {
      transform: `translate(100%, ${productListOnly ? '-190%' : '-100%'}) scaleX(-1)`,
    }
  }[brandId]
  const [runBounceAnimation, setRunBounceAnimation] = useState(undefined)
  const [runButtonAnimationFade, setButtonAnimationFade] = useState(false)
  const [buttonDisabledState, setButtonDisabledState] = useState(false)
  const [buttonVisibilityState, setButtonVisibilityState] = useState(true)
  const disabledButton = nextActiveSlide === totalItems - 4
  const duration = theme.motionSpecs.motionDurations.t2
  const fadeAnimationResetTimer = 860

  useEffect(() => {
    setButtonAnimationFade(disabledButton !== buttonDisabledState)
    setButtonDisabledState(disabledButton)
    const timer = setTimeout(() => {
      setButtonAnimationFade(false)
      if (disabledButton) {
        setButtonVisibilityState(false)
      }
    }, fadeAnimationResetTimer)

    if (!disabledButton) {
      setButtonVisibilityState(true)
    }

    return () => clearTimeout(timer)
  }, [disabledButton])

  return (
    <NavigationButtonRight
      dataAutomation="carousel-right"
      onClick={() => {
        if (!preventClickWhilePidsAnimating) {
          onClick()
          if (slideIndex === nextActiveSlide) {
            setRunBounceAnimation(true)
            setTimeout(() => {
              setRunBounceAnimation(false)
            }, duration)
          }
        }
      }}
      disabled={disabledButton}
      runButtonAnimationFade={runButtonAnimationFade}
      buttonVisibilityState={buttonVisibilityState}
      additionalStyles={{
        ...arrowStyleByBrand,
        ...additionalStyles
      }}
      runBounceAnimation={runBounceAnimation}
      brandId={brandId}
      productListOnly
    />
  )
})

NextArrow.propTypes = {
  onClick: func,
  additionalStyles: object,
  slideIndex: number,
  nextActiveSlide: number,
  totalItems: number,
  theme: object.isRequired,
  preventClickWhilePidsAnimating: bool
}

NextArrow.defaultProps = {
  onClick: () => {},
  additionalStyles: {},
  slideIndex: 0,
  nextActiveSlide: 0,
  totalItems: 12,
  preventClickWhilePidsAnimating: false
}

const NavigationButtonLeft = createComponent(
  'NavigationButtonLeft',
  ({ theme, buttonVisibilityState }) => {
    const isRtl = theme.direction === 'rtl'
    const rtlArrowStyle = {
      right: `-${theme.spacingMultiplier * theme.custom.whatsnew.marginMultipliers.rtlArrow}px`,
      'screen-xlarge': {
        right: `-${theme.spacingMultiplier * theme.custom.whatsnew.marginMultipliers.rtlArrowLarge}px`
      }
    }
    const ltrArrowStyle = {
      left: `${theme.spacingMultiplier * theme.custom.whatsnew.marginMultipliers.arrowLeft}px`,
      'screen-xlarge': {
        left: `${theme.spacingMultiplier * theme.custom.whatsnew.marginMultipliers.arrowLeftLarge}px`
      }
    }
    const arrowStyle = isRtl ? rtlArrowStyle : ltrArrowStyle

    return {
      ...commonStyling,
      ...arrowStyle,
      display: !buttonVisibilityState ? 'none' : 'flex'
    }
  },
  NavigationButton,
  ['dataAutomation', 'onClick', 'additionalStyles', 'disabled', 'runBounceAnimation', 'runButtonAnimationFade']
)

export const PrevArrow = withTheme((props) => {
  const { onClick, additionalStyles, slideIndex, nextActiveSlide, theme, preventClickWhilePidsAnimating, brand, productListOnly } = props
  const { brandId } = brand
  const arrowStyleByBrand = {
    nap: {
      transform: `translate(-100%, ${productListOnly ? '-155%' : '-65%'})`
    },
    'nap-rtl': {
      transform: `translate(-100%, ${productListOnly ? '-155%' : '-65%'})`
    },
    // This is only for storybook nap-rtl and test purpose
    mrp: {
      transform: `translate(-100%, ${productListOnly ? '-205%' : '-100%'})`,
      'screen-xlarge': {
        transform: `translate(-100%, ${productListOnly ? '-190%' : '-70%'})`
      }
    },
    ton: {
      transform: `translate(-100%, ${productListOnly ? '-190%' : '-100%'})`
    }
  }[brandId]

  const [runBounceAnimation, setRunBounceAnimation] = useState(undefined)
  const [runButtonAnimationFade, setButtonAnimationFade] = useState(false)
  const [buttonDisabledState, setButtonDisabledState] = useState(true)
  const [buttonVisibilityState, setButtonVisibilityState] = useState(true)
  const disabledButton = nextActiveSlide === 0
  const duration = theme.motionSpecs.motionDurations.t2
  const fadeAnimationResetTimer = 860
  const defaultStyle = {
    paddingRight: 0
  }

  useEffect(() => {
    setButtonAnimationFade(disabledButton !== buttonDisabledState)
    setButtonDisabledState(disabledButton)
    const timer = setTimeout(() => {
      setButtonAnimationFade(false)
      if (disabledButton) {
        setButtonVisibilityState(false)
      }
    }, fadeAnimationResetTimer)

    if (!disabledButton) {
      setButtonVisibilityState(true)
    }
    return () => clearTimeout(timer)
  }, [disabledButton])

  return (
    <NavigationButtonLeft
      dataAutomation="carousel-left"
      onClick={() => {
        if (!preventClickWhilePidsAnimating) {
          onClick()
          if (slideIndex === nextActiveSlide) {
            setRunBounceAnimation(true)
            setTimeout(() => {
              setRunBounceAnimation(false)
            }, duration)
          }
        }
      }}
      runButtonAnimationFade={runButtonAnimationFade}
      disabled={disabledButton}
      buttonVisibilityState={buttonVisibilityState}
      additionalStyles={{
        ...arrowStyleByBrand,
        ...additionalStyles,
        ...defaultStyle
      }}
      runBounceAnimation={runBounceAnimation}
    />
  )
})

PrevArrow.propTypes = {
  onClick: func,
  additionalStyles: object,
  slideIndex: number,
  nextActiveSlide: number,
  totalItems: number,
  theme: object.isRequired,
  preventClickWhilePidsAnimating: bool,
  brand: object.isRequired
}

PrevArrow.defaultProps = {
  onClick: () => {},
  additionalStyles: {},
  slideIndex: 0,
  nextActiveSlide: 0,
  totalItems: 12,
  preventClickWhilePidsAnimating: false
}
