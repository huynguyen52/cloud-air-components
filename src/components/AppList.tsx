import { Box, Collapse, List, ListItem, ListItemButton, ListItemText, Paper, useTheme } from '@mui/material';
import { get, sortBy, toLower } from 'lodash';
import AppSearchField from './AppSearchField';
import { useTranslation } from 'react-i18next';
import { ReactNode, useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export interface AppListProps<T> {
  searchable?: boolean;
  items: T[];
  optionId: string;
  optionLabel: string;
  id: string;
  label: string;
  onItemClick?: (item: T) => void;
  height?: number | string;
  onSearchChange?: (value: string) => void;
  renderItemText?: (item: T, items: T[]) => ReactNode;
  renderCollapse?: (item: T) => ReactNode;
  collapses?: (string | number)[];
  handleCollapse?: (id: string | number) => void;
  elevation?: number;
  size?: 'small' | 'normal';
  sortByField?: string;
}

const AppList = <T,>(props: AppListProps<T>) => {
  const {
    searchable, optionId, optionLabel, onItemClick,
    id, items, height = '100%', label, onSearchChange,
    renderItemText, renderCollapse, collapses, handleCollapse,
    elevation, size = 'normal', sortByField = optionId
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const [ localSearch, setLocalSearch ] = useState('');
  const padding = size === 'normal' ? 1 : 0.5;

  const filterSelected = (items: T[]) => items.filter(item =>
    toLower(get(item, optionLabel)).includes(toLower(localSearch)));

  return (<Box height={height}>
    {searchable && <AppSearchField
      id="selected-search"
      label={t('common.searchFor', {
        name: label.toLowerCase()
      })}
      onSubmit={value => {
        setLocalSearch(value);
        onSearchChange && onSearchChange(value);
      }}
      sx={{ mb: 1 }}
    />}
    <Paper elevation={elevation} sx={{ height: searchable ? 'calc(100% - 48px)' : '100%', overflow: 'auto' }}>
      <List id={id} dense component="div" role="list" disablePadding>
        {sortBy(filterSelected(items), sortByField).map((item: T) => {
          const labelId = `list-item-${label}-${get(item, optionId)}`;
          const itemText = <ListItemText
            id={labelId}
            sx={{ px: 2, py: (onItemClick || renderCollapse) ? 0: padding }}
            primary={renderItemText ? renderItemText(item, items) : get(item, optionLabel)}
          />;
          const isExpandCollapse = renderCollapse ? collapses?.includes(get(item, optionId)) : false;
          let itemContent = onItemClick ?
            <ListItemButton sx={{ px: 0, py: padding }}>{itemText}</ListItemButton> : itemText;
          if (renderCollapse) {
            itemContent = <ListItemButton sx={{ p: 0, bgcolor: theme.palette.background.gray }}>
              {itemText}
              <Box
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCollapse && handleCollapse(get(item, optionId));
                }}
                sx={{ px: 1, py: padding / 2 }}
              >
                {isExpandCollapse ? <ExpandLess /> : <ExpandMore />}
              </Box>
            </ListItemButton>;
          }
          return (<>
            <ListItem
              disablePadding
              key={get(item, optionId)}
              role="listitem"
              onClick={() => onItemClick && onItemClick(item)}
              sx={{
                cursor: onItemClick ? 'pointer' : 'inherit'
              }}
            >
              {itemContent}
            </ListItem>
            {renderCollapse && <Collapse in={isExpandCollapse} timeout="auto" unmountOnExit>
              {renderCollapse(item)}
            </Collapse>}
          </>
          );
        })}
      </List>
    </Paper>
  </Box>);
};

export default AppList;