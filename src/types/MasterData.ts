type MasterDataConfig = {
  variant?: string;
};

type MasterData = {
  code: string;
  name: string;
  config?: MasterDataConfig;
  parent?: string;
};

export default MasterData;