// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   AppBar, 
//   Toolbar, 
//   Typography, 
//   Button, 
//   IconButton, 
//   Menu, 
//   MenuItem, 
//   Avatar, 
//   Badge,
//   Box,
//   Divider,
//   styled
// } from '@mui/material';
// import {
//   Notifications as NotificationsIcon,
//   ExitToApp as ExitToAppIcon,
//   Home as HomeIcon,
//   Work as ProjectsIcon,
//   Person as ProfileIcon,
//   VolunteerActivism as LogoIcon
// } from '@mui/icons-material';
// import { deepPurple } from '@mui/material/colors';

// const StyledAppBar = styled(AppBar)(({ theme }) => ({
//   background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
//   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//   padding: theme.spacing(0, 2)
// }));

// const LogoText = styled(Typography)({
//   fontWeight: 700,
//   letterSpacing: 1.2,
//   display: 'flex',
//   alignItems: 'center'
// });

// const NavButton = styled(Button)(({ theme }) => ({
//   margin: theme.spacing(0, 1),
//   color: 'white',
//   fontWeight: 500,
//   '&:hover': {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)'
//   }
// }));

// const Header = () => {
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const username = localStorage.getItem('username');
//   const open = Boolean(anchorEl);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('username');
//     localStorage.removeItem('userId');
//     handleMenuClose();
//     navigate('/login');
//   };

//   return (
//     <StyledAppBar position="sticky">
//       <Toolbar sx={{ justifyContent: 'space-between' }}>
//         {/* Logo y sección izquierda */}
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <LogoIcon sx={{ fontSize: 32, mr: 1 }} />
//           <LogoText variant="h6" component={Link} to="/plataforma" sx={{ textDecoration: 'none', color: 'white' }}>
//             VOLUNTEERHUB
//           </LogoText>
          
//           {/* Navegación principal */}
//           <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
//             <NavButton 
//               startIcon={<HomeIcon />} 
//               component={Link} 
//               to="/plataforma"
//             >
//               Inicio
//             </NavButton>
//             <NavButton 
//               startIcon={<ProjectsIcon />} 
//               component={Link} 
//               to="/lista-proyectos"
//             >
//               Proyectos
//             </NavButton>
//           </Box>
//         </Box>

//         {/* Sección derecha */}
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           {/* Notificaciones */}
//           <IconButton 
//             color="inherit" 
//             component={Link} 
//             to="/Notification"
//             sx={{ mr: 1 }}
//           >
//             <Badge badgeContent={3} color="error">
//               <NotificationsIcon />
//             </Badge>
//           </IconButton>

//           {/* Menú de usuario */}
//           <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
//             <Avatar 
//               alt={username || 'Usuario'} 
//               src="/static/images/avatar/1.jpg" 
//               sx={{ 
//                 bgcolor: deepPurple[500],
//                 width: 40,
//                 height: 40
//               }}
//             >
//               {username ? username.charAt(0).toUpperCase() : 'U'}
//             </Avatar>
//           </IconButton>

//           <Menu
//             anchorEl={anchorEl}
//             open={open}
//             onClose={handleMenuClose}
//             PaperProps={{
//               elevation: 0,
//               sx: {
//                 overflow: 'visible',
//                 filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
//                 mt: 1.5,
//                 '& .MuiAvatar-root': {
//                   width: 32,
//                   height: 32,
//                   ml: -0.5,
//                   mr: 1,
//                 },
//                 '&:before': {
//                   content: '""',
//                   display: 'block',
//                   position: 'absolute',
//                   top: 0,
//                   right: 14,
//                   width: 10,
//                   height: 10,
//                   bgcolor: 'background.paper',
//                   transform: 'translateY(-50%) rotate(45deg)',
//                   zIndex: 0,
//                 },
//               },
//             }}
//             transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//             anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//           >
//             <MenuItem 
//               component={Link} 
//               to="/perfil" 
//               onClick={handleMenuClose}
//             >
//               <Avatar sx={{ mr: 1 }} /> Mi Perfil
//             </MenuItem>
//             <Divider />
//             <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
//               <ExitToAppIcon sx={{ mr: 1 }} /> Cerrar Sesión
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Toolbar>
//     </StyledAppBar>
//   );
// };

// export default Header;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Badge,
  Box,
  Divider,
  styled,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  ExitToApp as ExitToAppIcon,
  Home as HomeIcon,
  Work as ProjectsIcon,
  Person as ProfileIcon,
  VolunteerActivism as LogoIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { deepPurple } from '@mui/material/colors';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(0, 2)
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: 1.2,
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    letterSpacing: 0.8,
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: 'white',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const username = localStorage.getItem('username');
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    handleMenuClose();
    navigate('/login');
  };

  return (
    <StyledAppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo y sección izquierda */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton 
              color="inherit" 
              onClick={toggleMobileMenu}
              edge="start"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <LogoIcon sx={{ fontSize: isExtraSmall ? 24 : 32, mr: 0.5 }} />
          <LogoText variant="h6" component={Link} to="/plataforma" sx={{ textDecoration: 'none', color: 'white' }}>
            {isExtraSmall ? "VH" : "VOLUNTEERHUB"}
          </LogoText>
          
          {/* Navegación principal en desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            <NavButton 
              startIcon={<HomeIcon />} 
              component={Link} 
              to="/plataforma"
            >
              Inicio
            </NavButton>
            <NavButton 
              startIcon={<ProjectsIcon />} 
              component={Link} 
              to="/lista-proyectos"
            >
              Proyectos
            </NavButton>
          </Box>
        </Box>

        {/* Sección derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Notificaciones */}
          <IconButton 
            color="inherit" 
            component={Link} 
            to="/Notification"
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Menú de usuario */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar 
              alt={username || 'Usuario'} 
              src="/static/images/avatar/1.jpg" 
              sx={{ 
                bgcolor: deepPurple[500],
                width: isExtraSmall ? 32 : 40,
                height: isExtraSmall ? 32 : 40
              }}
            >
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              component={Link} 
              to="/perfil" 
              onClick={handleMenuClose}
            >
              <Avatar sx={{ mr: 1 }} /> Mi Perfil
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ExitToAppIcon sx={{ mr: 1 }} /> Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      
      {/* Menú móvil lateral */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleMobileMenu}
        >
          <List>
            <ListItem button component={Link} to="/plataforma">
              <ListItemIcon>
                <HomeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem button component={Link} to="/lista-proyectos">
              <ListItemIcon>
                <ProjectsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Proyectos" />
            </ListItem>
            <ListItem button component={Link} to="/perfil">
              <ListItemIcon>
                <ProfileIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Mi Perfil" />
            </ListItem>
            <ListItem button component={Link} to="/Notification">
              <ListItemIcon>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon color="primary" />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Notificaciones" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" sx={{ color: 'error.main' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </StyledAppBar>
  );
};

export default Header;