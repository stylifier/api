module.exports = {
  "extends": "google",
  "env": {
    "node": true,
    "mocha": true
  },
  "rules": {
    "semi": [2, "never"],
    "comma-dangle": [0],
    "no-var": [2],
    "quotes": [2, "single"],
    "strict": ["error", "global"]
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "script"
  }
};
