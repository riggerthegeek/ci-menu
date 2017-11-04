<template lang="jade">
  v-app#app-layout(dark)

    v-tabs(dark fixed icons centered)
      v-toolbar.header(app dense)

        v-toolbar-title.white--text {{ $t('common:APP_NAME') }}

        v-spacer

        v-tooltip(
          v-for="button in buttons"
          open-delay="1000"
          bottom
        )
          v-btn.btn--v-small(
            icon,
            :color="button.color",
            @click="button.action",
            slot="activator"
          )
            v-icon {{ button.icon }}

          span {{ button.tooltip }}

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
      div {{ $t('common:LAST_CHECKED') }}:&nbsp;
        span( v-if="lastChecked") {{ lastChecked.format('HH:mm:ss') }}
        span( v-else ) -

        v-tooltip(
          v-for="button in toolbar"
          open-delay="1000"
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

  function isBuilding (repo) {
    const activity = repo.activity.toLowerCase();
    const status = repo.lastBuildStatus.toLowerCase();
    const building = activity === 'building' || !repo.lastBuildTime;

    return {
      building,
      status,
    };
  }

  export default {

    created () {
      this.updateRepos(true);

      /* Watch for changes to the repo store */
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'updateSettings') {
          this.updateRepos(true);
        }
      });
    },

    data () {
      const i18n = this.$i18n.i18next;

      return {
        buttons: [{
          action: () => remote.getCurrentWindow().minimize(),
          color: 'orange black--text',
          icon: 'remove',
          tooltip: i18n.t('common:MINIMISE_WINDOW'),
        }, {
          action: () => remote.getCurrentWindow().hide(),
          color: 'red black--text',
          icon: 'close',
          tooltip: i18n.t('common:CLOSE_WINDOW'),
        }],
        history: {},
        interval: null,
        lastChecked: null,
        pages: [{
          href: 'projects',
          icon: 'folder',
          name: i18n.t('components:PROJECTS'),
        }, {
          href: 'alerts',
          icon: 'alarm',
          name: i18n.t('components:ALERTS'),
        }, {
          href: 'settings',
          icon: 'settings',
          name: i18n.t('components:SETTINGS'),
        }],
        repos: {},
        toolbar: [{
          action: () => this.updateRepos(true),
          color: 'green black--text',
          icon: 'refresh',
          tooltip: i18n.t('common:UPDATE_REPOS'),
        }, {
          action: () => this.newRepo(),
          color: 'red white--text',
          icon: 'add',
          tooltip: i18n.t('common:ADD_REPO'),
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
        } else if (this.updatingRepos) {
          /* Currently updating - don't duplicate */
          logger('trace', 'Repo update - currently in progress');

          return Promise.resolve();
        }

        logger('trace', 'Repo update - starting');

        this.updatingRepos = true;

        this.history = this.repos;

        return this.$store.dispatch('loadLatestStatus')
          .then((data) => {
            logger('trace', 'Repo update - finished');

            /* Add the repo status */
            this.repos = data.reduce((result, { repos }) => {
              repos.forEach((repo) => {
                result[repo.name] = repo;

                const history = this.history[repo.name];

                if (history) {
                  const states = {
                    history: isBuilding(history),
                    latest: isBuilding(repo),
                  };

                  if (states.history.building && !states.latest.building) {
                    /* We've just finished building */
                    logger('info', 'Building has finished', {
                      repo,
                      history,
                    });

                    this.$store.dispatch('notify', {
                      i18n: this.$i18n,
                      newState: repo,
                      oldState: history,
                    });
                  }
                }
              });

              return result;
            }, {});

            this.lastChecked = moment();
            this.updatingRepos = false;

            return data;
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

  .header {
    -webkit-app-region: drag;
    -webkit-user-select: none;

    .tooltip {
      -webkit-app-region: no-drag;
    }
  }

  #app-layout {
    main {
      height: 200px;
      overflow: {
        y: auto;
      }
    }
  }

</style>
