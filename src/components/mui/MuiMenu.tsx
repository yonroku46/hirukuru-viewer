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
          sx: {
            pt: "0.25rem",
            pb: "0.25rem",
          },
        }}
        slotProps={{
          paper: {
            style: {
              minWidth: "200px",
              marginTop: "0.25rem",
              border: "1px solid var(--gray-alpha-300)",
              borderRadius: "0.75rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            },
          },
        }}
      >
        {menuList.map((menu, index) => (
          <div key={index}>
            {index !== 0 && <Divider sx={{ margin: '0.25rem 0' }} />}
            {menu.map((item, subIndex) => (
              <MenuItem key={subIndex} onClick={() => handleClick(item.onClick)} sx={{ padding: "0.5rem 1rem" }}>
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
