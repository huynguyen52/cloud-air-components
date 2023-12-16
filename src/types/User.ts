import Module from './Module';
import Permission from './Permission';
import Role from './Role';
import Node from './Node';
import Location from './Location';
import MasterData from './MasterData';

export type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles?: Role[];
  trainerId?: number;
  isActive?: boolean;
  nodes: Node[];
  gender?: MasterData;
  location?: Location;
  createdUser: User;
  modifiedUser: User;
}

export interface UserDetails extends User {
  permissions: Permission[];
  modules: Module[];
}
