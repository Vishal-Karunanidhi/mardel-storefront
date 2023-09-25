import { createTheme } from '@mui/material/styles';

/*TODO: Configure the theming in combination with the Global Vars*/
export const appTheme = createTheme({
  palette: {},
  typography: {
    allVariants: {
      fontFamily:
        'MuseoSans300, "Museo Sans", -apple-system-body, -apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif',
      fontWeight: '300'
    },
    fontWeightLight: '300',
    fontWeightMedium: '300',
    fontWeightRegular: '300',
    fontWeightBold: '300'
  },
  // spacing: [2],
  // breakpoints: {
  //   values: {}
  // },
  transitions: {
    duration: {},
    easing: {}
  },
  components: {}
});

export default appTheme;
