import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-gray-900">

      <Sidebar role="doctor" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Content
            </h1>

            <p className="text-gray-600 dark:text-gray-300">
              Toggle theme using the button
            </p>

            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Theme working ✅
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;