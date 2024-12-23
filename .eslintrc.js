// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
  },
};
