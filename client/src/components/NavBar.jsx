import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [profilPicture, setProfilPicture] = useState("");
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const [isActive, setIsActive] = useState(false);
  const profilRef = useRef(null); // Référence pour l'image de profil

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.profilPicture) {
      setProfilPicture(user.profilPicture);
    }

    const handleClickOutside = (event) => {
      if (profilRef.current && !profilRef.current.contains(event.target)) {
        setIsActive(false); // Désactiver le menu déroulant si on clique à l'extérieur
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleProfilClick = (event) => {
    event.stopPropagation();
    setIsActive((prev) => !prev); // Toggle du menu déroulant
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  return (
    <nav className="SocialNavBar">
      <NavLink
        to={`/`} // Corrige l'utilisation des backticks
        className="logo"
        style={{
          backgroundImage: `url("/img/PPplaceholder.jpg")`,
        }}
      ></NavLink>
      <div className="LinkContainer">
        <NavLink to="/" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
          Trending
        </NavLink>
        <NavLink to="/FollowingPage" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
          Following
        </NavLink>
        <NavLink to="/YourWork" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
          Your Work
        </NavLink>
      </div>
      <div className="ProfilContainer">
        <img
          ref={profilRef}
          className={`UserPP ${isActive ? "active" : "inactive"}`}
          src={profilPicture || "/img/PPplaceholder.jpg"}
          alt="User Profil Picture"
          onClick={handleProfilClick}
        />
        {isActive && (
          <div className="DropdownMenu box">
            <NavLink to={`/api/Profil/${userId}`} className="dropdown-link">
              Profil
            </NavLink>
            <hr className="hrDropdown" />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
