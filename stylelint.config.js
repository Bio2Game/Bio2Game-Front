module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  plugins: ['stylelint-order'],
  rules: {
    'color-hex-length': 'long',
    'block-no-empty': [
      true,
      {
        severity: 'warning',
      },
    ],
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-order': [
      'position',
      'z-index',
      'top',
      'right',
      'display',
      'flex-direction',
      'justify-content',
      'align-items',
      'flex-wrap',
      'overflow',
      'box-sizing',
      'width',
      'height',
      'padding',
      'border',
      'margin',
      'background',
      'color',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'cursor',
    ],
  },
}
