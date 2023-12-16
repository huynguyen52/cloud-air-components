import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

export interface AppTooltipProps extends TooltipProps {
  size?: 'small' | 'normal';
}

const sizeVariants = {
  normal: {
    typography: 'body2',
    paddingY: 0.75,
    paddingX: 1.5
  },
  small: {
    typography: 'body5',
    paddingY: 0.5,
    paddingX: 1
  },
};

const AppTooltip = styled(({ className, ...props }: AppTooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, size = 'normal' }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.dark,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.dark,
    borderRadius: theme.typography.pxToRem(3),
    padding: `${theme.spacing(sizeVariants[size].paddingY)} ${theme.spacing(sizeVariants[size].paddingX)}`,
    ...theme.typography[sizeVariants[size].typography as Variant]
  },
}));

export default AppTooltip;