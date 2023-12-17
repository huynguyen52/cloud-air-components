import { AppBaseQuery } from 'src/api/appBaseQuery';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { ComponentType, ReactNode, useEffect, useMemo } from 'react';
import { UseLazyQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { QueryDefinition } from '@reduxjs/toolkit/dist/query';
import { reset, setFilters } from './reducer';
import { Box, Paper, Grid, Typography } from '@mui/material';
import { Column, IntegratedPaging, ChangeSet, IntegratedSorting, PagingState, IntegratedSelection } from '@devexpress/dx-react-grid';
import { Grid as TableGrid, TableHeaderRow, TableFixedColumns, Table, TableRowDetail, TableSelection, } from '@devexpress/dx-react-grid-material-ui';
import { DEFAULT_FOOTER_HEIGHT, DEFAULT_HEADER_HEIGHT, DEFAULT_PAGE_SIZE, DEFAULT_TABLE_POLLING_INTERVAL } from 'src/constants/common';
import { AppCircularProgress } from '../AppCircularProgress';
import TableSorting from './components/TableSorting';
import TablePaging from './components/TablePaging';
import TableInlineEdit, { CommandAction, alignEditColumnRight } from './components/TableInlineEdit';
import { Getter } from '@devexpress/dx-react-core';
import TableInlineEditState from './components/TableInlineEditState';
import TableInlineEditCell from './components/TableInlineEditCell';
import * as yup from 'yup';
import { InlineEditorProps } from './components/InlineEditors';
import { compact, get, noop } from 'lodash';
import { FormikValues } from 'formik';
import TableRowDetailState from './components/TableRowDetailState';
import { FilterConfig } from './components/FilterEditors';
import TableCell, { TableCellProps } from './components/TableCell';
import TableSelectState from './components/TableSelectState';
import { SearchRequest } from 'src/types/Request';
import { SearchResponse } from 'src/types/Response';
import TableSearch from './components/TableSearch';
import TableFilter from './components/TableFilter';
import useTableStyles from './styles';

export interface TableData {
  id: number | string;
}

export enum AppDataTableColumnFormat {
  DATE = 'date',
  DATETIME = 'datetime',
}

export interface AppDataTableColumn extends Column {
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  wordWrapEnabled?: boolean;
  editable?: boolean;
  addable?: boolean;
  inlineEditor?: (props: InlineEditorProps) => ReactNode;
  renderCell?: (props: TableCellProps) => ReactNode;
  format?: AppDataTableColumnFormat;
  options?: unknown[];
  optionId?: string;
  optionLabel?: string;
}

export const PADDING_COLUMN = {
  name: '',
  title: '',
} as AppDataTableColumn;

export const NEW_ROW_ID = 'NEW';

export interface AppDataTableProps<R extends TableData> {
  id: string;
  columns: (AppDataTableColumn | false)[];
  defaultFilter?: SearchRequest;
  useSearchQuery?: UseLazyQuery<QueryDefinition<SearchRequest, AppBaseQuery, string, SearchResponse<R>>>;
  data?: R[];
  height?: string | number;
  enableSearch?: boolean;
  fixedLeftColumns?: string[] | symbol[];
  fixedRightColumns?: string[] | symbol[];
  stickyHeader?: boolean;
  enableSorting?: boolean;
  enablePaging?: boolean;
  enableInlineEdit?: boolean;
  enableInlineAdd?: boolean;
  enableInlineDelete?: boolean;
  rowId: string;
  editValidator?: yup.ObjectSchema<yup.Maybe<yup.AnyObject>>;
  addValidator?: yup.ObjectSchema<yup.Maybe<yup.AnyObject>>;
  onInlineEditSubmit?: (changes: ChangeSet) => void;
  onInlineEditConfirm?: (action: CommandAction) => Promise<[isConfirm: boolean, values: FormikValues | undefined]> | undefined;
  rowDetailComponent?: ComponentType<TableRowDetail.ContentProps>;
  enableFilter?: boolean;
  filterConfigs?: FilterConfig[];
  maxFilterGridColumns?: number;
  renderActions?: (selectedRows: R[]) => ReactNode;
  enableSelection?: boolean;
  enableSelectAll?: boolean;
  title?: string;
  searchPlaceholder?: string;
  unwrapPaperContainer?: boolean;
  unmountReset?: boolean;
}

export const AppDataTable = <R extends TableData>(props: AppDataTableProps<R>) => {
  const {
    useSearchQuery = () => ([ noop, { data: [], isLoading: false } ]),
    id, columns, defaultFilter, enableSearch,
    fixedLeftColumns = [], fixedRightColumns = [], stickyHeader,
    enableSorting, enablePaging, enableInlineEdit, enableInlineAdd,
    enableInlineDelete, rowId, editValidator, addValidator, onInlineEditSubmit,
    onInlineEditConfirm, rowDetailComponent, enableFilter, filterConfigs, maxFilterGridColumns = 1,
    renderActions, enableSelection, enableSelectAll, title,
    height = `calc(100vh - ${DEFAULT_HEADER_HEIGHT} - ${DEFAULT_FOOTER_HEIGHT} - 300px)`,
    data, searchPlaceholder, unwrapPaperContainer, unmountReset
  } = props;
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => state.table.filters[id]);
  const selectingRows = useAppSelector(state => state.table.selectingRows[id]);
  const enableInline = enableInlineEdit || enableInlineAdd || enableInlineDelete;
  const tableStyle = useTableStyles(height, stickyHeader);

  const filterColumns = compact(columns);

  const [ triggerSearch, { data: searchResponse, isLoading } ] = useSearchQuery({
    pollingInterval: DEFAULT_TABLE_POLLING_INTERVAL
  });

  const rows = (data ? {
    data,
    page: 0,
    limit: data.length,
    totalRecords: data.length,
  }: searchResponse) as SearchResponse<R>;

  useEffect(() => () => {
    unmountReset && dispatch(reset(id));
  }, []);

  useEffect(() => {
    // Trigger search when filter change
    triggerSearch(filter || defaultFilter);
    if (!filter) {
      // set default filter when filter is not found
      dispatch(setFilters({ id, filter: defaultFilter }));
    }
  }, [ filter ]);

  const tableColumnExtensions: Table.ColumnExtension[] = useMemo(() => filterColumns
    .map(column => ({
      columnName: column.name,
      width: column.width,
      align: column.align,
      wordWrapEnabled: column.wordWrapEnabled || false
    })), [ filterColumns ]);

  const tableView = <Box sx={tableStyle}>
    <Grid container spacing={3} height="100%" marginBottom={3} alignItems="flex-end" >
      {enableSearch && <Grid item xs={4}>
        <TableSearch
          tableId={id}
          filter={filter}
          placeholder={searchPlaceholder}
        />
      </Grid>}
      {enableFilter && <Grid item xs={enableSearch ? 8: 12}>
        <TableFilter
          tableId={id}
          filter={filter || defaultFilter}
          filterConfigs={filterConfigs || []}
          maxFilterGridColumns={maxFilterGridColumns}
        />
      </Grid>}
    </Grid>
    {isLoading ? <Box
      sx={{ width: '100%', height: `calc(${height} + 52px)`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AppCircularProgress sx={{ my: '40vh' }} />
    </Box> :
      <TableGrid
        rows={rows?.data || []}
        columns={filterColumns}
        getRowId={row => get(row, rowId)}
      >
        {/* Paging setup */}
        {enablePaging && <PagingState
          defaultCurrentPage={rows?.page || 0}
          pageSize={rows?.limit || DEFAULT_PAGE_SIZE}
        />}
        {enablePaging && <TablePaging filter={filter || defaultFilter} tableId={id} data={rows} />}
        {enablePaging && <IntegratedPaging />}

        {/* Sorting setup */}
        {enableSorting && <TableSorting columns={filterColumns} filter={filter || defaultFilter} tableId={id} />}
        {enableSorting && <IntegratedSorting />}

        {/* Selection setup */}
        {enableSelection && <TableSelectState<R>
          tableId={id}
          data={rows?.data || []}
          rowId={rowId}
        />}
        {enableSelection && <IntegratedSelection />}

        <Table
          columnExtensions={tableColumnExtensions}
          cellComponent={params => <TableCell
            {...params}
            columnConfigs={filterColumns.reduce((acc, column) => {
              acc[column.name] = column;
              return acc;
            }, {} as {[key: string]: AppDataTableColumn})}
          />}
        />
        <TableHeaderRow showSortingControls={enableSorting} />
        {enableSelection && <TableSelection showSelectAll={enableSelectAll} />}

        {/* Inline edit setup */}
        {enableInline && <TableInlineEditState
          tableId={id}
          handleCommitChanges={onInlineEditSubmit || noop}
          addValidator={addValidator}
          editValidator={editValidator}
          columns={filterColumns}
        />}
        {enableInline && <TableInlineEditCell tableId={id} />}
        {enableInline && <TableInlineEdit
          tableId={id}
          enableAdd={enableInlineAdd}
          enableEdit={enableInlineEdit}
          enableDelete={enableInlineDelete}
          onInlineEditConfirm={onInlineEditConfirm}
        />}
        {enableInline && <Getter name="tableColumns" computed={alignEditColumnRight} />}

        {/* Row detail setup */}
        {rowDetailComponent && <TableRowDetailState tableId={id} />}
        {rowDetailComponent && <TableRowDetail contentComponent={rowDetailComponent} />}

        {/* Fixed column setup */}
        <TableFixedColumns
          leftColumns={fixedLeftColumns}
          rightColumns={fixedRightColumns}
        />
      </TableGrid>
    }
  </Box>;

  return <Box>
    <Grid container spacing={2} paddingBottom={3}>
      {title && <Grid item xs={12} md={title ? 4 : 12}>
        <Typography variant="h6">{title}</Typography>
      </Grid>}
      <Grid item xs={12} md={title ? 8 : 12} textAlign="right">
        {renderActions && renderActions(selectingRows as R[])}
      </Grid>
    </Grid>
    {unwrapPaperContainer ? tableView: <Paper sx={{ p: 2 }}>
      {tableView}
    </Paper>}
  </Box>;
};
