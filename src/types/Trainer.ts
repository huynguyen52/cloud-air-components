import MasterData from './MasterData';
import { User } from './User';

type Trainer = {
  id: string;
  user: User;
  rate: number;
  highestDegree: MasterData;
  highestDegreeDescription: string;
  type: MasterData;
}

export default Trainer;