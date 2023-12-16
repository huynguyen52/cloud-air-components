import MasterData from './MasterData';

type AolExam = {
  id: number;
  code: string;
  name: string;
  isActive?: boolean;
};

export interface AoLExamResult {
  aolExam: AolExam;
  result: MasterData;
  score: number;
}
export default AolExam;