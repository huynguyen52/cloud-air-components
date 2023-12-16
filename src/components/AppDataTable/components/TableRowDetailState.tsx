import { RowDetailState } from '@devexpress/dx-react-grid';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { setExpandingRows } from '../reducer';

export interface TableRowDetailStateProps {
  tableId: string;
}

const TableRowDetailState = (props: TableRowDetailStateProps) => {
  const { tableId } = props;
  const dispatch = useAppDispatch();
  const expandingRows = useAppSelector(state => state.table.expandingRows[tableId]);

  const onExpandedRowIdsChange = (expandedRowIds: Array<number | string>) => {
    dispatch(setExpandingRows({ id: tableId, rowIds: expandedRowIds }));
  };

  return(
    <RowDetailState
      expandedRowIds={expandingRows}
      onExpandedRowIdsChange={onExpandedRowIdsChange}
    />);
};

export default TableRowDetailState;