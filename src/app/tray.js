/**
 * tray
 */

/* Node modules */

/* Third-party modules */
import { app, Menu, Tray } from 'electron';

/* Files */

export default () => {
  const tray = new Tray(`${__dirname}/../assets/img/logo.png`);

  tray.on('click', () => {
    app.emit('activate');
  });

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Item2',
    click () {
      // tray.emit('click');
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
