import React, { useState, useEffect } from "react";
import Letter from "../Components/Letter";
import ScoreCard from "./ScoreCard";
import "../Design/Own.css";
import { Animated } from "react-animated-css";
import Cust_Button from "../Components/Cust_Button";
var randomwords = require("random-words");
var wordlist = randomwords(500).join(" "); //i dont think anybody can type more than 300 words in a minute
var curr_index = 0;
var mistakes = 0;
var next_index = [0];
var pointer = 1;
var play_pause_button = "Play";
let temp = 0;
var unique = 0;
for (let i = 0; i < wordlist.length; i++) {
  if (wordlist[i] === " ") {
    temp += 1;
  }
  if (temp % 9 === 0 && temp !== 0) {
    temp = 0;
    next_index.push(i);
  }
}
var reset_clicked = false;
//everything above this runs only once
const TypingHelper = () => {
  const [display_score, setDisplayscore] = useState(false);
  unique++; // added it to get rid fo the unique child warning but to no avail
  const input_ref = React.useRef(null); // i will use this to create a reference of the input tag so that i can set its value even though i am clicking a separate element
  const play_button_ref = React.useRef(null);
  var spaces = 0;
  var linecount = 0;
  const [score, setscore] = useState(0);
  const [wascorrect, setwascorrect] = useState(Array(2000).fill(0));
  var total_time = 60;
  const [timer_started, setTimerstarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(total_time);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  //temp =0;
  //temp++;everything console log returns 1 because it is reinitialized everytime but this is not the case for statevariable
  //console.log(temp);
  const play_game_handler = (event) => {
    wordlist = randomwords(300).join(" "); //i dont think anybody can type more than 300 words in a minute, new game event handler
    input_ref.current.disabled = false;
    curr_index = 0;
    mistakes = 0;
    next_index = [0];
    pointer = 1;
    temp = 0;
    for (let i = 0; i < wordlist.length; i++) {
      if (wordlist[i] === " ") {
        temp += 1;
      }
      if (temp % 9 === 0 && temp !== 0) {
        temp = 0;
        next_index.push(i);
      }
    }
    if (play_pause_button === "Play") {
      play_pause_button = "Reset";
      reset_clicked = false;
    } else {
      reset_clicked = true;
      input_ref.current.disabled = true;
      setTimerstarted(false);
      console.log(timeLeft);
      play_pause_button = "Play";
    }
    setDisplayscore(false);
    setscore(0);
    setwascorrect(Array(2000).fill(0));
    input_ref.current.value = "";
    setTimeLeft(total_time);
    setWpm(0);
    setAccuracy(0);
    setIsVisible(false);

    //  play_button_ref.current.style.visibility = "hidden";
  };

  const setarray = (index, value) => {
    setwascorrect((prevState) => {
      let new_correct = [...prevState];
      new_correct[index] = value;
      return new_correct;
    });
  };
  function start_timer() {
    setTimerstarted(true);
  }

  function stop_timer() {
    setTimerstarted(false);
    input_ref.current.disabled = true;
    play_pause_button = "Play";
    if (timeLeft === 0) {
      //then it means that the time was up and not that i pressed reset
      setDisplayscore(true);
    }
    // play_button_ref.current.style.visibility = "hidden";
    setTimeLeft(total_time); //reset the timer
  }
  useEffect(() => {
    if (timer_started === true) {
      if (timeLeft !== total_time) {
        setWpm(Math.round((score / (total_time - timeLeft)) * 12));
      }
      setAccuracy(Math.round((score * 100) / (score + mistakes)));

      if (timeLeft <= 0) {
        stop_timer();
      } else {
        const timer = setTimeout(() => {
          let temp = timeLeft;
          if (reset_clicked === false) setTimeLeft(temp - 1);
        }, 1000);
      }
    }
  });
  const backspace_handler = (event) => {
    let key = event.key; //keypressed
    if (event.which === 8 || event.which === 46) {
      //backspace case
      mistakes += 1;
      if (event.target.value === "") {
        return;
      }
      if (curr_index === 0 || curr_index === next_index[pointer]) {
        return;
      } else {
        if (wascorrect[curr_index - 1] === 1) {
          setarray(curr_index - 1, 0);
          setscore((prevState) => {
            return prevState - 1;
          });
        } else {
          setarray(curr_index - 1, 0);
        }

        curr_index -= 1;
      }
    }
  };
  const keypress_handler = (event) => {
    let key = event.key; //keypressed

    if (curr_index === 0) {
      start_timer(total_time); //basically when i type my first char only then will the timer be started
    }
    if (event.which === 8 || event.which === 46) {
      return;
    } else {
      if (wordlist[curr_index] === key) {
        setarray(curr_index, 1); //this indicates that the key typed in was correct
        setscore((prevState) => {
          return prevState + 1;
        });
      } else {
        mistakes += 1;
        setarray(curr_index, -1);

        //incorrect key pressed
      }
    }

    if (key === " " && wordlist[curr_index] === key) {
      //if spacebar is pressed

      console.log(wascorrect[curr_index]);
      event.target.value = "";
    }

    if (curr_index === next_index[pointer]) {
      //to switch the line and start from the next line
      pointer += 1;
      event.target.value = "";
    }
    curr_index += 1;
    // console.log(event.target.value);
    if (timeLeft !== total_time) {
      //to avoid divide by zero error n get infinity
      setWpm(Math.round((score / (total_time - timeLeft)) * 12));
    }
    setAccuracy(Math.round((score * 100) / (score + mistakes)));
  };
  let all_letters = [];
  unique++;
  for (let i = next_index[pointer - 1]; i < next_index[pointer + 2]; i++) {
    unique++;
    if (wordlist[i] === " ") {
      spaces += 1;
    }
    if (spaces % 10 === 0 && spaces !== 0) {
      all_letters.push(<br></br>);
      linecount++;
      spaces = 0;
    }
    if (linecount >= 2) {
      linecount = 0;
      break;
    }
    if (i !== curr_index) {
      all_letters.push(
        <Letter
          name={wordlist[i]}
          class="normal_char"
          key={unique}
          color={wascorrect[i]}
        />
      );
    } //each child in a list should have a unique key prop
    else {
      all_letters.push(
        <Letter
          name={wordlist[i]}
          class="blinkk"
          decor="underline"
          key={unique}
          color={wascorrect[i]}
        />
      );
    }
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <Animated
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInDelay={500}
        animationOutDelay={0}
        animationInDuration={1500}
        animationOutDuration={2000}
        animateOnMount={true}
        isVisible={true}
      >
        <div>
          <ScoreCard text="WPM" value={wpm} left_width="25" />
          <ScoreCard
            text="Time"
            value={timeLeft}
            left_width="43"
            total_time={total_time}
          />
          <ScoreCard text="Accuracy" value={accuracy} left_width="61" />
        </div>
      </Animated>

      <div>
        <Animated
          animationIn="slideInLeft"
          animationOut="fadeOut"
          animationInDelay={0}
          animationOutDelay={0}
          animationInDuration={500}
          animationOutDuration={500}
          animateOnMount={true}
          isVisible={!display_score}
        >
          <div
            style={{
              textAlign: "center",
              border: "0.5vmin solid darkblue",
              position: "fixed",
              top: "36vh",
              left: "6.5vw",
              width: "85vw",
              height: "9vh",
              overflow: "hidden",
            }}
          >
            {all_letters}
          </div>
        </Animated>
        <Animated
          animationIn="slideInRight"
          animationOut="fadeOut"
          animationInDelay={0}
          animationOutDelay={0}
          animationInDuration={500}
          animationOutDuration={500}
          animateOnMount={true}
          isVisible={!display_score}
        >
          <input
            className="input_typing"
            style={{
              position: "fixed",
              borderColor: "blue",
              left: "34vw",
              height: "4vh",
              top: "58vh",
              width: "30vw",
            }}
            type="text"
            onKeyDown={(e) => backspace_handler(e)}
            onKeyUp={(e) => keypress_handler(e)}
            disabled={true}
            ref={input_ref}
          />
        </Animated>
      </div>
      {display_score ? (
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInDelay={0}
          animationOutDelay={0}
          animationInDuration={1000}
          animationOutDuration={500}
          animateOnMount={true}
          isVisible={display_score}
        >
          <div className="congrats_message">
            <span>
              {wpm > 75 ? "Congratulations: " : "Continue Practicing, "} you
              have a speed of: {wpm} WPM
            </span>
          </div>
        </Animated>
      ) : (
        ""
      )}
      <Cust_Button
        onClick={(e) => play_game_handler(e)}
        ref={play_button_ref}
        name={play_pause_button}
      ></Cust_Button>
    </div>
  );
};
export default TypingHelper;
