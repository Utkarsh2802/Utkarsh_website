import "./App.css";
import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import TypingSpeedTest from "./Pages/TypingSpeedTest";
import HomePage from "./Pages/HomePage";
import NavBar from "./Components/NavBar";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import HandleApi from "./Apis/HandleApi";
import PlaySound from "./Components/PlaySound";
import Tones from "./Data/Songs/AviciiTheNights.mp3";
import SignupPage from "./Pages/SignupPage";
import { UserContext } from "./GlobalContexts.js/UserContext";
import Footer from "./Components/Footer";
import LeaderboardPage from "./Pages/LeaderboardPage";
import pexels9 from "./Data/Images/pexels9.jpg";
import useWindowDimensions from "./Utility_functions/UseWIndowDimensions";

function App() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const { height, width } = useWindowDimensions();
  const [isPhone, setIsPhone] = useState(false);
  if ((width < 1000 && height < 500) || width < 700) {
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
    if (isPhone == false) setIsPhone(true);
  }
  if (localStorage.length > 0) {
    try {
      var data = JSON.parse(localStorage.getItem("data"));
      if (data.loggedIn === true) {
        console.log("Yes logged in");
        if (!loggedIn) {
          setLoggedIn(true);
        }
      }
      // } else {
      //   if (loggedIn === true) setLoggedIn(false); //if loggedin was true but there no storage in localstorage then we set it to false
      // }
    } catch {}
  }
  // console.log("hi");
  //console.log(JSON.parse(localStorage.getItem("username")));
  useEffect(() => {
    //this will only run once when the app is loaded so basically its the last thing that runs
    // console.log("useeffect called");
    HandleApi("POST", "/CheckAuth", {
      verifier: localStorage.getItem("verifier"),
    })
      .then((response) => {
        let data = response;
        console.log("checkauth: ", data);
        if (
          localStorage.length > 0 &&
          JSON.stringify(data) == localStorage.getItem("data")
        ) {
          //if there are no updates needed on the localstorage
          //then no need to do anything
        } else {
          //i will basically use setstate just so that the localstorage gets updated n the components depending on it also get updated

          localStorage.setItem("data", JSON.stringify(data));
          if (response.loggedIn === true) {
            setLoggedIn(true);
          } else setLoggedIn(false);
        }
      })
      .catch((err) =>
        console.log("some error occured while authenticating the cookie")
      );
  }, []);
  //console.log("statechanged");
  // console.log("runagain");

  return (
    <UserContext.Provider value={{ loggedIn, setLoggedIn }}>
      <NavBar></NavBar>
      <div
        style={{
          backgroundColor: "lightblue",
          position: "absolute",
          height:
            location.pathname == "/Profile" && loggedIn
              ? isPhone && width > height
                ? "215vh"
                : "185vh"
              : isPhone
              ? "95vmax"
              : "95vh",
          width: "100%",
          backgroundImage: `url(${pexels9})`,
          backgroundSize:
            location.pathname == "/Profile" && loggedIn ? "" : "cover",
          backgroundPosition:
            location.pathname == "/Profile" && loggedIn ? "" : "center",
          // backgroundRepeat: "repeat-y",
        }}
      ></div>
      <div style={{ position: "absolute", zIndex: 2 }}>
        <PlaySound url={Tones}></PlaySound>
      </div>
      <Switch>
        <Route path={"/TypingSpeedTest"}>
          <TypingSpeedTest />
        </Route>
        <Route path="/LoginNewSignUp">
          <LoginPage newsignup={true} />
        </Route>
        <Route path="/Login">
          {!loggedIn ? <LoginPage isLogin={1} /> : ""}
        </Route>
        <Route path={"/Signup"}>{!loggedIn ? <SignupPage /> : ""}</Route>
        <Route path="/Profile">
          {!loggedIn ? <HomePage /> : <ProfilePage />}
        </Route>
        <Route path={"/Leaderboard"}>
          <LeaderboardPage username={loggedIn ? data.username : "none"} />
        </Route>
        <Route path={"/"}>
          <HomePage username={loggedIn ? data.username : ""} />
        </Route>
      </Switch>
    </UserContext.Provider>
  );
}

export default App;
