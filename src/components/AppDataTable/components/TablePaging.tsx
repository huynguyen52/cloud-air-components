import { useAppDispatch } from 'src/store/hooks';
import { setFilters } from '../reducer';
import { SearchResponse } from 'src/types/Response';
import { PagingPanel } from '@devexpress/dx-react-grid';
import { InputBase, Pagination, Stack, TablePagination, Typography, styled } from '@mui/material';
import { DEFAULT_INPUT_DEBOUNCE, DEFAULT_PAGE_SIZE } from 'src/constants/common';
import { SearchRequest } from 'src/types/Request';
import { useTranslation } from 'react-i18next';
import { ceil, debounce, parseInt } from 'lodash';

export interface TablePagingProps<R> {
  tableId: string;
  filter: SearchRequest;
  data?: SearchResponse<R>;
}

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '.MuiButtonBase-root': {
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    backgroundColor: theme.palette.background.gray,
    borderRadius: theme.typography.pxToRem(4),
    margin: `0 ${theme.spacing(0.75)}`,
    ...theme.typography.body2,
    '&.Mui-selected': {
      backgroundColor: theme.palette.background.dark,
      color: theme.palette.text.contrast
    },
    '&.MuiPaginationItem-previousNext': {
      backgroundColor: theme.palette.background.paper,
      borderRadius: '50%',
    }
  },
}));

const PageInput = styled(InputBase)(({ theme }) => ({
  position: 'relative',
  border: `1px solid ${theme.palette.background.gray}`,
  borderRadius: theme.typography.pxToRem(4),
  backgroundColor: theme.palette.background.paper,
  padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
  ...theme.typography.body2,
  input: {
    width: theme.typography.pxToRem(24),
  }
}));

const TablePaging = <R,>(props: TablePagingProps<R>) => {
  const { tableId, filter, data } = props;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rowsPerPage = data?.limit || DEFAULT_PAGE_SIZE;
  const currentPage = data?.page || 0;
  const totalPage = ceil((data?.totalRecords || 0) / rowsPerPage);

  const handleChangePage = (page: number) => {
    dispatch(setFilters({ id: tableId, filter: {
      ...filter,
      page,
    } }));
  };

  return <PagingPanel
    containerComponent={() => <TablePagination
      component={() => <Stack
        direction="row"
        mt={3}
        px={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center">
          <Typography variant="body4" paddingRight={1}>{t('common.go')}</Typography>
          <PageInput
            defaultValue={currentPage + 1}
            onChange={debounce(event => handleChangePage((parseInt(event.target.value) || 0) - 1), DEFAULT_INPUT_DEBOUNCE)}
            sx={{ mr: 1.5 }}
          />
          <Typography variant="body4" paddingRight={1}>
            {t('common.pageOf', {
              current: currentPage + 1,
              total: totalPage
            })}
          </Typography>
        </Stack>
        <StyledPagination
          count={totalPage}
          page={currentPage + 1}
          onChange={(_, page) => handleChangePage(page - 1)}
        />
      </Stack>}
      count={totalPage}
      page={currentPage}
      onPageChange={(_, page) => handleChangePage(page)}
      rowsPerPage={rowsPerPage}
    />}
  />;
};

export default TablePaging;