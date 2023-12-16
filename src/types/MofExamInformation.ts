import MasterData from './MasterData';
import Location from './Location';

type MofExamInformation = {
  id: number;
  code: string;
  type: MasterData;
  category: MasterData;
  startTime: string;
  proctorName: string;
  proctorPhone: string;
  location: Location;
}

export default MofExamInformation;