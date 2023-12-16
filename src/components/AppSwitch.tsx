import { FormControlLabel, Switch, SwitchProps } from '@mui/material';
import { omit } from 'lodash';

export interface AppSwitchProps extends Omit<SwitchProps, 'defaultValue' | 'onChange'> {
  id: string;
  name: string;
  label: string;
  defaultValue: boolean;
  setFieldValue: (field: string, value: unknown) => void;
}

const AppSwitch = (props: AppSwitchProps) => {
  const { label, defaultValue, setFieldValue, sx, name } = props;
  return (<FormControlLabel
    control={<Switch
      {...omit(props, 'defaultValue', 'label', 'sx', 'setFieldValue')}
      onChange={(_, checked) => setFieldValue(name, checked)}
      defaultChecked={defaultValue}
    />}
    label={label}
    sx={sx}
  />);
};

export default AppSwitch;