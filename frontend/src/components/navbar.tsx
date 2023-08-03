import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link, Menu, MenuItem, Switch, PaletteMode } from '@mui/material';
import NightlightIcon from '@mui/icons-material/Nightlight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AdbIcon from '@mui/icons-material/Adb';
import { User } from './user';

const pages = [{ label: 'DKP and Attendance', uri: 'dkpAndAttendance' }, { label: 'Keys and Spells', uri: 'keysAndSpells' }];

interface NavBarProps {
    mode: PaletteMode;
    handleModeChange: () => void
}

function ResponsiveAppBar(props: NavBarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <Box>
                    <Button key={'home'} href={'/'} sx={{ color: 'white', display: 'block' }}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Vets of Norrath
                        </Typography>
                    </Button>
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        {pages.map((page) => (
                        <MenuItem component={Link} key={page.uri} href={`/${page.uri}`} onClick={handleCloseNavMenu}>
                            <Typography textAlign="center">{page.label}</Typography>
                        </MenuItem>
                        ))}
                    </Menu>
                </Box>
                <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                    <Button
                        key={page.uri}
                        onClick={handleCloseNavMenu}
                        href={`/${page.uri}`}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {page.label}
                    </Button>
                    ))}
                </Box>
                <Box>
                    <NightlightIcon color='disabled' sx={{verticalAlign: 'middle'}}/>
                    <Switch checked={props.mode === 'dark' ? false : true} onChange={props.handleModeChange} />
                    <WbSunnyIcon color='warning' sx={{verticalAlign: 'middle'}}/>
                </Box>
                <User/>
            </Toolbar>
        </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;