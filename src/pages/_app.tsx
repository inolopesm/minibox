import type { AppProps } from "next/app";
import "../styles/globals.css";
import NextHead from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </NextHead>
      <Component {...pageProps} />
    </>
  );
}
