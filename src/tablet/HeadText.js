import React from 'react'
import { createComponent, withTheme } from '@ycos/fela'
import { createFontStyle } from '@ycos/primitives'
import { string, bool } from 'prop-types'

const HeadTextBox = createComponent('HeadTextBox', ({ theme }) => ({
  display: 'none',
  'screen-medium': {
    display: 'block',
    width: '100%',
    height: '18px',
    marginTop: `${theme.custom.whatsnew.headText.marginTop * theme.spacingMultiplier}px`,
    marginLeft: `${theme.custom.whatsnew.headText.marginLeft * theme.spacingMultiplier}px`,
    marginBottom: `${2 * theme.spacingMultiplier}px`
  }
}))

const HeadTextStyle = ({ theme, showHeadText, children }) => {
  const Component = createFontStyle(
    'HeadTextStyle',
    {
      type: theme.custom.whatsnew.headText.paragraphType,
      tagName: theme.custom.whatsnew.headText.paragraphTagName,
      name: theme.custom.whatsnew.headText.paragraphName
    },
    () => ({
      textTransform: 'uppercase',
      letterSpacing: theme.custom.whatsnew.headText.letterSpacing,
      fontSize: 14,
      marginBottom: `${0.5 * theme.spacingMultiplier}px`,
      opacity: showHeadText ? 1 : 0,
      transition: 'opacity 0.5s ease',
      color: theme.custom.whatsnew.headText.color
    })
  )
  return <Component>{children}</Component>
}

const HeadText = ({ showHeadText, preTitlePlain, theme }) => {
  return (
    <HeadTextBox>
      <HeadTextStyle theme={theme} showHeadText={showHeadText}>
        {preTitlePlain}
      </HeadTextStyle>
    </HeadTextBox>
  )
}

HeadText.propTypes = {
  showHeadText: bool,
  preTitlePlain: string.isRequired
}

HeadText.defaultProps = {
  showHeadText: false
}

export default withTheme(HeadText)
