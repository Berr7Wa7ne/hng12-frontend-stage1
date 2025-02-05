import { useEffect, useState, useCallback } from "react";
import "./App.css";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const App = () => {
  const [win, setWin] = useState(0);
  const [lose, setLose] = useState(0);
  const [countdown, setCountdown] = useState(7);
  const [color, setColor] = useState("");
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState(null);

  const saveScoreToStorage = useCallback(() => {
    localStorage.setItem("win", win.toString());
    localStorage.setItem("lose", lose.toString());
    localStorage.setItem("expire", new Date().getTime().toString());
  }, [win, lose]);

  const initializeGame = () => {
    setCountdown(7);
    const randomColor = getRandomColor();
    setColor(randomColor);

    const answers = [];
    for (let i = 0; i < 5; i++) answers.push(getRandomColor());
    answers.push(randomColor);

    setAnswers(answers.sort(() => Math.random() - 0.5));
  };

  const checkAnswer = (answer) => {
    new Promise((resolve) => {
      if (answer === color) {
        setStatus("WIN");
        setWin((prev) => prev + 1);
        initializeGame();
        resolve();
      } else {
        setStatus("LOSE");
        setLose((prev) => prev + 1);
        resolve();
      }
    }).then(() => {
      saveScoreToStorage();
    });
  };

  useEffect(() => {
    const win = localStorage.getItem("win");
    const lose = localStorage.getItem("lose");

    if (win && lose) {
      setWin(parseInt(win));
      setLose(parseInt(lose));
    }

    initializeGame();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setLose((prev) => prev + 1);
      setStatus("LOSE");
      saveScoreToStorage();
      initializeGame();
    }
  }, [countdown, saveScoreToStorage]); // ✅ Fixed dependency array

  return (
    <div className="app">
      <div className="heading-section">
        <h1 className="heading1">Color Guessing Game</h1>
        <p className="heading" data-testid="gameInstructions">
          Guess the correct color!
        </p>
        <div className="score" data-testid="score">
          <p className="correct">
            Win: <strong>{win}</strong>
          </p>
          <p className="fail">
            Lose: <strong>{lose}</strong>
          </p>
        </div>
        <div className="timer">
          <p>
            Time Left: <span className="countdown">{countdown}s</span>
          </p>
        </div>
      </div>

      <div className="game-section">
        <div
          className="colorBox"
          style={{ backgroundColor: color }}
          data-testid="colorBox"
        ></div>

        <div className="answers">
          {answers.map((color) => (
            <button
              className="button"
              onClick={() => checkAnswer(color)}
              key={color}
              style={{ backgroundColor: color }}
              data-testid="colorOption"
            ></button>
          ))}
        </div>

        <div className="review" data-testid="gameStatus">
          {status === "WIN" && <h3 className="correct">Great job! Keep going!</h3>}
          {status === "LOSE" && <h3 className="fail">Oops! Try again next time.</h3>}
        </div>

        <button
          className="newGameButton"
          onClick={() => {
            setWin(0);
            setLose(0);

            localStorage.setItem("win", "0");
            localStorage.setItem("lose", "0");
            localStorage.setItem("expire", new Date().getTime().toString());

            initializeGame();
          }}
          data-testid="newGameButton"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default App;
