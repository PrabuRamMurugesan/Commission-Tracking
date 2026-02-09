import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

const confirmLogout = () => {
   if (window.confirm("Are you sure you want to logout?")) {
       localStorage.clear();
       router.push("/login");
   }
};

  return (
    <nav>
      <button onClick={confirmLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
