import { createTheme } from '@material-ui/core'

export const formLabelsTheme = createTheme({
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: '#db3131',
        '&$error': {
          color: '#db3131'
        }
      }
    }
  }
})
