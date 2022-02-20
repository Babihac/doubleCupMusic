import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import 'reset-css'
import { SWRConfig } from 'swr'
import { StoreProvider } from 'easy-peasy'
import PlayerLayout from '../components/PlayerLayout'
import { store } from '../lib/store'
/*global RequestInit*/
const theme = extendTheme({
  colors: {
    gray: {
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  components: {
    Button: {
      variants: {
        link: {
          outline: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
})

export const baseUrl = 'http://localhost:3000/api'
export const fetcher = (url: string, init?: RequestInit): Promise<void> =>
  fetch(baseUrl + url, init).then((r) => r.json())

const MyApp = ({ Component, pageProps }) => {
  return (
    <SWRConfig value={{ fetcher }}>
      <ChakraProvider theme={theme}>
        <StoreProvider store={store}>
          {Component.authPage ? (
            <Component {...pageProps} />
          ) : (
            <PlayerLayout>
              <Component {...pageProps} />
            </PlayerLayout>
          )}
        </StoreProvider>
      </ChakraProvider>
    </SWRConfig>
  )
}

export default MyApp
