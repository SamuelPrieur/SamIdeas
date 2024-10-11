import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const [isActive, setIsActive] = useState(false);
  const profileRef = useRef(null); // Référence pour l'image de profil

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.profilePicture) {
      setProfilePicture(user.profilePicture);
    }

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsActive(false); // Désactiver le menu déroulant si on clique à l'extérieur
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleProfileClick = (event) => {
    event.stopPropagation();
    setIsActive((prev) => !prev); // Toggle du menu déroulant
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  return (
    <nav className="SocialNavBar">
      <img className="Logo" src="#" alt="Logo Sam Ideas" />
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
      <div className="ProfileContainer">
        <img
          ref={profileRef}
          className={`UserPP ${isActive ? "active" : "inactive"}`}
          src={profilePicture || "/img/PPplaceholder.jpg"}
          alt="User Profile Picture"
          onClick={handleProfileClick}
        />
        {isActive && (
          <div className="DropdownMenu box">
            <NavLink to="/profile" className="dropdown-link">
              Profile
            </NavLink>
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
