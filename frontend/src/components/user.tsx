import * as React from 'react';
import { useContext } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { Link, Menu, MenuItem } from '@mui/material';
import { AuthContext, app } from '../lib/firebase';

const auth = getAuth(app);

export function User() {
    const settings = ['Admin', 'Logout'];
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget); 
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const { user, token, setUser, setToken } = useContext(AuthContext);
    const logout = () => {
        setUser(null);
        setToken(null);
        signOut(auth);
    };
    if (user) {
        return (
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, paddingLeft: '10px' }}>
                    <Avatar alt={user.uid} src={user.photoURL as string} />
                </IconButton>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((setting) => {
                        let handler = () => {};
                        let href = '/';
                        if (setting === 'Logout')
                        {
                            handler = () => {
                                logout();
                                handleCloseUserMenu();
                            };
                            return (
                                <MenuItem component={Link} key={setting} href={href} onClick={handler}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            );
                        }
                        if (setting === 'Admin' && token && token.claims && token.claims.Admin === true) 
                        {
                            href = '/admin';
                            handler = () => {
                                handleCloseUserMenu();
                            }
                            return (
                                <MenuItem component={Link} key={setting} href={href} onClick={handler}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            );
                        }   
                    })}
                </Menu>
          </Box>
        );
    }
    return (
        <Box sx={{ flexGrow: 0 }}>
            <MenuItem component={Link} key={'login'} href={'/login'}>
                <Typography textAlign='left'>Log In</Typography>
            </MenuItem>
        </Box>
    );
};