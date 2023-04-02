const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { netLog } = require('electron');
const { saveEventsToFile, readEventsFromFile } = require("./utils.js");

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadURL('https://ddosify.com');

    // Prevent opening a new window for external links or redirects
    win.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        win.loadURL(url);
    });

    // Prevent opening a new window for target="_blank" links
    win.webContents.on('will-navigate', (event, url) => {
        const currentURL = win.webContents.getURL();
        if (currentURL !== url) {
        event.preventDefault();
        win.loadURL(url);
        }
    });

    // Monitor network requests using webRequest API
    win.webContents.session.webRequest.onCompleted({ urls: ['*://*/*'] }, (details) => {
    const requestData = {
        type: 'network-request',
        url: details.url,
        status: details.statusCode,
        time: new Date(details.timeStamp)
    };
    console.log(requestData);
    });

}
  

app.whenReady().then(createWindow);



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.on('log-event', (event, data) => {
    console.log(data);
    saveEventsToFile(data);
});