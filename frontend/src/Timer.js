import React, { useState, useEffect } from 'react';
import './Timer.css'; // Import the CSS file

const Timer = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Retrieve timer state from local storage
    const storedTimeLeft = localStorage.getItem('timerTimeLeft');
    if (storedTimeLeft !== null) {
      setTimeLeft(parseInt(storedTimeLeft));
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [duration]);

  useEffect(() => {
    // Save timer state to local storage
    localStorage.setItem('timerTimeLeft', timeLeft);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="timer">
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
