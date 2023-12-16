import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { IconButton } from '@mui/material';
import { TableColumn } from '@devexpress/dx-react-grid';
import { TableEditColumn } from '@devexpress/dx-react-grid-material-ui';
import { Children, ComponentType, ReactNode, cloneElement } from 'react';
import { Getters } from '@devexpress/dx-react-core';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { NEW_ROW_ID } from '..';
import { useAppSelector } from 'src/store/hooks';
import { FormikValues } from 'formik';

export interface TableInlineEditProps {
  tableId: string;
  enableEdit?: boolean;
  enableAdd?: boolean;
  enableDelete?: boolean;
  onInlineEditConfirm?: (action: CommandAction) => Promise<[isConfirm: boolean, values: FormikValues | undefined]> | undefined;
}

interface CommandButtonProps {
  onExecute: () => void;
  disabled: boolean;
}

interface CommandProps extends TableEditColumn.CommandProps {
  disabled: boolean;
}

export const alignEditColumnRight = (getters: Getters) => {
  const tableColumns = getters['tableColumns'] as TableColumn[];
  const editColum = tableColumns.find(item => item.type === TableEditColumn.COLUMN_TYPE);
  const customs = [
    ...tableColumns.filter(c => c.type !== TableEditColumn.COLUMN_TYPE),
    { ...editColum }
  ];
  return customs;
};

export type CommandAction = 'add' | 'edit' | 'delete' | 'commit' | 'cancel';

interface EditColumnCellProps extends TableEditColumn.CellProps {
  children?: ReactNode;
  tableId: string;
}
const EditColumnCell = ({ children, tableId, ...props }: EditColumnCellProps) => {
  const errors = useAppSelector(state => state.table.editingErrors[tableId]);
  const disabled = errors && !isEmpty(errors[props.tableRow.rowId || NEW_ROW_ID])
    && Object.values(errors[props.tableRow.rowId || NEW_ROW_ID]).filter(item => item).length;
  return <TableEditColumn.Cell {...props}>
    {Children.map(children, child => (
      (child as JSX.Element)?.props.id === 'commit'
        ? cloneElement(child as JSX.Element,
          { disabled })
        : child
    ))}
  </TableEditColumn.Cell>;
};

const TableInlineEdit = (props: TableInlineEditProps) => {
  const {
    enableAdd, enableDelete, enableEdit, tableId,
    onInlineEditConfirm
  } = props;
  const { t } = useTranslation();

  const AddButton = ({ onExecute }: CommandButtonProps) => (
    <IconButton onClick={onExecute} title={t('inlineEditor.addRow')}>
      <AddBoxOutlinedIcon color="success" fontSize="small" />
    </IconButton>
  );

  const EditButton = ({ onExecute }: CommandButtonProps) => (
    <IconButton size="small" onClick={onExecute} title={t('inlineEditor.editRow')}>
      <EditIcon color="primary" fontSize="small" />
    </IconButton>
  );

  const DeleteButton = ({ onExecute }: CommandButtonProps) => (
    <IconButton onClick={onExecute} title={t('inlineEditor.deleteRow')}>
      <DeleteIcon color="error" fontSize="small" />
    </IconButton>
  );

  const CommitButton = ({ disabled, onExecute }: CommandButtonProps) => <IconButton
    disabled={disabled}
    onClick={onExecute}
    title={t('inlineEditor.saveChanges')}
  >
    <SaveIcon color={disabled ? 'disabled' : 'success'} fontSize="small" />
  </IconButton>;

  const CancelButton = ({ onExecute }: CommandButtonProps) => (
    <IconButton onClick={onExecute} title={t('inlineEditor.cancelChanges')}>
      <CancelIcon color="error" fontSize="small" />
    </IconButton>
  );

  const commandComponents = {
    add: AddButton,
    edit: EditButton,
    delete: DeleteButton,
    commit: CommitButton,
    cancel: CancelButton
  };

  const CommandButtons = (({ id, onExecute, disabled }: CommandProps) => {
    const CommandButton = commandComponents[id];
    const execute = async () => {
      if (onInlineEditConfirm && onInlineEditConfirm(id)) {
        const [ isConfirm ] = await onInlineEditConfirm(id) || [ true ];
        if (isConfirm) {
          onExecute();
        }
      } else {
        onExecute();
      }
    };
    return <CommandButton onExecute={execute} disabled={disabled} />;
  }) as ComponentType<TableEditColumn.CommandProps> | undefined;

  return <TableEditColumn
    width={120}
    showEditCommand={enableEdit}
    showAddCommand={enableAdd}
    showDeleteCommand={enableDelete}
    commandComponent={CommandButtons}
    cellComponent={param => (
      <EditColumnCell
        {...param}
        tableId={tableId}
      />
    )}
  />;
};

export default TableInlineEdit;