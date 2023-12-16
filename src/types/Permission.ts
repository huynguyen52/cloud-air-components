import { TableData } from 'src/components/AppDataTable';
import { PermissionAction } from 'src/constants/permissions';

interface Permission extends TableData {
  id: number;
  code: string;
  name: string;
  action: PermissionAction;
  resource: string;
}

export default Permission;