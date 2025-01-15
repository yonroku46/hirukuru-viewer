import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

interface MuiMenuProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
  menuList: { icon: React.ReactNode, text: string, onClick: () => void }[][];
}

export default function MuiMenu({ anchorEl, setAnchorEl, menuList }: MuiMenuProps) {
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (onClick: () => void) => {
    onClick();
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
        {menuList.map((menu, index) => (
          <div key={index}>
            {index !== 0 && <Divider sx={{ margin: '8px 0' }} />}
            {menu.map((item, subIndex) => (
              <MenuItem key={subIndex} onClick={() => handleClick(item.onClick)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                {item.text}
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </Paper>
  );
}
