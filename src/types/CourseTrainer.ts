import { User } from './User';

export interface CourseTrainer {
  id: number;
  user: User;
  isPrimary: boolean;
}
