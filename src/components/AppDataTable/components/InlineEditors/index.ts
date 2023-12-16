import { TableEditRow } from '@devexpress/dx-react-grid-material-ui';
import TextFieldInlineEditor from './TextFieldInlineEditor';
import { AppDataTableColumn } from '../..';

export interface InlineEditorProps extends TableEditRow.CellProps {
  errors: {[key: string]: string | undefined} | undefined;
  column: AppDataTableColumn;
}

export {
  TextFieldInlineEditor
};