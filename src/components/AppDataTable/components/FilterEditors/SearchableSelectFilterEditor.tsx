import { SelectFilterEditorProps } from '.';
import AppSearchableSelect from 'src/components/AppSearchableSelect';

const SearchableSelectFilterEditor = <T,>(props: SelectFilterEditorProps<T>) => {
  const {
    id, name, title, values, setFieldValue,
    optionId, optionLabel, options, lazyOptions,
    optionsDependencies
  } = props;

  return ( <AppSearchableSelect<T>
    id={id}
    name={name}
    label={title}
    options={options}
    lazyOptions={lazyOptions}
    optionId={optionId}
    optionLabel={optionLabel}
    setFieldValue={setFieldValue}
    defaultValue={values[name] as T[]}
    size="small"
    optionsDependencies={optionsDependencies}
  />);
};

export default SearchableSelectFilterEditor;