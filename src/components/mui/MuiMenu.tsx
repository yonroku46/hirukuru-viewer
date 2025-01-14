import * as React from 'react';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

interface MuiMenuProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
}

export default function MuiMenu({ anchorEl, setAnchorEl }: MuiMenuProps) {
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper sx={{ width: 320 }}>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <SupportAgentOutlinedIcon />
          </ListItemIcon>
          お問い合わせ
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PermContactCalendarOutlinedIcon />
          </ListItemIcon>
          店舗ガイド
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <ShareOutlinedIcon />
          </ListItemIcon>
          シェア
        </MenuItem>
      </Menu>
    </Paper>
  );
}
