// import { useState } from "react";

// function Timer() {

//     const [mode,setMode]=useState("focus");

//     return(

//         <div className="timer-container">

//             <h2>Study Timer</h2>

//             <div className="timer-tabs">

//                 <button
//                 onClick={()=>setMode("focus")}
//                 >
//                     Focus
//                 </button>

//                 <button
//                 onClick={()=>setMode("break")}
//                 >
//                     Break
//                 </button>

//                 <button
//                 onClick={()=>setMode("long")}
//                 >
//                     Long Break
//                 </button>

//             </div>

//             <h1>

//                 25:00

//             </h1>

//             <div>

//                 <button>

//                     Start

//                 </button>

//                 <button>

//                     Pause

//                 </button>

//                 <button>

//                     Reset

//                 </button>

//             </div>

//             <h3>

//                 Current Mode :

//                 {

//                     mode==="focus"

//                     ?

//                     "Focus"

//                     :

//                     mode==="break"

//                     ?

//                     "Break"

//                     :

//                     "Long Break"

//                 }

//             </h3>

//         </div>

//     );

// }

// export default Timer;

import { useEffect, useState } from "react";
function Timer() {

    const timerValues = {
        focus: 25 * 60,
        break: 5 * 60,
        long: 15 * 60
    };

    const [mode, setMode] = useState("focus");
    const [timeLeft, setTimeLeft] = useState(timerValues.focus);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (running && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [running, timeLeft]);

    const changeMode = (newMode) => {
        setRunning(false);
        setMode(newMode);
        setTimeLeft(timerValues[newMode]);
    };

    const resetTimer = () => {
        setRunning(false);
        setTimeLeft(timerValues[mode]);
    };

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
    };

    return (
        <div className="timer-container">
            <h2>Study Timer</h2>

            <div className="timer-tabs">
                <button onClick={() => changeMode("focus")}>
                    Focus
                </button>
                <button onClick={() => changeMode("break")}>
                    Break
                </button>
                <button onClick={() => changeMode("long")}>
                    Long Break
                </button>
            </div>

            <h1>
                {formatTime()}
            </h1>

            <div className="timer-buttons">
                <button
                    onClick={() => setRunning(true)}
                >
                    Start
                </button>

                <button
                    onClick={() => setRunning(false)}
                >
                    Pause
                </button>

                <button
                    onClick={resetTimer}
                >
                    Reset
                </button>
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
        </div>
    );
}

export default Timer;