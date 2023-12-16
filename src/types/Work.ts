import Module from './Module';
import Task from './Task';

type Work = {
  id: number;
  name: string;
  statusName: string;
  isActive: string;
  module: Module;
  tasks: Task[];
  config: { [key: string]: unknown };
}

export default Work;