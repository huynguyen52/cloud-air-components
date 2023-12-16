import { Table } from '@devexpress/dx-react-grid-material-ui';
import { AppDataTableColumn, AppDataTableColumnFormat } from '..';
import { get, isObject } from 'lodash';
import { formatISODate, formatISODateTime } from 'src/utils/dateTimeUtils';

export interface TableCellProps extends Table.DataCellProps {
  columnConfigs: {[key: string]: AppDataTableColumn};
}

export const TableCell = (props: TableCellProps) => {
  const { column, columnConfigs, row } = props;
  let cellValue = get(row, column.name);

  if (Object.keys(columnConfigs).includes(column.name)) {
    if (columnConfigs[column.name].options) {
      const { options = [], optionId = '', optionLabel = '' } = columnConfigs[column.name];
      const option = options.find(item => get(item, optionId) === cellValue);
      return <Table.Cell {...props} value={get(option, optionLabel)} />;
    }

    if (columnConfigs[column.name].renderCell) {
      const config = columnConfigs[column.name];
      const value = config.renderCell ? config.renderCell(props) : undefined;
      return <Table.Cell {...props} value={value} />;
    }

    if (columnConfigs[column.name].format === AppDataTableColumnFormat.DATETIME) {
      cellValue = formatISODateTime(cellValue);
    }

    if (columnConfigs[column.name].format === AppDataTableColumnFormat.DATE) {
      cellValue = formatISODate(cellValue);
    }

  }

  return <Table.Cell {...props} value={isObject(cellValue) ? JSON.stringify(cellValue): cellValue} />;
};

export default TableCell;