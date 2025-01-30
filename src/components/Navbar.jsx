import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white text-2xl font-bold">
            Task Manager
          </Link>
          <Link to="/about" className="text-white hover:text-gray-200">
            About
          </Link>
          <Link to="/contact" className="text-white hover:text-gray-200">
            Contact
          </Link>
          <Link to="/articles" className="text-white hover:text-gray-200">
            Articles
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="p-2 rounded border"
          />
          {user ? (
            <>
              <Link to="/profile" className="text-white hover:text-gray-200">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
