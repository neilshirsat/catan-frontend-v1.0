import React, { useEffect, useState } from "react";
import { timer } from "rxjs";

function formatNumber(num: number) {
    return num.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

function formatTime(time: number) {
    let seconds, minutes, hours;
    hours = Math.floor(time / 3600.0);
    minutes = Math.floor((time % 3600.0) / 60.0);
    seconds = (time % (3600)) % 60;
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
}

const Timer: React.FC<{}> = (props) => {
    const [time, setTime] = useState(0)
    useEffect(()=>{
        timer(1000).subscribe(()=>{
            setTime(time+1);
        })
    })
    return (
        <React.Fragment>
            {formatTime(time)}
        </React.Fragment>
    )
}

export default Timer;