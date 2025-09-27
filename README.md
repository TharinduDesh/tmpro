# Pomodoro Timer (tmpro)

A simple, minimalist, and always-on-top Pomodoro timer designed for managing work and study time effectively. Built with Electron.

## Features

* **Standard Pomodoro Technique**: Follows the classic 25-minute focus sessions followed by 5-minute short breaks.
* **Long Breaks**: Takes a 15-minute long break after every four Pomodoro sessions.
* **Minimalist UI**: A clean, frameless, and transparent interface that stays out of your way.
* **Always on Top**: The timer window always stays on top of other applications to keep you focused.
* **Session Tracking**: Automatically tracks the number of Pomodoros and total focus time for the day.
* **Data Persistence**: Your daily progress is saved locally and resets every day.

## Tech Stack

* **Framework**: Electron
* **Frontend**: HTML, CSS, JavaScript

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm installed on your machine.

### Installation & Running

1.  Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```sh
    cd tmpro
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```
4.  Run the application in development mode:
    ```sh
    npm start
    ```
   

## Building the Application

You can create a distributable installer for the application.

* **To build for your current platform:**
    ```sh
    npm run build
    ```
   
* **To build specifically for Windows:**
    ```sh
    npm run build-win
    ```
   

The installer will be located in the `dist` folder.

## License

This project is licensed under the ISC License.
