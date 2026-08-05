
import alarm1 from "../assets/sounds/alarm1.mp3";
import alarm2 from "../assets/sounds/alarm2.mp3";
import alarm3 from "../assets/sounds/alarm3.mp3";
import alarm4 from "../assets/sounds/alarm4.mp3";
import alarm5 from "../assets/sounds/alarm5.mp3";
import { useEffect, useState } from "react";

function Timer() {

  const timerValues = {
    focus: 60 * 60,
    break: 10 * 60,
    long: 25 * 60
  };

  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(timerValues.focus);
  const [running, setRunning] = useState(false);
  const [focusCount, setFocusCount] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [longBreakCount, setLongBreakCount] = useState(0);

  const sounds = {
  alarm1,
  alarm2,
  alarm3,
  alarm4,
  alarm5
  };
  const [selectedSound, setSelectedSound] = useState("alarm1");

  const playAlarm = () => {
  const audio = new Audio(sounds[selectedSound]);
  audio.play();
  };

  useEffect(() => {

    let interval;

    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      },1000);
    }

    if(running && timeLeft===0){

        playAlarm();
      setRunning(false);
      if(mode==="focus"){
        setFocusCount(prev=>prev+1);
        setMode("break");
        setTimeLeft(timerValues.break);
      }

      else if(mode==="break"){
        setBreakCount(prev=>prev+1);
        setMode("long");
        setTimeLeft(timerValues.long);
      }

      else{
        setLongBreakCount(prev=>prev+1);
        setMode("focus");
        setTimeLeft(timerValues.focus);
      }
    }

    return ()=>clearInterval(interval);

  },[running,timeLeft]);



  const changeMode=(newMode)=>{
    setRunning(false);
    setMode(newMode);
    setTimeLeft(timerValues[newMode]);
  };


  const resetTimer=()=>{
    setRunning(false);
    setTimeLeft(timerValues[mode]);
  };


  const formatTime=()=>{
    const minutes=Math.floor(timeLeft/60);
    const seconds=timeLeft%60;
    return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
  };


  return(
    <div className="timer-container">
      <h2>Study Timer</h2>

      <div className="timer-tabs">
        <button onClick={()=>changeMode("focus")}>
          Focus
        </button>

        <button onClick={()=>changeMode("break")}>
          Break
        </button>

        <button onClick={()=>changeMode("long")}>
          Long Break
        </button>
      </div>

      <h1>
        {formatTime()}
      </h1>

      <div className="timer-buttons">
        <button onClick={()=>setRunning(true)}>
          Start
        </button>

        <button onClick={()=>setRunning(false)}>
          Pause
        </button>

        <button onClick={resetTimer}>
          Reset
        </button>
      </div>

      <div className="sound-selector">

    <label>Select Alarm: </label>

    <select
    value={selectedSound}
    onChange={(e) => setSelectedSound(e.target.value)}
    >
    <option value="alarm1">Alarm 1</option>
    <option value="alarm2">Alarm 2</option>
    <option value="alarm3">Alarm 3</option>
    <option value="alarm4">Alarm 4</option>
    <option value="alarm5">Alarm 5</option>
    </select>
    </div>

      <h3>
        Current Mode :
        {
          mode==="focus"
          ?
          "Focus"
          :
          mode==="break"
          ?
          "Break"
          :
          "Long Break"
        }

      </h3>
      <div className="timer-stats">
        <p>
          ✅ Focus Completed :
          {focusCount}
        </p>

        <p>
          ☕ Break Completed :
          {breakCount}
        </p>

        <p>
          🌙 Long Break Completed :
          {longBreakCount}
        </p>

      </div>
    </div>
  );
}
export default Timer;