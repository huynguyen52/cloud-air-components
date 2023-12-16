import { Box, Grid } from '@mui/material';
import { useAppDispatch } from 'src/store/hooks';
import { emptyArraysAsUndefined, useAppFormik } from 'src/utils/formikUtils';
import { setFilters } from '../reducer';
import { FilterConfig, FilterData } from './FilterEditors';
import { SearchRequest } from 'src/types/Request';
import { isEmpty } from 'lodash';

export interface TableFilterProps {
  filter: SearchRequest;
  tableId: string;
  filterConfigs: FilterConfig[];
  maxFilterGridColumns: number;
}

const TableFilter = (props: TableFilterProps) => {
  const { filter , tableId, filterConfigs } = props;
  const dispatch = useAppDispatch();
  const data = filter?.filter;

  const handleSubmitFilter = (values: FilterData) => {
    const submitData = emptyArraysAsUndefined(values);
    dispatch(setFilters({ id: tableId, filter: {
      ...filter,
      filter: !isEmpty(submitData) ? submitData : undefined
    } }));
  };

  const formik = useAppFormik({
    initialValues: data || {},
    onSubmit: handleSubmitFilter,
  });

  const handleChangeFilter = (field: string, value: unknown) => {
    formik.submitForm();
    return formik.setFieldValue(field, value);
  };

  return<Box component="form" onSubmit={formik.handleSubmit}>
    <Grid container spacing={3}>
      {filterConfigs && filterConfigs.map(({ editor: Editor, optionsDependencies, ...rest }) =>
        <Grid key={rest.id} item xs={12} md={12 / filterConfigs.length}>
          <Editor
            {...rest}
            values={formik.values}
            optionsDependencies={optionsDependencies ? optionsDependencies(formik.values) : undefined}
            setFieldValue={handleChangeFilter}
          />
        </Grid>)}
    </Grid>
  </Box>;
};

export default TableFilter;