import { InputAdornment, SxProps, Theme } from '@mui/material';
import AppTextField from './AppTextField';
import { ReactComponent as SearchIcon } from 'src/assets/icons/icon-search-outline.svg';

const ENTER_KEY = 'Enter';

export interface AppSearchFieldProps {
  onSubmit: (value: string) => void;
  id: string;
  label?: string;
  placeholder?: string;
  size?: 'small' | 'normal';
  sx?: SxProps<Theme>;
}

const AppSearchField = (props: AppSearchFieldProps) => {
  const { onSubmit, sx = {}, id, size = 'small', label, placeholder } = props;

  const handleSubmitOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === ENTER_KEY){
      onSubmit((event.target as HTMLInputElement).value);
    }
  };

  return (<AppTextField
    id={id}
    name={id}
    label={label}
    type="text"
    size={size}
    fullWidth
    placeholder={placeholder}
    InputProps={{
      endAdornment: <InputAdornment position="end" sx={{ mr: 1.5 }}><SearchIcon /></InputAdornment>,
    }}
    setFieldValue={(_, val) => onSubmit(val as string)}
    onKeyDown={handleSubmitOnEnter}
    sx={sx}
  />);
};

export default AppSearchField;