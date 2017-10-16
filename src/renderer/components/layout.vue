<template lang="jade">
  v-app#app-layout(dark)

    v-tabs(dark fixed icons centered)
      v-toolbar(app dense)

        v-toolbar-title.white--text CI Menu

        v-spacer

        v-btn.btn--v-small(
          color="orange black--text"
          icon
        )
          v-icon remove

        v-btn.btn--v-small(
          color="red black--text"
          icon
        )
          v-icon close

      v-tabs-bar.grey.darken-4
        v-tabs-slider.yellow
        v-tabs-item(
          v-for="page in pages",
          :to="{ name: page.href }"
          router
        )
          v-icon {{ page.icon }}
          span {{ page.name }}

    main
      v-content
        router-view
          v-container(fluid)

    v-footer(app)
      div Last checked:&nbsp;
        span( v-if="lastChecked") {{ lastChecked.format('HH:mm:ss') }}
        span( v-else ) -

        v-tooltip(
          v-for="button in buttons"
          top
        )
          v-btn(
            icon,
            :color="button.color",
            @click="button.action",
            small,
            slot="activator"
          )
            v-icon {{ button.icon }}

          span {{ button.tooltip }}

      v-spacer
      div &copy; 2017
</template>

<script>
  /**
   * layout
   */

  /* Node modules */

  /* Third-party modules */
  import moment from 'moment';
  import { remote } from 'electron';

  /* Files */

  const logger = remote.app.logger.trigger;

  export default {

    created () {
      this.updateRepos(true);
    },

    data () {
      return {
        buttons: [{
          action: () => this.updateRepos(true),
          color: 'green black--text',
          icon: 'refresh',
          tooltip: 'Update repositories',
        }, {
          action: () => this.newRepo(),
          color: 'red white--text',
          icon: 'add',
          tooltip: 'Add new repo',
        }],
        interval: null,
        lastChecked: null,
        pages: [{
          href: 'projects',
          icon: 'folder',
          name: 'Projects',
        }, {
          href: 'alerts',
          icon: 'alarm',
          name: 'Alerts',
        }, {
          href: 'settings',
          icon: 'settings',
          name: 'Settings',
        }],
        updatingRepos: false,
      };
    },

    methods: {

      /**
       * New Repo
       *
       * Sends page to the new repo page
       *
       * @return {Promise}
       */
      newRepo () {
        return this.$router.push({
          name: 'repo',
        });
      },

      /**
       * Reset Timeout
       *
       * Clears the existing timeout and replaces it with
       * a new one.
       */
      resetTimeout () {
        /* Restart the timeout */
        logger('trace', 'Repo update interval cancelled', {
          intervalId: this.interval,
        });

        clearInterval(this.interval);

        let count = 0;
        this.interval = setInterval(() => {
          logger('trace', 'Repo update triggered automatically', {
            count,
          });

          count += 1;

          this.updateRepos(false);
        }, this.$store.getters.updateInterval);

        logger('trace', 'Repo update interval created', {
          intervalId: this.interval,
        });
      },

      /**
       * Update Repo
       *
       * Updates the repos. It will not run an update
       * if there's already one running. There is also
       * the option of resetting the timeout, should
       * we wish to restart the interval from now.
       *
       * @param {boolean} resetTimeout
       * @return {Promise}
       */
      updateRepos (resetTimeout = false) {
        if (resetTimeout) {
          this.resetTimeout();
        }

        if (this.updatingRepos) {
          /* Currently updating - don't duplicate */
          logger('trace', 'Repo update - currently in progress');

          return Promise.resolve();
        }

        this.updatingRepos = true;

        logger('trace', 'Repo update - starting');

        return this.$store.dispatch('loadLatestStatus')
          .then((result) => {
            logger('trace', 'Repo update - finished');

            this.lastChecked = moment();
            this.updatingRepos = false;

            return result;
          })
          .catch((err) => {
            logger('trace', 'Repo update - error', {
              err,
            });

            this.lastChecked = moment();
            this.updatingRepos = false;

            return Promise.reject(err);
          });
      },

    },

  };
</script>

<style lang="scss">

  #app-layout {
    main {
      height: 200px;
      overflow: {
        y: scroll;
      }
    }
  }

</style>
