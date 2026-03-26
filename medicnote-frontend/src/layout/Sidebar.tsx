import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileText,
    Clock,
    UserCircle,
    FolderHeart,
    Menu,
    X,
    LogOut,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    role: "doctor" | "patient";
}

const doctorLinks = [
    { to: "/doctor", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/doctor/patients", icon: Users, label: "Patients" },
    { to: "/doctor/prescriptions", icon: FileText, label: "Prescriptions" },
    { to: "/doctor/queue", icon: Clock, label: "Queue" },
    { to: "/doctor/profile", icon: UserCircle, label: "Profile" },
];

const patientLinks = [
    { to: "/patient", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/patient/prescriptions", icon: FileText, label: "Prescriptions" },
    { to: "/patient/records", icon: FolderHeart, label: "Records" },
    { to: "/patient/profile", icon: UserCircle, label: "Profile" },
];

const Sidebar = ({ role }: SidebarProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const links = role === "doctor" ? doctorLinks : patientLinks;

    const handleLogout = () => {
        setMobileOpen(false);
        navigate("/");
    };

    return (
        <>
            {/* Mobile button */}
            <button
                className="fixed top-4 left-4 z-50 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg lg:hidden transition-colors"
                onClick={() => setMobileOpen(true)}
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-60 h-screen bg-blue-600 text-white flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
                style={{
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                }}
            >
                {/* Close button mobile */}
                <button
                    className="absolute top-4 right-4 lg:hidden hover:bg-white/20 p-1 rounded transition-colors"
                    onClick={() => setMobileOpen(false)}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Logo */}
                <div className="px-6 py-6 text-xl font-bold">MedicNote</div>

                {/* Links */}
                <nav className="flex-1 px-3 space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-white text-blue-600"
                                    : "text-white/80 hover:bg-white/20 hover:text-white"
                                }`
                            }
                            onClick={() => setMobileOpen(false)}
                        >
                            <link.icon className="w-5 h-5" />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-3 pb-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/80 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;