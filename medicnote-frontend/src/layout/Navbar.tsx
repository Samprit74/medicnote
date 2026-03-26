import { Search, Bell, MessageSquare } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg bg-blue-600 text-white">
          <MessageSquare className="w-5 h-5" />
        </button>

        <button className="p-2 rounded-lg bg-blue-600 text-white">
          <Bell className="w-5 h-5" />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;