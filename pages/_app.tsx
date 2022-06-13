import "../public/css/styles.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { StrictMode } from "react";
import { StyleProvider, ThemePicker } from "vcc-ui";

type AppPropsWithLayout = AppProps & {
  Component: NextPage;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <StrictMode>
      <Head>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>

      <StyleProvider>
        <ThemePicker variant="light">
          <Component {...pageProps} />
        </ThemePicker>
      </StyleProvider>
    </StrictMode>
  );
};

export default App;
