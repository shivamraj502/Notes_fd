import alarm1 from "../assets/sounds/alarm1.mp4";
import alarm2 from "../assets/sounds/alarm2.mp4";
import alarm3 from "../assets/sounds/alarm3.mp4";
import alarm4 from "../assets/sounds/alarm4.mp4";
import alarm5 from "../assets/sounds/alarm5.mp4";
import { useEffect, useState, useRef } from "react";

function Timer() {
    const previewAudioRef = useRef(null);
    const [timerValues, setTimerValues] = useState(() => {
    const saved = localStorage.getItem("timerValues");
    return saved
      ? JSON.parse(saved)
      : {
          focus: 60 * 60,
          break: 10 * 60,
          long: 25 * 60,
        };
  });

  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(timerValues.focus);
  const [running, setRunning] = useState(false);
  const [focusCount, setFocusCount] = useState(() => {
    return Number(localStorage.getItem("focusCount")) || 0;
  });

  const [breakCount, setBreakCount] = useState(() => {
    return Number(localStorage.getItem("breakCount")) || 0;
  });

  const [longBreakCount, setLongBreakCount] = useState(() => {
    return Number(localStorage.getItem("longBreakCount")) || 0;
  });

  const sounds = {
    alarm1,
    alarm2,
    alarm3,
    alarm4,
    alarm5,
  };

  const [selectedSound, setSelectedSound] = useState(() => {
    return localStorage.getItem("selectedSound") || "alarm1";
  });

  const [endTime, setEndTime] = useState(null);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / timerValues[mode]) * circumference;

  const playAlarm = () => {
    const audio = new Audio(sounds[selectedSound]);
    audio.play();
  };

  const previewSound = (soundName) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }

    previewAudioRef.current = new Audio(sounds[soundName]);
    previewAudioRef.current.play();
  };

    useEffect(() => {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }, []);

      const notifyComplete = (title, body) => {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(title, { body });
        }
      };

    useEffect(() => {
      if (running && !endTime) {
        setEndTime(Date.now() + timeLeft * 1000);
      }
      if (!running) {
        setEndTime(null);
      }
    }, [running]);

    useEffect(() => {
      let interval;

      if (running && endTime) {
        interval = setInterval(() => {
          const secondsLeft = Math.round((endTime - Date.now()) / 1000);
          setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
        }, 1000);
      }

      return () => clearInterval(interval);
    }, [running, endTime]);

    // useEffect(() => {
    //   if (running && timeLeft === 0) {
    //     playAlarm();
    //     setRunning(false);
    //     setEndTime(null);

    //     if (mode === "focus") {
    //       setFocusCount((prev) => prev + 1);
    //       setMode("break");
    //       setTimeLeft(timerValues.break);
    //     } else if (mode === "break") {
    //       setBreakCount((prev) => prev + 1);
    //       setMode("long");
    //       setTimeLeft(timerValues.long);
    //     } else {
    //       setLongBreakCount((prev) => prev + 1);
    //       setMode("focus");
    //       setTimeLeft(timerValues.focus);
    //     }
    //   }
    // }, [timeLeft, running, mode, timerValues]);

  useEffect(() => {
    if (running && timeLeft === 0) {
      playAlarm();
      setRunning(false);
      setEndTime(null);

      if (mode === "focus") {
        setFocusCount((prev) => prev + 1);
        setMode("break");
        setTimeLeft(timerValues.break);
        notifyComplete("Focus session done!", "Time for a short break.");
      } else if (mode === "break") {
        setBreakCount((prev) => prev + 1);
        setMode("long");
        setTimeLeft(timerValues.long);
        notifyComplete("Break's over!", "Time for a long break.");
      } else {
        setLongBreakCount((prev) => prev + 1);
        setMode("focus");
        setTimeLeft(timerValues.focus);
        notifyComplete("Long break done!", "Back to focus mode.");
      }
    }
  }, [timeLeft, running, mode, timerValues]);

  useEffect(() => {
    localStorage.setItem("timerValues", JSON.stringify(timerValues));
  }, [timerValues]);

  useEffect(() => {
    localStorage.setItem("focusCount", focusCount);
  }, [focusCount]);

  useEffect(() => {
    localStorage.setItem("breakCount", breakCount);
  }, [breakCount]);

  useEffect(() => {
    localStorage.setItem("longBreakCount", longBreakCount);
  }, [longBreakCount]);

  useEffect(() => {
    localStorage.setItem("selectedSound", selectedSound);
  }, [selectedSound]);

  const changeMode = (newMode) => {
  if (running) {    return;  }

  setMode(newMode);
  setTimeLeft(timerValues[newMode]);
  };

  const resetTimer = () => {
    const confirmReset = window.confirm("Reset all completed timer counts?");

    if (!confirmReset) return;

    setFocusCount(0);
    setBreakCount(0);
    setLongBreakCount(0);

    localStorage.setItem("focusCount", 0);
    localStorage.setItem("breakCount", 0);
    localStorage.setItem("longBreakCount", 0);
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="timer-container">
      <h2>Study Timer</h2>

      <div className="timer-tabs">
        <button
          disabled={running}
          className={mode === "focus" ? "active-tab" : ""}
          onClick={() => changeMode("focus")}
        >
          <span className="tab-title">Focus</span>
          <span className="tab-count">{focusCount}</span>
        </button>

        <button
          disabled={running}
          className={mode === "break" ? "active-tab" : ""}
          onClick={() => changeMode("break")}
        >
          <span className="tab-title">Short Break</span>
          <span className="tab-count">{breakCount}</span>
        </button>

        <button
          disabled={running}
          className={mode === "long" ? "active-tab" : ""}
          onClick={() => changeMode("long")}
        >
          <span className="tab-title">Long Break</span>
          <span className="tab-count">{longBreakCount}</span>
        </button>
      </div>

      <div className="circle-container">
        <svg viewBox="0 0 260 260" className="progress-ring">

          <circle
            className="background-circle"
            strokeWidth="12"
            r={radius}
            cx="130"
            cy="130"
          />

          <circle
            className="progress-circle"
            strokeWidth="12"
            r={radius}
            cx="130"
            cy="130"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference - progress,
            }}
          />
        </svg>

        <div className="time-text">{formatTime()}</div>
      </div>

      <div className="timer-buttons">
        <button disabled={running} onClick={() => setRunning(true)}>
          Start
        </button>

        <button disabled={!running} onClick={() => setRunning(false)}>
          Pause
        </button>

        <button onClick={resetTimer}>Reset</button>
      </div>

      <div className="sound-section">
        <h3>Alarm Sound</h3>

        <div className="sound-toggle">
          <button
            className="toggle-arrow"
            onClick={() => {
              const keys = Object.keys(sounds);
              const idx = keys.indexOf(selectedSound);
              const prevIdx = (idx - 1 + keys.length) % keys.length;
              setSelectedSound(keys[prevIdx]);
            }}
          >
            ◀
          </button>

          <span className="sound-name">
            🔔 {selectedSound.replace("alarm", "Alarm ")}
          </span>

          <button
            className="toggle-arrow"
            onClick={() => {
              const keys = Object.keys(sounds);
              const idx = keys.indexOf(selectedSound);
              const nextIdx = (idx + 1) % keys.length;
              setSelectedSound(keys[nextIdx]);
            }}
          >
            ▶
          </button>

          <button
            className="play-btn"
            onClick={() => previewSound(selectedSound)}
          >
            ▶ Play
          </button>
        </div>
      </div>

      <div className="timer-settings">
        <h3>Timer Settings</h3>
        <div>
          <label>Focus</label>
          <input
            type="number"
            value={timerValues.focus / 60}
            onChange={(e) => {
              const value = Number(e.target.value);
              setTimerValues({
                ...timerValues,
                focus: value * 60,
              });
            }}
            min="1"
          />
        </div>

        <div>
          <label>Break</label>
          <input
            type="number"
            value={timerValues.break / 60}
            onChange={(e) => {
              const value = Number(e.target.value);
              setTimerValues({
                ...timerValues,
                break: value * 60,
              });
            }}
            min="1"
          />
        </div>

        <div>
          <label>Long Break</label>
          <input
            type="number"
            value={timerValues.long / 60}
            onChange={(e) => {
              const value = Number(e.target.value);
              setTimerValues({
                ...timerValues,
                long: value * 60,
              });
            }}
            min="1"
          />
        </div>
      </div>

      <h3>
        Current Mode :
        {mode === "focus"
          ? " Focus"
          : mode === "break"
            ? " Break"
            : " Long Break"}
      </h3>
    </div>
  );
}
export default Timer;
