import { ChangeSet, EditingState } from '@devexpress/dx-react-grid';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { clearAddingRow, clearEditingError, clearEditingErrorsExcludeNewRow, setAddingRow, setEditingChanges, setEditingError, setEditingErrors } from '../reducer';
import * as yup from 'yup';
import { AppDataTableColumn, NEW_ROW_ID } from '..';
import { debounce } from 'lodash';
import { DEFAULT_INPUT_DEBOUNCE } from 'src/constants/common';

export interface TableInlineEditStateProps {
  columns: AppDataTableColumn[];
  handleCommitChanges: (changes: ChangeSet) => void;
  tableId: string;
  editValidator?: yup.ObjectSchema<yup.Maybe<yup.AnyObject>>;
  addValidator?: yup.ObjectSchema<yup.Maybe<yup.AnyObject>>;
}

const TableInlineEditState = (props: TableInlineEditStateProps) => {
  const dispatch = useAppDispatch();
  const {
    handleCommitChanges, tableId, addValidator, editValidator, columns
  } = props;
  const addingRow = useAppSelector(state => state.table.addingRow[tableId]);
  const editingChanges = useAppSelector(state => state.table.editingChanges[tableId]);

  const validateRow = async (keys: string[], row: {[key: string]: unknown}, validator: yup.ObjectSchema<yup.Maybe<yup.AnyObject>>) =>
    Promise.all(keys.map(key =>
      validator.validateAt(key, row)
        .then(() => ({ key, error: undefined }))
        .catch(error => ({ key, error: error.message }))))
      .then(errors => errors.reduce((acc, current) => {
        acc[current.key] = current.error;
        return acc;
      }, {} as {[key: string]: unknown}));

  const handleAddedRowsChanges = debounce((addedRows: {[key:string]: unknown}[]) => {
    if (addedRows.length) {
      dispatch(setAddingRow({ id: tableId, row: addedRows[0] }));
      if (addValidator) {
        const validateKeys = columns.filter(item => item.addable).map(item => item.name);
        validateRow(validateKeys, addedRows[0], addValidator).then(error => {
          dispatch(setEditingError({ id: tableId, rowId: NEW_ROW_ID, error }));
        });
      }
    } else {
      dispatch(clearEditingError({ id: tableId, rowId: NEW_ROW_ID }));
      dispatch(clearAddingRow(tableId));
    }
  }, DEFAULT_INPUT_DEBOUNCE);

  const handleEditedRowsChanges = debounce((rowChanges: {[key: string]: {[key: string]: unknown}}) => {
    dispatch(setEditingChanges({ id: tableId, changes: rowChanges }));
    if (editValidator) {
      dispatch(clearEditingErrorsExcludeNewRow(tableId));
      const validateKeys = columns.filter(item => item.editable).map(item => item.name);
      Promise.all(Object.values(rowChanges).map(row =>
        validateRow(validateKeys, row, editValidator)))
        .then((validatedResults: {[key: string]: unknown}[]) => Object.keys(rowChanges).reduce((acc, current, currentIndex) => {
          acc[current] = validatedResults[currentIndex];
          return acc;
        }, {} as {[key: string]: {[key: string]: unknown}}))
        .then(result => {
          dispatch(setEditingErrors({ id: tableId, errors: result }));
        });
    }
  }, DEFAULT_INPUT_DEBOUNCE);

  const handleCommit = (changes: ChangeSet) => {
    if (changes.added && changes.added.length > 0) {
      dispatch(clearEditingError({ id: tableId, rowId: NEW_ROW_ID }));
      dispatch(clearAddingRow(tableId));
    }
    handleCommitChanges(changes);
  };

  return <EditingState
    rowChanges={editingChanges}
    onCommitChanges={handleCommit}
    addedRows={addingRow ? [ addingRow ] : []}
    onAddedRowsChange={handleAddedRowsChanges}
    onRowChangesChange={handleEditedRowsChanges}
  />;
};

export default TableInlineEditState;