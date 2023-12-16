import { Sorting, SortingState } from '@devexpress/dx-react-grid';
import { useMemo } from 'react';
import { AppDataTableColumn } from '..';
import { useAppDispatch } from 'src/store/hooks';
import { setFilters } from '../reducer';
import { SearchRequest } from 'src/types/Request';

export interface TableSortingProps {
  columns: AppDataTableColumn[];
  filter: SearchRequest;
  tableId: string;
}

const TableSorting = (props: TableSortingProps) => {
  const { filter, columns, tableId } = props;
  const dispatch = useAppDispatch();
  const sortingStateColumnExtensions = useMemo(() => columns
    .map(column => ({ columnName: column.name, sortingEnabled: column.sortable || false }))
  , [ columns ]);

  const sorting: Sorting[] | undefined = useMemo(() => {
    if (filter.sortColumn) {
      return [ {
        columnName: filter.sortColumn,
        direction: filter?.sortOrder?.toLocaleLowerCase() || 'asc'
      } as Sorting ];
    }
  }, [ filter ]);

  const onSortingChanged = (currentSorting: Sorting[]) => {
    dispatch(setFilters({ id: tableId, filter: {
      ...filter,
      sortColumn: currentSorting[0].columnName,
      sortOrder: currentSorting[0].direction.toLocaleUpperCase()
    } }));
  };

  return (
    <SortingState
      columnExtensions={sortingStateColumnExtensions}
      sorting={sorting}
      onSortingChange={onSortingChanged}
    />);
};

export default TableSorting;