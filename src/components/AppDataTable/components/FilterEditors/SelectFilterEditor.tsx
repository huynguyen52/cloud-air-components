import { AppSelect } from 'src/components/AppSelect';
import { SelectFilterEditorProps } from '.';

const SelectFilterEditor = <T,>(props: SelectFilterEditorProps<T>) => {
  const {
    id, name, title, values, setFieldValue, lazyOptions,
    optionId, optionLabel, options, allowNotChosen, defaultFilter,
    optionsDependencies
  } = props;
  return ( <AppSelect<T>
    id={id}
    name={name}
    title={title}
    defaultValue={values[name] as T}
    label={title}
    setFieldValue={setFieldValue}
    optionId={optionId}
    optionLabel={optionLabel}
    options={options}
    lazyOptions={lazyOptions}
    allowNotChosen={allowNotChosen}
    size="small"
    defaultFilter={defaultFilter}
    optionsDependencies={optionsDependencies}
  />);
};

export default SelectFilterEditor;