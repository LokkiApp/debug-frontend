import React from "react";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import { AppProviders } from "context";
import { Hydrate } from "react-query/hydration";
import { Global, css } from "@emotion/react";
import { config } from "@fortawesome/fontawesome-svg-core";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "component/error-fallback";

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  // TODO: remove type override
  // see https://github.com/vercel/next.js/issues/40372
  const { dehydratedState } = pageProps as { dehydratedState: unknown };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProviders>
        <Hydrate state={dehydratedState}>
          <Global
            styles={css`
              html {
                background: rgb(248, 250, 253);
              }

              *,
              *::before,
              *::after {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: Rubik, sans-serif;
              }
            `}
          />
          <Component {...pageProps} />
        </Hydrate>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default appWithTranslation(MyApp);
