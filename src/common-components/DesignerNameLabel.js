import React from 'react'
import { createFontStyle } from '@ycos/primitives'

const DesignerNameLabel = createFontStyle('Label', { type: 'Label', tagName: 'h6', name: '2' }, ({ theme }) => ({
  color: theme.custom.productCard.nameColor,
  textAlign: 'center',
  textTransform: 'uppercase',
  padding: `0 ${theme.spacingMultiplier}px`,
  margin: `${theme.spacingMultiplier}px 0 0`,
  overflow: 'hidden',
  position: 'relative',
  lineHeight: '1.286em',
  maxHeight: '2.571em',
  'screen-medium': {
    marginBottom: 0
  }
}))

export default ({ children }) => {
  return <DesignerNameLabel>{children}</DesignerNameLabel>
}
