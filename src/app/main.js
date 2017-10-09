/**
 * Main
 *
 * This controls the window process and the
 * instantiation of the application.
 */

/* Node modules */

/* Third-party modules */
import { app, BrowserWindow, shell, screen } from 'electron';
import { enableLiveReload } from 'electron-compile';

/* Files */
import Logger from './logger';
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

  const height = 600;
  const width = 400;

  if (mainDisplay) {
    maxWidth = mainDisplay.workAreaSize.width;
    xPos = maxWidth - width;
  }

  const opts = {
    frame: false,
    fullscreenable: false,
    height,
    icon: `${__dirname}/../assets/img/logo.png`,
    maximizable: false,
    movable: false,
    resizable: false,
    show: false,
    title: pkg.productName,
    width,
    x: xPos,
    y: 0,
  };

  app.logger.trigger('trace', 'Creating browser window with opts', {
    opts,
  });

  mainWindow = new BrowserWindow(opts);

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

    if (mainWindow.isVisible()) {
      app.logger.trigger('trace', 'Hiding main window');

      mainWindow.hide();
    } else {
      app.logger.trigger('trace', 'Showing main window');

      mainWindow.show();
    }
  })
  .on('window-all-closed', () => {
    /* Don't quit app if last window closed */
  })
  .on('ready', createWindow);

/* Set the logger */
app.logger = new Logger(`${app.getPath('userData')}/logs/cimenu.log`);

module.exports = app;
