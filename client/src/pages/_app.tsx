import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import "quill/dist/quill.snow.css";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
