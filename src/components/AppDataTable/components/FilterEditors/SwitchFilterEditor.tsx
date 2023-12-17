import { FilterEditorProps } from '.';
import { AppSwitch } from 'src/components/AppSwitch';

const SwitchFilterEditor = (props: FilterEditorProps) => {
  const {
    id, name, title, values, setFieldValue
  } = props;
  return ( <AppSwitch
    id={id}
    name={name}
    defaultValue={values[name] as boolean}
    label={title}
    setFieldValue={setFieldValue}
  />);
};

export default SwitchFilterEditor;