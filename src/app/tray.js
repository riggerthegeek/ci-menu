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
    .createFromPath(`${__dirname}/../assets/img/${type}.png`)
    .resize({
      width: 24,
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
    label: 'Exit',
    click () {
      app.quit();
    },
  }];

  commonMenu.forEach((item) => {
    menuContents.push(item);
  });

  const contextMenu = Menu.buildFromTemplate(menuContents);

  tray.setContextMenu(contextMenu);
};

export default () => {
  const tray = new Tray(icons.unknown);

  tray.on('click', () => app.emit('activate'));

  setContextMenu(tray);

  app.on('update-repos', (repos) => {
    setContextMenu(tray, repos);
  });

  tray.setTitle('This is a title');
  tray.setToolTip('This is a tooltip');
};
