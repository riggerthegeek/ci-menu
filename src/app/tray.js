/**
 * tray
 */

/* Node modules */

/* Third-party modules */
import { app, Menu, nativeImage, Tray } from 'electron';

/* Files */

export default () => {
  const icon = nativeImage.createFromPath(`${__dirname}/../assets/img/logo.png`)
    .resize({
      width: 24,
    });

  const tray = new Tray(icon);

  tray.on('click', () => {
    app.emit('activate');
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
