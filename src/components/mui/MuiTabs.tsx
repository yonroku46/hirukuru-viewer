import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useMediaQuery } from 'react-responsive';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  isSp: boolean;
}

function TabPanel({ children, value, index, isSp, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: '100%', marginLeft: isSp ? '0' : '1rem', marginTop: isSp ? '0.5rem' : '0' }}
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
  const isSp = useMediaQuery({ query: '(max-width: 1179px)' });
  const [value, setValue] = useState<number>(0);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1, bgcolor: 'background.paper',
        flexDirection: isSp ? 'column' : 'row',
        border: isSp ? "0" : "1px solid var(--gray-alpha-300)",
        padding: isSp ? "0" : "1rem",
        borderRadius: isSp ? "0" : "0.5rem",
        height: 'auto', width: '100%'
      }}
    >
      <Tabs
        orientation={isSp ? 'horizontal' : 'vertical'}
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="tabs"
        sx={{
          borderRight: isSp ? 0 : 1,
          borderColor: 'divider',
          minWidth: isSp ? '100%' : '150px',
          '& .MuiTabs-scroller': {
            height: 'fit-content',
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            sx={{ alignItems: isSp ? 'center' : 'flex-start', minHeight: 'unset' }}
            label={tab.label}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <TabPanel value={value} index={index} isSp={isSp}>
          {tab.panel}
        </TabPanel>
      ))}
    </Box>
  );
}
