import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center p-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        AI Interview
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm">
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg 
          bg-white/10 hover:bg-white/20 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
