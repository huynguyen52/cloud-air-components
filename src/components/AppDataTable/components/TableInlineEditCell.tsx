import { Table, TableEditRow } from '@devexpress/dx-react-grid-material-ui';
import { AppDataTableColumn, NEW_ROW_ID, PADDING_COLUMN } from '..';
import { useAppSelector } from 'src/store/hooks';
import { Box } from '@mui/material';

interface InlineEditCellProps extends TableEditRow.CellProps {
  column: AppDataTableColumn;
  tableId: string;
}

const InlineEditCell = (props: InlineEditCellProps) => {
  const { column, tableRow, tableId } = props;
  const errors = useAppSelector(state => state.table.editingErrors[tableId]);

  if (column.name === PADDING_COLUMN.name) {
    return <Table.Cell {...props} value="" />;
  }
  if (tableRow?.rowId && !column.editable) {
    return <Table.Cell {...props} />;
  }
  if (!tableRow?.rowId && !column.addable) {
    return <Table.Cell {...props} />;
  }
  if (column.inlineEditor) {
    return <Table.Cell {...props}
      value={<Box sx={{
        py: 0.5,
        '& .MuiFormHelperText-root': {
          position: 'absolute',
          bottom: -18
        }
      }}>
        {column.inlineEditor({
          ...props,
          column,
          errors: errors ? errors[tableRow.rowId || NEW_ROW_ID] : undefined
        })}
      </Box>}
    />;
  }
  return <TableEditRow.Cell {...props} />;
};

export interface TableInlineEditCellProps {
  tableId: string;
}

const TableInlineEditCell = ({ tableId }: TableInlineEditCellProps) =>
  <TableEditRow cellComponent={params => <InlineEditCell {...params} tableId={tableId} />} />;

export default TableInlineEditCell;
