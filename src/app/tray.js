/**
 * tray
 */

/* Node modules */

/* Third-party modules */
import { app, Menu, nativeImage, shell, Tray } from 'electron';

/* Files */

const iconTypes = [
  'partial',
  'fail',
  'pass',
  'unknown',
];

const icons = iconTypes.reduce((result, type) => {
  result[type] = nativeImage
    .createFromPath(`${__dirname}/../assets/img/statuses/${type}.png`)
    .resize({
      width: 16,
    });

  return result;
}, {});

const setContextMenu = (tray, repos = []) => {
  const menuContents = repos.map(repo => ({
    icon: !icons[repo.img] ? icons.unknown : icons[repo.img],
    label: repo.title,
    click () {
      return shell.openExternal(repo.url);
    },
  }));

  const commonMenu = [{
    type: 'separator',
  }, {
    label: 'Open CI Menu',
    click () {
      tray.emit('click');
    },
  }, {
    type: 'separator',
  }, {
    label: 'Exit',
    click () {
      app.quit();
    },
  }];

  /* Get the tray icon - default to unknown */
  let trayImg = icons.unknown;

  /* Are they all passing? */
  const passes = repos.filter(({ status }) => status === 'success');

  /* Are they all failing? */
  const fails = repos.filter(({ status }) => status === 'failure');

  if (passes.length > 0 && fails.length === 0) {
    /* All passed - no failures */
    trayImg = icons.pass;
  } else if (passes.length === 0 && fails.length > 0) {
    /* All failed - no passes */
    trayImg = icons.fail;
  } else if (passes.length > 0 && fails.length > 0) {
    /* Passes and fails */
    trayImg = icons.partial;
  }

  /* Add in the common menu contents */
  commonMenu.forEach((item) => {
    menuContents.push(item);
  });

  const contextMenu = Menu.buildFromTemplate(menuContents);

  const failCount = fails.length > 10 ? '10+' : String(fails.length);

  tray.setContextMenu(contextMenu);
  tray.setImage(trayImg);
  tray.setTitle(failCount);
};

export default () => {
  const tray = new Tray(icons.unknown);

  tray.on('click', () => app.emit('activate'));

  setContextMenu(tray);

  app.on('update-repos', (repos) => {
    setContextMenu(tray, repos);
  });

  tray.setToolTip('CI Menu');
};
