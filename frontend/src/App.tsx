import React, { useContext, useEffect } from 'react';
import { useState, createContext } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ResponsiveAppBar from './components/navbar';
import { SignIn } from './pages/accounts/SignIn';
import { Register } from './pages/accounts/Register';
import { Reset } from './pages/accounts/Reset';
import { DKP } from './pages/eq/dkp';
import { ThemeProvider } from '@emotion/react';
import { createTheme, PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AdminDashboard } from './pages/admin/admin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserManagement } from './pages/admin/user.management';
import { AuthContext, auth } from './lib/firebase';
import { User, IdTokenResult } from 'firebase/auth';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { LinkProps } from '@mui/material/Link';
import { defaultPage } from './pages';
import { Expansions } from './pages/eq/expansions';
import { ExpansionManagement } from './pages/admin/expansion.management';

function Router(props: { children?: React.ReactNode }) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/">{children}</StaticRouter>;
  }
  return <MemoryRouter>{children}</MemoryRouter>;
}

export function App() {
  const [mode, setMode] = useState<PaletteMode>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<IdTokenResult | null>(null);
  const handleModeChange = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }
  const LinkBehavior = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
  >((props, ref) => {
    const { href, ...other } = props;
    // Map href (MUI) -> to (react-router)
    return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
  });

  const theme = React.useMemo(() => createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as LinkProps,
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        },
      },
    },
    palette: {
      mode: mode
    }
  }), [mode]);
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user);
      user?.getIdTokenResult().then((result) => {
        setToken(result);
      });
    });
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Grid container spacing={2} maxWidth={'m'}>
      <AuthContext.Provider value={{ user, token, setUser, setToken }}>
        <Router>
          <ResponsiveAppBar mode={mode} handleModeChange={handleModeChange}/>
          <Routes>
            <Route path='/' Component={defaultPage}/>
            <Route path='/dkpAndAttendance' Component={DKP}/>
            <Route path='/keysAndSpells' Component={Expansions}/>
            <Route path='/login' Component={SignIn}/>
            <Route path='/register' Component={Register}/>
            <Route path='/reset' Component={Reset}/>
            <Route path='/admin' element={
              <ProtectedRoute user={user as User} token={token as IdTokenResult} claim='Admin'>
                <AdminDashboard/>
              </ProtectedRoute>
            }/>
            <Route path='/admin/users' element={
              <ProtectedRoute user={user as User} token={token as IdTokenResult} claim='SuperAdmin'>
                <UserManagement/>
              </ProtectedRoute>
            }/>
            <Route path='/admin/expansions' element={
              <ProtectedRoute user={user as User} token={token as IdTokenResult} claim='SuperAdmin'>
                <ExpansionManagement/>
              </ProtectedRoute>
            }/>
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </Grid>
    </ThemeProvider>
  );
}
