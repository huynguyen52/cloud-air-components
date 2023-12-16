import { SelectionState } from '@devexpress/dx-react-grid';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { setSelectingRows } from '../reducer';
import { compact, get } from 'lodash';

export interface TableSelectStateProps<R> {
  tableId: string;
  data: R[];
  rowId: string;
}

const TableSelectState = <R,>(props: TableSelectStateProps<R>) => {
  const { tableId, data, rowId } = props;
  const selectingRows = useAppSelector(state => state.table.selectingRows[tableId]);
  const dispatch = useAppDispatch();

  const handleSelectionChange = (selection: (string | number)[]) => {
    const rows = compact(selection.map(selected => data.find(item => selected && get(item, rowId) === selected)));
    dispatch(setSelectingRows({ id: tableId, rows }));
  };

  return (<SelectionState
    selection={selectingRows?.map(item => get(item, rowId)) || []}
    onSelectionChange={handleSelectionChange}
  />);
};

export default TableSelectState;