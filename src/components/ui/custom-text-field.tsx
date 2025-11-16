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
    },
    '&:hover fieldset': {
      borderColor: '#DBDBDB', // gray color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#DBDBDB', // black color when focused/clicked
    },
  },
  '& .MuiInputLabel-root': {
    color: 'black',
  },
}))

export interface CustomTextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined'
}

export function CustomTextFieldComponent(props: CustomTextFieldProps) {
  return <CustomTextField {...props} variant="outlined" />
}

