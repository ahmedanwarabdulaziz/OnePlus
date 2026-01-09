"use client";

import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ThemeProvider from "@/components/ThemeProvider";

const drawerWidth = 240;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { adminUser, logout } = useAuth();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };



  // ...

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, href: "/admin" },
    { text: "Users", icon: <PeopleIcon />, href: "/admin/users" },
    { text: "Staff", icon: <GroupsIcon />, href: "/admin/staff" },
    { text: "Courses", icon: <LibraryBooksIcon />, href: "/admin/courses" },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname === item.href}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ProtectedRoute>
      <ThemeProvider includeCssBaseline={true}>
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "white" }}>
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                One Plus Admin
              </Typography>
              {adminUser && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#701621", width: 32, height: 32 }}>
                    {adminUser.displayName?.[0] || adminUser.email[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                    {adminUser.displayName || adminUser.email}
                  </Typography>
                  <Button
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ display: { xs: "none", sm: "flex" } }}
                  >
                    Logout
                  </Button>
                  <IconButton
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ display: { xs: "block", sm: "none" } }}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Box>
              )}
            </Toolbar>
          </AppBar>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              bgcolor: "white",
              minHeight: "100vh",
            }}
          >
            <Toolbar />
            {children}
          </Box>
        </Box>
      </ThemeProvider>
    </ProtectedRoute>
  );
}
