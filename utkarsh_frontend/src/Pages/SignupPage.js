import React, { useState, useContext } from "react";
import HandleApi from "../Apis/HandleApi";
import { useHistory } from "react-router";
import "../Design/LoginandSignupPage.css";
import Footer from "../Components/Footer";
import useWindowDimensions from "../Utility_functions/UseWIndowDimensions";
import GoogleLogin from "react-google-login";
const SignupPage = () => {
  document.body.style.overflow = "hidden";
  const { height, width } = useWindowDimensions();
  const [isPhone, setIsPhone] = useState(false);
  if ((width < 1000 && height < 500) || width < 700) {
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
    if (isPhone == false) setIsPhone(true);
  }
  let history = useHistory();
  const [showerror, setShowerror] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  //console.log(props.isLogin); isLogin is 1 for login and 0 for signup
  const [cursor, setCursor] = useState("default");
  const handleSignup = (event) => {
    event.preventDefault();
    var mailValidation =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/; //regexp doesnt need double quotes
    if (!mailValidation.test(event.target.Email.value.toString())) {
      setShowerror("Please enter a valid email");
      return;
    }
    //setCursor("wait");
    setShowSpinner(true);
    let username = event.target.Username.value.toString();
    let email = event.target.Email.value.toString();
    let password = event.target.Password.value.toString();
    let data = {
      username: username,
      password: password,
      email: email,
    };
    HandleApi("POST", "/Signup", data)
      .then((response) => {
        // i already return response.data so i can now directly to response.status this status variable is created by me , i am not using the status http status codes
        //console.log(response.status);

        //setCursor("default");
        setShowSpinner(false);
        history.push("/LoginNewSignUp"); //so that i can redirect the new user to the login page and at the same time i can show him a message that he has successfully signed up
        //later on i can simply add on this feature to include email verification
      })
      .catch((error) => {
        //console.log(error);
        // setCursor("default");
        setShowSpinner(false);
      });
  };
  const handleGoogleSignup = (response) => {
    console.log(response);
  };
  const handleGoogleSignupFailure = (response) => {
    console.log(response);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "93vh",
        justifyContent: "space-evenly",
        flexDirection: "column",
      }}
    >
      <div className="SignupPage">
        <div className="login-sign-up-heading">
          We are elated to have you join us !!
        </div>

        <form className="sign-up-credentials" onSubmit={handleSignup}>
          <input
            className="input-field"
            name="Username"
            placeholder="Username"
            autoComplete="off"
          />
          <input
            className="input-field"
            name="Email"
            placeholder="Email"
            autoComplete="off"
          />
          <input
            className="input-field"
            name="Password"
            placeholder="Password"
            type="password"
            autoComplete="off"
          />
          {showerror == "" ? (
            ""
          ) : (
            <div style={{ color: "red", fontSize: "2.5vh" }}>{showerror}</div>
          )}
          <button className="login-signup-button"> SIGNUP</button>
          {/* <GoogleLogin
            clientId="326166939890-6jf6a5va9dul2j5o7vuq2omebl9smt2t.apps.googleusercontent.com"
            buttonText="Signup with Google"
            onSuccess={handleGoogleSignup}
            onFailure={handleGoogleSignupFailure}
            cookiePolicy={"single_host_origin"}
          /> */}
        </form>
      </div>
      <Footer height={isPhone ? "92vmax" : "92vh"}></Footer>
      {showSpinner ? <div className="spinner"></div> : ""}
    </div>
  );
};

export default SignupPage;
