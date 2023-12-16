import { InlineEditorProps } from '.';
import { useTranslation } from 'react-i18next';
import AppSelect from 'src/components/AppSelect';

const SelectInlineEditor = ({ value, onValueChange, errors, column }: InlineEditorProps) => {
  const { t } = useTranslation();
  return <AppSelect
    defaultValue={value}
    id={`select-inline-editor-${column.name}`}
    name={column.name}
    setFieldValue={(_, val) => onValueChange(val)}
    options={column.options}
    optionId={column.optionId || ''}
    optionLabel={column.optionLabel || ''}
    size="small"
    placeholder={t('inlineEditor.selectPlaceholder', { columnName: column.title?.toLowerCase() })}
    error={errors && !!errors[column.name]}
    helperText={errors && errors[column.name]}
  />;
};

export default SelectInlineEditor;