import MasterData from './MasterData';

type Location = {
  id: number;
  type: MasterData;
  address: string;
  ward: MasterData;
  district: MasterData;
  province: MasterData;
}

export default Location;