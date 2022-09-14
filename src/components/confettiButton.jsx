import React from "react";
import Confetti from "react-dom-confetti";

export default function ConfettiButton(props){
  console.log(props)

  return (
    <div class="confetti-button">
      <Confetti active={props.active} />
    </div>
  );
}

