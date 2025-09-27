// main.js - This script creates and manages the application window.

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 200,
    minWidth: 250,
    minHeight: 180,
    alwaysOnTop: true, // <-- FIX: This keeps the window on top of others.
    transparent: true, // Key feature for a transparent background
    frame: false, // Removes the default window frame (title bar, etc.)
    resizable: true, // Allows the window to be resized
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools for debugging (optional)
  // mainWindow.webContents.openDevTools({ mode: 'detach' });
}

// This method will be called when Electron has finished initialization
// and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
