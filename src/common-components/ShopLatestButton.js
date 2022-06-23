import React from 'react'
import CallToAction from '@ycos/component-cta'
import { createComponent } from '@ycos/fela'
import { string, bool, func } from 'prop-types'

const Wrapper = createComponent('Wrapper', ({ theme, showButton, opacity }) => ({
  display: showButton ? 'flex' : 'none',
  justifyContent: 'center',
  opacity,
  transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.easeOut}`,

  'screen-medium': {
    justifyContent: 'flex-start',
    opacity: 1,
    transition: 'none'
  }
}))

const CtaWrapper = createComponent('CtaWrapper', () => ({
  width: '240px'
}))

const ShopLatestButton = ({ buttonHref, buttonText, showButton, onTargetClick, opacity = 1, brand }) => {
  const item = {
    layoutVariant: 'isc-cta-primary',
    href: buttonHref,
    teaserTitle: buttonText
  }
  return (
    <Wrapper opacity={opacity} showButton={showButton}>
      <CtaWrapper>
        <CallToAction item={item} onTargetClick={onTargetClick} brand={brand} />
      </CtaWrapper>
    </Wrapper>
  )
}

ShopLatestButton.propTypes = {
  buttonHref: string.isRequired,
  buttonText: string.isRequired,
  showButton: bool,
  onTargetClick: func,
  brand: string
}

ShopLatestButton.defaultProps = {
  showButton: false,
  onTargetClick: () => {},
  brand: 'nap'
}

export default ShopLatestButton
