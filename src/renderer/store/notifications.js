/**
 * notifications
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default {

  actions: {

    notify ({ state }, { i18n, newState, oldState }) {
      let toNotify = false;

      const buildLabel = newState.id;
      const newStatus = newState.status;
      const oldStatus = oldState.status;
      const build = buildLabel ? `#${buildLabel}` : '';

      switch (state.notify) {
        case 'change':
          toNotify = newStatus !== oldStatus;
          break;

        case 'fail':
          toNotify = newStatus !== 'success';
          break;

        default:
          /* Always notify */
          toNotify = true;
          break;
      }

      const msg = i18n.t(`notifications:${newStatus.toUpperCase()}`, {
        build,
        name: newState.title,
      });

      if (toNotify) {
        return new Notification(msg, {
          tag: build,
        });
      }

      return false;
    },

  },

  getters: {
    notifyOpts: () => [
      'all', // Notify whenever a build has finished
      'change', // Notify when a change is detected
      'fail', // Notify when new status is not 'Success'
    ],
  },

  state: {
    notify: 'all',
  },

};
