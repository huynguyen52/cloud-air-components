import MasterData from './MasterData';

type Notification = {
  id: number;
  type: MasterData;
  message: string;
  url: string;
  createdDate: string;
  createdBy: string;
  read: boolean;
}

export default Notification;