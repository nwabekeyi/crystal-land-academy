import React, { useState, useEffect } from "react";

function Time() {
    function dateTime() {
        let date = new Date();
        let hour, min, timeType;
        hour = date.getHours();
        if (hour < 12) {
            timeType = "AM";
            if (hour === 0) {
                hour = "12";
            }
        } else {
            timeType = "PM";
            if (hour > 12) {
                hour = hour - 12;
            }
        }
        min = date.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        let final;
        final = `${hour}:${min} ${timeType}`;
        return final;
    }

    const [time, setTime] = useState(dateTime());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(dateTime());
        }, 1000); // Update every second

        // Cleanup interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Empty dependency array to run once on mount

    return (
        <div className="date-time">
            <span className="time">{time}</span>
        </div>
    );
}

export default Time;
