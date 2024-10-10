import { NavLink } from "react-router-dom";

const Navbar = () => {
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
      <img className="UserPP" src="#" alt="User Profile Picture" />
    </nav>
  );
};

export default Navbar;
