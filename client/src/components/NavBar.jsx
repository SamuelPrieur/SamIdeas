import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [profilPicture, setProfilPicture] = useState("");
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const [isActive, setIsActive] = useState(false);
  const profilRef = useRef(null); 

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user._id) {
        try {
          const response = await axios.get(`http://localhost:8080/api/Profil/${user._id}`);
          if (response.status === 200) {
            setProfilPicture(
              response.data.profilePicture && response.data.profilePicture !== "http://localhost:8080"
                ? `http://localhost:8080${response.data.profilePicture}`
                : "/img/PPplaceholder.jpg"
            );
          } else {
            console.error("Impossible de récupérer la photo de profil.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la photo de profil :", error);
        }
      }
    };

    fetchProfilePicture();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.profilPicture) {
      setProfilPicture(user.profilPicture);
    }

    const handleClickOutside = (event) => {
      if (profilRef.current && !profilRef.current.contains(event.target)) {
        setIsActive(false); 
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleProfilClick = (event) => {
    event.stopPropagation();
    setIsActive((prev) => !prev); 
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  return (
    <nav className="SocialNavBar">
      <NavLink
        to={`/`} 
        className="logo"
      >
        <img src="/img/logo.svg" alt="" />
      </NavLink>
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
          alt="Profil"
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
