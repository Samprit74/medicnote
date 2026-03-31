import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  UserCircle,
  LogOut,
  FolderOpen,
  Stethoscope,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DOCTOR_MENU, PATIENT_MENU, APP_NAME } from "@/utils/constants";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  UserCircle,
  FolderOpen,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = user?.role === "doctor" ? DOCTOR_MENU : PATIENT_MENU;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`sidebar-gradient fixed left-0 top-0 z-40 flex h-screen flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <Stethoscope className="h-8 w-8 shrink-0 text-sidebar-fg" />
        {!collapsed && (
          <span className="text-xl font-bold text-sidebar-fg">{APP_NAME}</span>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-md"
      >
        <ChevronLeft
          className={`h-4 w-4 text-foreground transition-transform ${collapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* Nav */}
      <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
        {menu.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-active text-sidebar-fg"
                    : "text-sidebar-fg/70 hover:bg-sidebar-hover hover:text-sidebar-fg"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-fg/70 transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
