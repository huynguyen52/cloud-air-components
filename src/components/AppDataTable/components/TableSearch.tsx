import { useAppDispatch } from 'src/store/hooks';
import { setFilters } from '../reducer';
import { SearchRequest } from 'src/types/Request';
import { AppSearchField } from 'src/components/AppSearchField';

export interface TableSearchProps {
  tableId: string;
  filter: SearchRequest;
  placeholder?: string;
}

const TableSearch = (props: TableSearchProps) => {
  const { filter, tableId, placeholder } = props;
  const dispatch = useAppDispatch();

  const submitSearch = (value: string) => {
    dispatch(setFilters({
      id: tableId, filter: {
        ...filter,
        searchInput: value,
        page: 0
      }
    }));
  };

  return (
    <AppSearchField
      id="table-search"
      size="small"
      placeholder={placeholder}
      onSubmit={submitSearch}
    />);
};

export default TableSearch;