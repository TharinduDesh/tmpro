console.log("Timer script loading...");

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing timer...");
  initializeTimer();
});

function initializeTimer() {
  // DOM Elements
  const timerDisplay = document.getElementById("timer-display");
  const statusMessage = document.getElementById("status-message");
  const startPauseBtn = document.getElementById("start-pause-btn");
  const resetBtn = document.getElementById("reset-btn");
  const sessionCountDisplay = document.getElementById("session-count");
  const totalTimeDisplay = document.getElementById("total-time");

  console.log("Elements found:", {
    timerDisplay: !!timerDisplay,
    statusMessage: !!statusMessage,
    startPauseBtn: !!startPauseBtn,
    resetBtn: !!resetBtn,
    sessionCountDisplay: !!sessionCountDisplay,
    totalTimeDisplay: !!totalTimeDisplay,
  });

  // Timer Settings
  const WORK_MINUTES = 25; // Change to 1 for quick testing
  const SHORT_BREAK_MINUTES = 5;
  const LONG_BREAK_MINUTES = 15;
  const SESSIONS_BEFORE_LONG_BREAK = 4;

  // State Variables
  let timerInterval = null;
  let isRunning = false;
  let isWorkSession = true;
  let timeLeft = WORK_MINUTES * 60;

  // Load saved data or initialize
  let pomodoroCount = loadData("pomodoroCount") || 0;
  let totalStudySeconds = loadData("totalStudySeconds") || 0;

  console.log("Loaded data:", { pomodoroCount, totalStudySeconds });

  // Data persistence functions
  function saveData(key, value) {
    try {
      localStorage.setItem(`pomodoro_${key}`, JSON.stringify(value));
      console.log(`Saved ${key}:`, value);
    } catch (e) {
      console.log("Could not save data:", e);
    }
  }

  function loadData(key) {
    try {
      const saved = localStorage.getItem(`pomodoro_${key}`);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.log("Could not load data:", e);
      return null;
    }
  }

  // Check if data is from today (reset daily)
  function checkAndResetDailyData() {
    const today = new Date().toDateString();
    const lastDate = loadData("lastDate");

    if (lastDate !== today) {
      console.log("New day detected, resetting daily stats");
      pomodoroCount = 0;
      totalStudySeconds = 0;
      saveData("pomodoroCount", pomodoroCount);
      saveData("totalStudySeconds", totalStudySeconds);
      saveData("lastDate", today);
    }
  }

  // Audio for notification
  let notificationSound;
  try {
    notificationSound = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
    );
  } catch (e) {
    console.log("Audio not supported");
    notificationSound = null;
  }

  // Functions
  function updateDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const sec = String(timeLeft % 60).padStart(2, "0");
    timerDisplay.textContent = `${min}:${sec}`;
    document.title = `${min}:${sec} - Pomodoro`;
  }

  function toggleTimer() {
    console.log("Toggle timer clicked, isRunning:", isRunning);

    if (isRunning) {
      // Pause
      clearInterval(timerInterval);
      isRunning = false;
      startPauseBtn.textContent = "Resume";
      console.log("Timer paused");
    } else {
      // Start/Resume
      isRunning = true;
      startPauseBtn.textContent = "Pause";
      statusMessage.textContent = isWorkSession
        ? "Time to focus!"
        : "Break time!";
      console.log("Timer started");

      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          if (isWorkSession) {
            totalStudySeconds++;
            // Save every minute to avoid losing too much data
            if (totalStudySeconds % 60 === 0) {
              saveData("totalStudySeconds", totalStudySeconds);
            }
            updateTotalTimeDisplay();
          }
          updateDisplay();
        } else {
          switchSession();
        }
      }, 1000);
    }
  }

  function resetTimer() {
    console.log("Reset timer clicked");
    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.textContent = "Start";

    if (isWorkSession) {
      timeLeft = WORK_MINUTES * 60;
      statusMessage.textContent = "Ready to start?";
    } else {
      if (
        pomodoroCount > 0 &&
        pomodoroCount % SESSIONS_BEFORE_LONG_BREAK === 0
      ) {
        timeLeft = LONG_BREAK_MINUTES * 60;
      } else {
        timeLeft = SHORT_BREAK_MINUTES * 60;
      }
      statusMessage.textContent = "Ready for a break?";
    }
    updateDisplay();
  }

  function switchSession() {
    clearInterval(timerInterval);

    // Play notification sound if available
    if (notificationSound) {
      try {
        notificationSound.play();
      } catch (e) {
        console.log("Could not play notification sound");
      }
    }

    isRunning = false;
    startPauseBtn.textContent = "Start";

    if (isWorkSession) {
      // Completed a work session
      pomodoroCount++;
      saveData("pomodoroCount", pomodoroCount);
      saveData("totalStudySeconds", totalStudySeconds);
      updateSessionCountDisplay();
      console.log(
        `Completed pomodoro #${pomodoroCount}. Total study time: ${Math.floor(
          totalStudySeconds / 60
        )} minutes`
      );

      if (
        pomodoroCount > 0 &&
        pomodoroCount % SESSIONS_BEFORE_LONG_BREAK === 0
      ) {
        timeLeft = LONG_BREAK_MINUTES * 60;
        statusMessage.textContent = "Take a long break!";
      } else {
        timeLeft = SHORT_BREAK_MINUTES * 60;
        statusMessage.textContent = "Time for a short break!";
      }
      isWorkSession = false;
    } else {
      // Completed a break
      timeLeft = WORK_MINUTES * 60;
      statusMessage.textContent = "Time to focus!";
      isWorkSession = true;
    }
    updateDisplay();
  }

  function updateSessionCountDisplay() {
    sessionCountDisplay.textContent = `Pomodoros today: ${pomodoroCount}`;
  }

  function updateTotalTimeDisplay() {
    const hours = Math.floor(totalStudySeconds / 3600);
    const mins = Math.floor((totalStudySeconds % 3600) / 60);
    totalTimeDisplay.textContent = `Total: ${hours}h ${mins}m`;
  }

  // Event Listeners
  startPauseBtn.addEventListener("click", function (e) {
    console.log("Start button event triggered");
    e.preventDefault();
    e.stopPropagation();
    toggleTimer();
  });

  resetBtn.addEventListener("click", function (e) {
    console.log("Reset button event triggered");
    e.preventDefault();
    e.stopPropagation();
    resetTimer();
  });

  // Initial setup
  checkAndResetDailyData();
  updateDisplay();
  updateSessionCountDisplay();
  updateTotalTimeDisplay();
  console.log("Timer initialized successfully");
}

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === "loading") {
  console.log("DOM still loading, waiting...");
} else {
  console.log("DOM already loaded, initializing immediately...");
  initializeTimer();
}
