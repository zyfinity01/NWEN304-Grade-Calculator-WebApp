import React from 'react';
import './App.css';

// GradeCalculator component handles the grade calculation logic
function GradeCalculator({ score }) {
  let grade = 'Invalid input';

  if (!isNaN(score)) {
    const numericScore = parseFloat(score);
    if (numericScore >= 90) {
      grade = 'A';
    } else if (numericScore >= 80) {
      grade = 'B';
    } else if (numericScore >= 70) {
      grade = 'C';
    } else if (numericScore >= 60) {
      grade = 'D';
    } else {
      grade = 'F';
    }
  }

  return (
    <div className="Grade-result">
      {grade && (
        <p>Your grade is: <strong>{grade}</strong></p>
      )}
    </div>
  );
}

// App component handles the UI
function App() {
  const [score, setScore] = React.useState('');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Grade Calculator</h1>
        <div className="Grade-input">
          <label htmlFor="score">Enter your score:</label>
          <input
            type="number"
            id="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </div>
        <GradeCalculator score={score} />
      </header>
    </div>
  );
}

export default App;
