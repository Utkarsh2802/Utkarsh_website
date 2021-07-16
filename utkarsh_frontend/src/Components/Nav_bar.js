import React, { useContext, useState } from "react";

import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.css";
import "../Design/Nav.css";
import { Link } from "react-router-dom";
import Handle_api from "../Apis/Handle_api";
import { UserContext } from "../GlobalContexts.js/UserContext";
const Nav_bar = () => {
  // const [cursor, setCursor] = useState("default");
  const [showSpinner, setShowSpinner] = useState(false);
  const { loggedIn, setLoggedIn } = useContext(UserContext);
  const Handle_logout = (event) => {
    // setCursor("wait");
    setShowSpinner(true);
    Handle_api("POST", "/Logout", {})
      .then((response) => {
        // setCursor("default");
        setShowSpinner(false);
        console.log("Logged out successfully");
        localStorage.clear();
        localStorage.setItem("data", JSON.stringify(response));
        setLoggedIn(false);
      })
      .catch((error) => {
        //  setCursor("default");
        setShowSpinner(false);
        console.log(error);
      });
  };
  //console.log("rendered nav bar again");
  //console.log(loggedIn);
  return (
    <div className="nav_custom_colortest">
      <Navbar variant="dark">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "fit-content",
            alignItems: "center",
            // cursor: cursor,
          }}
          className="safarinavbar"
        >
          <Navbar.Brand className="navlogo">Typing God </Navbar.Brand>
          <Link to="/">
            <Navbar.Text>Home</Navbar.Text>
          </Link>
          <Link to="/TypingSpeedTest">
            <Navbar.Text>Typing Test</Navbar.Text>
          </Link>
          <Link to="/Leaderboard">
            <Navbar.Text>Leaderboard</Navbar.Text>
          </Link>
          {loggedIn ? (
            <React.Fragment>
              <Link to="/Profile">
                <Navbar.Text>Profile</Navbar.Text>
              </Link>
              <div onClick={Handle_logout} className="logoutbutton">
                <Navbar.Text>Logout</Navbar.Text>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link to="/Login">
                <Navbar.Text>Login</Navbar.Text>
              </Link>

              <Link to="/Signup">
                <Navbar.Text>Signup</Navbar.Text>
              </Link>
            </React.Fragment>
          )}
        </div>
      </Navbar>
      {showSpinner ? <div className="spinner"></div> : ""}
    </div>
  );
};

export default Nav_bar;
