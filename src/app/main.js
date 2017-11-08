/**
 * Main
 *
 * This controls the window process and the
 * instantiation of the application.
 */

/* Node modules */

/* Third-party modules */
import { app, BrowserWindow, screen, shell } from 'electron';
import { enableLiveReload } from 'electron-compile';
import yargs from 'yargs';

/* Files */
import i18n from './i18n';
import Logger from './logger';
import pkg from '../../package.json';
import tray from './tray';

/* Sort out command line args */
// eslint-disable-next-line no-unused-expressions
yargs
  .usage('$0 <cmd> [args]')
  .options({
    hide: {
      alias: 'H',
      default: false,
      describe: 'Hides the main windows on start',
      type: 'boolean',
    },
  })
  .version(app.getVersion())
  .help()
  .parse(process.argv.slice(1))
  .argv;

/* Set the logger */
const logger = new Logger(`${app.getPath('userData')}/logs/ci-menu.log`);
const i18next = i18n(logger);

/*
 Keep a global reference of the window, so it's
 not closed during garbage collection.
 */
let mainWindow;

function createWindow () {
  const height = 600;
  const width = 400;

  const show = yargs.argv.hide === false;

  let xPos = 0;
  let yPos = 0;

  const displays = screen.getAllDisplays();
  const mainDisplay = displays.find(({ id }) => id === 0);

  if (mainDisplay) {
    xPos = (mainDisplay.size.width - width) / 2;
    yPos = (mainDisplay.size.height - height) / 2;
  }

  const opts = {
    frame: false,
    fullscreenable: false,
    height,
    icon: `${__dirname}/../assets/img/logo.png`,
    maximizable: false,
    movable: true,
    resizable: false,
    show: false,
    title: pkg.productName,
    width,
    x: xPos,
    y: yPos,
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
    webContents.openDevTools({
      detach: true,
    });
  }

  mainWindow.loadURL(`file://${__dirname}/../index.html`);

  mainWindow
    .on('closed', () => {
      mainWindow = null;
    })
    .on('ready-to-show', () => {
      tray(i18next);

      if (show) {
        mainWindow.show();
      }
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

app.logger = logger;
app.i18next = i18next;

module.exports = app;
