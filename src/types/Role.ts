import MasterData from './MasterData';
import Permission from './Permission';

type Role = {
  id: number;
  type: MasterData;
  code: string;
  name: string;
  permissions?: Permission[];
}

export default Role;