import React from 'react'
import { string, bool, object } from 'prop-types'
import { createComponent } from '@ycos/fela'
import { getBounceAnimationStyles, getFadeAnimationStyles } from './Animations'

const Arrow = (props) => (
  <SVG {...props} xmlns="http://www.w3.org/2000/svg" width="10" height="20">
    <g fill="none" fillRule="evenodd">
      <path d="M-7-2v24h24V-2z" />
      <path fill="#000" fillRule="nonzero" d="M9.28 19.266l.53-.531L1.075 10 9.81 1.265l-.53-.53L.015 10z" />
    </g>
  </SVG>
)

const SVG = createComponent(
  'SVG',
  ({ theme, runBounceAnimation }) => ({
    boxSizing: 'content-box',
    display: 'inline-block',
    color: theme.typography.colors.PrimaryBlack,
    ...getBounceAnimationStyles(runBounceAnimation, theme.motionSpecs)
  }),
  'svg',
  ['xmlns', 'width', 'height', 'viewBox']
)

const getAnimationStyles = (runButtonAnimationFade, disabled, motionSpecs) => {
  return runButtonAnimationFade
    ? getFadeAnimationStyles(disabled, motionSpecs)
    : {
      transition: 'opacity 300ms cubic-bezier(0.3, 0.0, 0.3, 1.0)',
      '@media (hover: hover)': {
        ':hover': {
          opacity: 1
        }
      },
      '@media (hover: none)': {
        ':active': {
          opacity: 1
        }
      }
    }
}

const NavigationButton = (props) => {
  return (
    <ArrowButton
      type="button"
      {...props}
      data-automation={props.dataAutomation}
      disabled={props.disabled}
      additionalStyles={props.additionalStyles}
      runButtonAnimationFade={props.runButtonAnimationFade}
    >
      <Arrow runBounceAnimation={props.runBounceAnimation} />
    </ArrowButton>
  )
}

const ArrowButton = createComponent(
  'NavigationButton',
  ({ disabled, additionalStyles, theme, runButtonAnimationFade }) => ({
    display: 'flex',
    outline: 'none',
    margin: 0,
    border: 0,
    borderRadius: 0,
    width: '48px',
    height: '48px',
    padding: '0',
    background: 'rgba(255, 255, 255)',
    opacity: disabled ? 0.0 : 0.8,
    pointerEvents: 'auto',
    cursor: disabled ? 'default' : 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.ease}`,
    ...additionalStyles,
    ...getAnimationStyles(runButtonAnimationFade, disabled, theme.motionSpecs)
  }),
  'button',
  ['type']
)

NavigationButton.propTypes = {
  dataAutomation: string,
  disabled: bool,
  additionalStyles: object
}

NavigationButton.defaultProps = {
  dataAutomation: 'carousel-next-button',
  disabled: false,
  additionalStyles: {}
}

export default NavigationButton
