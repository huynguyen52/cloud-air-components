import { AppTextField } from 'src/components/AppTextField';
import { InlineEditorProps } from '.';
import { useTranslation } from 'react-i18next';

const TextFieldInlineEditor = ({ value, onValueChange, errors, column }: InlineEditorProps) => {
  const { t } = useTranslation();
  return <AppTextField
    defaultValue={value}
    name={column.name}
    setFieldValue={(_, val) => onValueChange(val)}
    size="small"
    placeholder={t('inlineEditor.placeholder', { columnName: column.title?.toLowerCase() })}
    error={errors && !!errors[column.name]}
    helperText={errors && errors[column.name]}
  />;
};

export default TextFieldInlineEditor;