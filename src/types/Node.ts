import { NodeLevelCode } from 'src/constants/enums';

export type NodeRequest = {
  level: NodeLevelCode;
}

type Node = {
  id: number;
  code: string;
  name: string;
};

export default Node;