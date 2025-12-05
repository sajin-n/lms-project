import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-white text-black">{children}</main>
      </div>
    </div>
  );
}
