import { useState } from "react";

function Timer() {

    const [mode,setMode]=useState("focus");

    return(

        <div className="timer-container">

            <h2>Study Timer</h2>

            <div className="timer-tabs">

                <button
                onClick={()=>setMode("focus")}
                >
                    Focus
                </button>

                <button
                onClick={()=>setMode("break")}
                >
                    Break
                </button>

                <button
                onClick={()=>setMode("long")}
                >
                    Long Break
                </button>

            </div>

            <h1>

                25:00

            </h1>

            <div>

                <button>

                    Start

                </button>

                <button>

                    Pause

                </button>

                <button>

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