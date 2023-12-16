import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { findIndex } from 'lodash';
import AppLoading from './AppLoading';

export enum TimelineDataStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export type TimelineData = {
  id: string | number;
  label: string;
  status: TimelineDataStatus;
}

export interface AppTimelineProps {
  data: TimelineData[];
  loading?: boolean;
}

const AppTimeline = (props: AppTimelineProps) => {
  const { data, loading } = props;
  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Stepper activeStep={findIndex(data, item => item.status === TimelineDataStatus.IN_PROGRESS)} alternativeLabel>
        {loading ? <Box width="100%" height="64px" position="relative">
          <AppLoading />
        </Box> : data.map(item => (
          <Step key={item.id} completed={item.status === TimelineDataStatus.COMPLETED} >
            <StepLabel>{item.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default AppTimeline;