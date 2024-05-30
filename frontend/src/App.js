import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Timer from './Timer';
import './App.css'; // Import the CSS file

const socket = io('https://voting2.onrender.com'); // Change to the new port

const App = () => {
  const [votes, setVotes] = useState({ participant1: 0, participant2: 0 });
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    // Retrieve voting status from local storage
    const hasVoted = localStorage.getItem('hasVoted');
    if (hasVoted) {
      setVoted(true);
    }

    socket.on('voteUpdate', (newVotes) => {
      setVotes(newVotes);
    });

    axios.get('https://voting2.onrender.com/api/votes') // Change to the new port
      .then((response) => {
        setVotes(response.data);
      }).catch(error => {
        console.error('Error fetching votes:', error);
      });
  }, []);

  const handleVote = (participant) => {
    if (!voted) {
      axios.post('https://voting2.onrender.com/api/vote', { participant }) // Change to the new port
        .then(() => {
          setVoted(true);
          // Store voting status in local storage
          localStorage.setItem('hasVoted', true);
        })
        .catch(error => {
          console.error('Error submitting vote:', error);
        });
    }
  };

  return (
    <div className="container">
      <h1>Debate Competition Voting</h1>
      <div>
        <button onClick={() => handleVote('participant1')} disabled={voted}>Vote for Participant 1</button>
        <button onClick={() => handleVote('participant2')} disabled={voted}>Vote for Participant 2</button>
      </div>
      <div className="vote-count">
        <p>Participant 1 Votes: {votes.participant1}</p>
        <p>Participant 2 Votes: {votes.participant2}</p>
      </div>
      <div className="timer">
        <Timer duration={300} />
      </div>
    </div>
  );
};

export default App;
