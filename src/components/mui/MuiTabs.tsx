import React, { useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, index, value, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

interface MuiTabsProps {
  tabs: Tab[];
}

export default function MuiTabs({ tabs }: MuiTabsProps) {
  const [value, setValue] = useState<number>(0);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1, bgcolor: 'background.paper',
        flexDirection: 'column',
        height: 'auto', width: '100%'
      }}
    >
      <Tabs
        orientation='horizontal'
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="tabs"
        sx={{
          zIndex: 1,
          position: 'sticky',
          top: 'calc(var(--header-height) - 1px)',
          backgroundColor: 'var(--background)',
          borderBottom: 1,
          borderColor: 'divider',
          minWidth: '100%',
          minHeight: 'unset',
          '& .MuiTabs-scroller': {
            height: 'fit-content',
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            sx={{
              alignItems: 'center',
              minHeight: 'unset',
              padding: '1rem',
              color: tab.active ? 'inherit' : 'var(--gray-alpha-400)',
              pointerEvents: tab.active ? 'auto' : 'none',
              '&.Mui-selected': {
                fontWeight: 'bold',
              },
            }}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <TabPanel key={index} index={index} value={value}>
          {tab.panel}
        </TabPanel>
      ))}
    </Box>
  );
}
