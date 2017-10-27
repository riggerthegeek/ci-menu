/**
 * tray
 */

/* Node modules */

/* Third-party modules */
import { app, Menu, nativeImage, shell, Tray } from 'electron';

/* Files */

const iconTypes = [
  'building',
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

const setContextMenu = (i18next, tray, repos = []) => {
  const building = [];
  const fails = [];
  const passes = [];

  const menuContents = repos.map((repo) => {
    if (repo.status === 'success') {
      /* Passed successfully */
      passes.push(repo);
    } else {
      /* Didn't pass - treat as failed */
      fails.push(repo);
    }

    if (repo.isBuilding) {
      building.push(repo);
    }

    return {
      icon: !icons[repo.img] ? icons.unknown : icons[repo.img],
      label: repo.title,
      click: () => shell.openExternal(repo.url),
    };
  });

  const commonMenu = [{
    type: 'separator',
  }, {
    label: i18next.t('tray:OPEN_APP', {
      name: i18next.t('common:APP_NAME'),
    }),
    click () {
      tray.emit('click');
    },
  }, {
    type: 'separator',
  }, {
    label: i18next.t('tray:EXIT'),
    click () {
      app.quit();
    },
  }];

  /* Get the tray icon - default to unknown */
  let trayImg = icons.unknown;

  if (building.length > 0) {
    /* Building */
    trayImg = icons.building;
  } else if (passes.length > 0 && fails.length === 0) {
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

export default (i18next) => {
  const tray = new Tray(icons.unknown);

  tray.on('click', () => app.emit('activate'));

  setContextMenu(i18next, tray);

  app.on('update-repos', (repos) => {
    setContextMenu(i18next, tray, repos);
  });

  tray.setToolTip(i18next.t('common:APP_NAME'));
};
