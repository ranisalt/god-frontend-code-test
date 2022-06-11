import "../public/css/styles.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import React from "react";
import { StyleProvider, ThemePicker } from "vcc-ui";

type AppPropsWithLayout = AppProps & {
  Component: NextPage;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <React.StrictMode>
      <StyleProvider>
        <ThemePicker variant="light">
          <Component {...pageProps} />
        </ThemePicker>
      </StyleProvider>
    </React.StrictMode>
  );
};

export default App;
