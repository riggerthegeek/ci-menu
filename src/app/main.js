/**
 * Main
 *
 * This controls the window process and the
 * instantiation of the application.
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import { app, BrowserWindow, shell, screen } from 'electron';
import { enableLiveReload } from 'electron-compile';

/* Files */
import pkg from '../../package.json';
import tray from './tray';

/*
 Keep a global reference of the window, so it's
 not closed during garbage collection.
 */
let mainWindow;

function createWindow () {
  const mainDisplay = screen
    .getAllDisplays()
    .find(({ id }) => id === 0);

  let maxWidth = null;
  let xPos = 0;

  const width = 800;

  if (mainDisplay) {
    maxWidth = mainDisplay.workAreaSize.width;
    xPos = maxWidth - width;
  }

  mainWindow = new BrowserWindow({
    frame: false,
    fullscreenable: false,
    height: 600,
    icon: path.join(__dirname, '..', 'assets', 'img', 'logo.png'),
    maximizable: false,
    movable: false,
    resizable: false,
    show: false,
    title: pkg.productName,
    width,
    x: xPos,
    y: 0,
  });

  const { webContents } = mainWindow;

  if (process.env.ENABLE_LIVE_RELOAD === 'true') {
    enableLiveReload();
  }

  if (process.env.SHOW_DEV_TOOLS === 'true') {
    webContents.openDevTools();
  }

  mainWindow.loadURL(`file://${__dirname}/../index.html`);

  mainWindow
    .on('closed', () => {
      mainWindow = null;
    })
    .on('ready-to-show', () => {
      tray();
    });

  const handleRedirect = (event, url) => {
    if (url !== webContents.getURL()) {
      event.preventDefault();
      shell.openExternal(url);
    }
  };

  webContents
    .on('new-window', handleRedirect)
    .on('will-navigate', handleRedirect);
}

app
  .on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
    mainWindow.show();
  })
  .on('window-all-closed', () => {
    /* Don't quit app if last window closed */
  })
  .on('ready', createWindow);

module.exports = app;
