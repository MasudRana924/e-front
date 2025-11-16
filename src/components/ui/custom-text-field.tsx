import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'

const CustomTextField = styled(TextField)(() => ({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px', // MUI default is 4px, so 12px is larger
    height: '56px',
    '& fieldset': {
      borderColor: '#DBDBDB', // gray color for initial state
      borderWidth: '1px', // Decreased border width
    },
    '&:hover fieldset': {
      borderColor: '#DBDBDB', // gray color on hover
      borderWidth: '1px', // Decreased border width
    },
    '&.Mui-focused fieldset': {
      borderColor: '#DBDBDB', // black color when focused/clicked
      borderWidth: '1px', // Decreased border width
    },
    '& input': {
      color: 'inherit',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'black !important',
    '&.Mui-focused': {
      color: 'black !important',
    },
    '&.Mui-error': {
      color: 'black !important',
    },
  },
  '@media (prefers-color-scheme: dark)': {
    '& .MuiInputLabel-root': {
      color: 'white !important',
      '&.Mui-focused': {
        color: 'white !important',
      },
      '&.Mui-error': {
        color: 'white !important',
      },
    },
    '& .MuiOutlinedInput-root': {
      '& input': {
        color: 'white !important',
      },
    },
  },
  '.dark & .MuiInputLabel-root': {
    color: 'white !important',
    '&.Mui-focused': {
      color: 'white !important',
    },
    '&.Mui-error': {
      color: 'white !important',
    },
  },
  '.dark & .MuiOutlinedInput-root': {
    '& input': {
      color: 'white !important',
    },
  },
}))

export interface CustomTextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined'
}

export function CustomTextFieldComponent(props: CustomTextFieldProps) {
  return <CustomTextField {...props} variant="outlined" />
}

