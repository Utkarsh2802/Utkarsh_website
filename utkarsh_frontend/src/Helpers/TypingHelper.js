import React, { useState, useEffect } from "react";
import Letter from "../Components/Letter";

var randomwords = require("random-words");
var wordlist = randomwords(300).join(" "); //i dont think anybody can type more than 300 words in a minute
var curr_index = 0;
var mistakes = 0;
var next_index = [0];
var pointer = 1;
var play_pause_button = "Play";
let temp = 0;
var unique = 0;
for (let i = 0; i < wordlist.length; i++) {
  if (wordlist[i] == " ") {
    temp += 1;
  }
  if (temp % 9 == 0 && temp !== 0) {
    temp = 0;
    next_index.push(i);
  }
}
//everything above this runs only once
const TypingHelper = () => {
  unique++;
  const input_ref = React.useRef(null); // i will use this to create a reference of the input tag so that i can set its value even though i am clicking a separate element
  var spaces = 0;
  var linecount = 0;
  const [score, setscore] = useState(0);
  const [wascorrect, setwascorrect] = useState(Array(2000).fill(0));

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
      if (wordlist[i] == " ") {
        temp += 1;
      }
      if (temp % 9 == 0 && temp !== 0) {
        temp = 0;
        next_index.push(i);
      }
    }
    if (play_pause_button == "Play") play_pause_button = "Pause";
    else play_pause_button = "Play";
    setscore(0);
    setwascorrect(Array(2000).fill(0));
    input_ref.current.value = "";
  };

  const setarray = (index, value) => {
    setwascorrect((prevState) => {
      let new_correct = [...prevState];
      new_correct[index] = value;
      return new_correct;
    });
  };
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
      console.log("Utkarsh");
      console.log(wascorrect[curr_index]);
      event.target.value = "";
    }

    if (curr_index == next_index[pointer]) {
      //to switch the line and start from the next line
      pointer += 1;
      event.target.value = "";
    }
    curr_index += 1;
    // console.log(event.target.value);
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
    <div>
      <div
        style={{
          textAlign: "center",
          border: "0.5vmin solid blue",
          padding: "1vmax",
          position: "absolute",
          top: "18vh",
          left: "6.5vw",
          width: "85vw",
          maxHeight: "9vh",
        }}
      >
        {all_letters}
      </div>
      <input
        type="text"
        onKeyDown={(e) => backspace_handler(e)}
        onKeyUp={(e) => keypress_handler(e)}
        disabled={true}
        ref={input_ref}
      />
      <button onClick={(e) => play_game_handler(e)}>
        {" "}
        {play_pause_button}{" "}
      </button>
      <div>Score: {score}</div>
      <div>Mistakes: {mistakes}</div>
    </div>
  );
};
export default TypingHelper;
