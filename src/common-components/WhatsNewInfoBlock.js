import React from 'react'
import { number, string, bool, object, func } from 'prop-types'
import { withTheme, createComponent } from '@ycos/fela'
import { createFontStyle, Paragraph } from '@ycos/primitives'
import ShopLatestButton from './ShopLatestButton'
import { changeLocaleFormat } from '../utils/changeLocaleFormat'

const BlockPreTitle = ({ theme, opacity, children }) => {
  const Component = createFontStyle(
    'BlockPreTitle',
    {
      type: theme.custom.whatsnew.preTitle.paragraphType,
      tagName: theme.custom.whatsnew.preTitle.paragraphTagName,
      name: theme.custom.whatsnew.preTitle.paragraphName
    },
    ({ theme }) => ({
      textTransform: 'uppercase',
      marginTop: 0,
      marginBottom: `${0.5 * theme.spacingMultiplier}px`,
      paddingTop: `${5 * theme.spacingMultiplier}px`,
      opacity,
      transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.easeOut}`,
      letterSpacing: theme.custom.whatsnew.preTitle.letterSpacing,
      color: theme.custom.whatsnew.preTitle.color,
      textAlign: theme.custom.whatsnew.preTitle.textAlign,
      fontSize: theme.custom.whatsnew.preTitle.fontSize,
      'screen-medium': {
        paddingTop: 0,
        fontSize: theme.custom.whatsnew.preTitle.fontSizeMedium,
        textAlign: theme.custom.whatsnew.preTitle.textAlignMedium
      },
      'screen-large': {
        fontSize: theme.custom.whatsnew.preTitle.fontSizeLarge
      },
      'screen-xlarge': {
        fontSize: theme.custom.whatsnew.preTitle.fontSizeXlarge
      }
    })
  )
  return <Component>{children}</Component>
}

const BlockTitle = ({ theme, opacity, children }) => {
  const Component = createFontStyle(
    'BlockTitle',
    {
      type: theme.custom.whatsnew.title.paragraphType,
      tagName: theme.custom.whatsnew.title.paragraphTagName,
      name: theme.custom.whatsnew.title.paragraphName
    },
    ({ theme }) => ({
      color: theme.custom.whatsnew.title.color,
      marginTop: theme.custom.whatsnew.title.marginTopMultiplier * theme.spacingMultiplier,
      fontSize: theme.custom.whatsnew.title.fontSize,
      lineHeight: theme.custom.whatsnew.title.lineHeight,
      marginBottom: theme.custom.whatsnew.title.marginBottomMultiplier * theme.spacingMultiplier,
      textAlign: theme.custom.whatsnew.title.textAlign,
      opacity,
      transition: `opacity ${theme.motionSpecs.motionDurations.t3}ms ${theme.motionSpecs.motionGraphs.easeOut}`,
      'screen-medium': {
        fontSize: theme.custom.whatsnew.title.fontSizeMedium,
        textAlign: theme.custom.whatsnew.title.textAlignMedium,
        marginTop: theme.custom.whatsnew.title.marginTopMultiplierMedium * theme.spacingMultiplier,
        marginBottom: theme.custom.whatsnew.title.marginBottomMultiplierMedium * theme.spacingMultiplier
      },
      'screen-large': {
        fontSize: theme.custom.whatsnew.title.fontSizeLarge,
        marginTop: theme.custom.whatsnew.title.marginTopMultiplierLarge * theme.spacingMultiplier,
        marginBottom: theme.custom.whatsnew.title.marginBottomMultiplierLarge * theme.spacingMultiplier
      },
      'screen-xlarge': {
        fontSize: theme.custom.whatsnew.title.fontSizeXLarge,
        marginTop: theme.custom.whatsnew.title.marginTopMultiplierXLarge * theme.spacingMultiplier,
        marginBottom: theme.custom.whatsnew.title.marginBottomMultiplieXLarge * theme.spacingMultiplier
      }
    })
  )
  return <Component>{children}</Component>
}

const BlockText = createComponent(
  'BlockText',
  ({ theme }) => ({
    width: '100%',
    color: 'black',
    marginTop: 0,
    marginBottom: `${theme.custom.whatsnew.text.marginBottom * theme.spacingMultiplier}px`,
    fontSize: theme.custom.whatsnew.text.fontSize,
    textAlign: theme.custom.whatsnew.text.textAlign,
    'screen-medium': {
      textAlign: theme.custom.whatsnew.text.textAlignMedium,
      fontSize: theme.custom.whatsnew.text.fontSizeMedium
    },
    'screen-large': {
      fontSize: theme.custom.whatsnew.text.fontSizeLarge
    },
    'screen-xlarge': {
      fontSize: theme.custom.whatsnew.text.fontSizeXLarge
    }
  }),
  Paragraph
)

const InfoBlock = createComponent(
  'InfoBlock',
  ({ theme }) => ({
    display: 'block',
    marginLeft: -theme.custom.whatsnew.marginMultipliers.mobileLeft * theme.spacingMultiplier,
    marginRight: -theme.custom.whatsnew.marginMultipliers.mobileRight * theme.spacingMultiplier,
    'screen-medium': {
      marginRight: 0,
      marginLeft: -theme.custom.whatsnew.marginMultipliers.tabletLeft * theme.spacingMultiplier
    },
    'screen-large': {
      marginRight: 0,
      marginLeft: -theme.custom.whatsnew.marginMultipliers.desktopLeft * theme.spacingMultiplier
    }
  }),
  'a'
)

const WhatsNewInfoLayout = ({
  totalProducts,
  subTitlePlain,
  teaserTextPlain,
  teaserTitle,
  buttonHref,
  buttonText,
  showButton,
  locale,
  onTargetClick,
  showBlockPreTitle,
  theme,
  layoutVariant,
  brand
}) => {
  const formattedNumber = changeLocaleFormat(totalProducts, locale)
  const hasReplaceableNumber = (string) => string.indexOf('$number') !== -1

  const titlesByLayout = {
    'isc-whats-new': {
      preTitle: subTitlePlain,
      title: teaserTitle
    },
    'isc-whats-new-personalized': {
      preTitle: teaserTitle,
      title: subTitlePlain
    }
  }[layoutVariant]
  let preTitle = titlesByLayout?.preTitle
  let title = titlesByLayout?.title

  if (formattedNumber !== null) preTitle = preTitle.replace('$number', formattedNumber)
  if (formattedNumber !== null) title = title.replace('$number', formattedNumber)

  const waitForPreTitle = hasReplaceableNumber(preTitle)
  const waitForTitle = hasReplaceableNumber(title)

  return (
    <InfoBlock data-testid="whats-new-info-block" href={buttonHref} onClick={onTargetClick}>
      <BlockPreTitle theme={theme} opacity={showBlockPreTitle && !waitForPreTitle ? 1 : 0}>
        {preTitle}
      </BlockPreTitle>
      <BlockTitle theme={theme} opacity={waitForTitle ? 0 : 1}>
        {title}
      </BlockTitle>
      <BlockText>{teaserTextPlain}</BlockText>
      <ShopLatestButton buttonHref={buttonHref} buttonText={buttonText} showButton={showButton} disabled brand={brand} />
    </InfoBlock>
  )
}

WhatsNewInfoLayout.propTypes = {
  totalProducts: number.isRequired,
  subTitlePlain: string,
  teaserTextPlain: string.isRequired,
  teaserTitle: string.isRequired,
  buttonHref: string.isRequired,
  buttonText: string.isRequired,
  showButton: bool,
  locale: object,
  onTargetClick: func,
  layoutVariant: string,
  brand: string
}

WhatsNewInfoLayout.defaultProps = {
  subTitlePlain: '',
  locale: {
    id: 'en-gb'
  },
  showButton: true,
  onTargetClick: () => {},
  layoutVariant: 'isc-whats-new-personalized',
  brand: 'nap'
}

export default withTheme(WhatsNewInfoLayout)
