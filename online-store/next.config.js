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
  async rewrites() {
    return [
      {
        // keep this route for localhost
        source: "/hosts/:path*",
        destination: "/hosts/:path*",
      },
      {
        // https://github.com/vercel/next.js/discussions/12848#discussioncomment-680225
        has: [
          {
            type: "host",
            value: "(?<host>.*)",
          },
        ],
        source: "/:path*",
        destination: "/hosts/:host/:path*",
      },
    ];
  },
};
