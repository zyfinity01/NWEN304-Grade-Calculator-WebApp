import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const logout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  return (
    <div className="navbar" >
      <div ></div>  {/* This is an empty div for the first grid column */}
      <span className="logo">Grade Calculator</span>
      {user ? (
        <ul className="list">
          <li className="listItem">
            <img
              src={user.photos[0].value}
              alt=""
              className="avatar"
            />
          </li>
          <li className="listItem">{user.displayName}</li>
          <li className="listItem" onClick={logout}>
            Logout
          </li>
        </ul>
      ) : (
          <div className="loginContainer">
          <Link className="link" to="login">
            Login
          </Link>
        </div>
      )}
    </div>

  );
};

export default Navbar;
