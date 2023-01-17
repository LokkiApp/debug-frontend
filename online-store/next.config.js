// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  eslint: {
    // code is already linted during CI
    ignoreDuringBuilds: true,
  },
  compiler: {
    emotion: true,
  },
};
