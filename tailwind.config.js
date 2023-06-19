module.exports = {
    theme: {
        darkSelector: '.dark',
    },
    variants: {
        backgroundColor: [
            'dark',
            'dark-hover',
            'dark-group-hover',
            'dark-even',
            'dark-odd',
            'hover',
            'responsive',
            'group-hover'
        ],
        borderColor: [
            'dark',
            'dark-focus',
            'dark-focus-within',
            'hover',
            'responsive',
            'group-hover'
        ],
        extend: {
            backgroundColor: ["checked"],
            borderColor: ["checked"],
            inset: ["checked"],
            zIndex: ["hover", "active","group-hover"],
          },
        textColor: ['dark', 'dark-hover', 'dark-active', 'hover', 'responsive','group-hover']
    },
    plugins: [require('tailwindcss-dark-mode')(),{ src: '~/plugins/persistedState.client.js' },{ src: '~/plugins/notfirst.js' }]
  }