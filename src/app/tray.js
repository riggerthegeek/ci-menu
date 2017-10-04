/**
 * tray
 */

/* Node modules */

/* Third-party modules */
import { app, Menu, nativeImage, Tray } from 'electron';

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

export default () => {
  const tray = new Tray(icons.unknown);

  tray.on('click', () => app.emit('activate'));

  app.on('change-tray-status', (status) => {
    console.log({
      status,
    });
  });

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Item2',
    click () {
      console.log('hello');
    },
  }, {
    type: 'separator',
  }, {
    label: 'Exit',
    click () {
      app.quit();
    },
  }]);

  tray.setTitle('This is a title');
  tray.setToolTip('This is a tooltip');
  tray.setContextMenu(contextMenu);
};
