import MasterData from './MasterData';

type Task = {
  id: number;
  code: string;
  name: string;
  isTransition: boolean;
  selected: boolean;
  outputType: { [key: string]: string };
  config: { [key: string]: unknown };
  isSystemJob: boolean;
  roles: MasterData[];
}

export default Task;