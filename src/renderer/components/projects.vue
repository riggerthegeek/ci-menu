<template lang="jade">
  div
    .text-xs-center.pa-5(
      v-if='loading'
    )
      v-progress-circular(
        indeterminate
        color="yellow"
        size="100"
      )

    div(v-else)

      v-list(
        v-if="repos.length > 0"
      )
        template(
          v-for="repo in repos"
        )
          v-subheader(
            v-if="repo.header"
            v-text="repo.header"
          )
          v-divider(
            v-else-if="repo.divider",
            :inset="repo.inset"
          )

          v-list-tile(
            avatar,
            v-else,
            :key="repo.title",
            :href="repo.url"
          )

            v-list-tile-avatar
              v-progress-circular(
                v-if="repo.isBuilding",
                indeterminate,
                color="primary",
                :size="40",
                :width="5"
              )

              img(
                v-else,
                :src="statusToImg(repo.status)"
              )

            v-list-tile-content
              v-list-tile-title(
                v-html="repo.title"
              )
              v-list-tile-sub-title(
                v-html="repo.subtitle"
              )

            v-list-tile-action(
              @click.prevent="edit(repo)"
            )
              v-btn(
                icon
                ripple
              )
                v-icon edit

</template>

<script>
  /**
   * projects
   */

  /* Node modules */

  /* Third-party modules */
  import { remote, shell } from 'electron';

  /* Files */

  export default {

    created () {
      /* Watch for changes to the repo store */
      this.$store.subscribe((mutation) => {
        switch (mutation.type) {
          case 'updateRepos':
            this.fetchData();
            break;

          default:
            break;
        }
      });

      if (this.$store.getters.updated) {
        /* The store has been updated - get the data onload */
        this.fetchData();
      }
    },

    data () {
      return {
        history: {},
        loading: true,
        repos: [],
      };
    },

    methods: {

      edit (repo) {
        console.log(`edit ${repo.title}`);
      },

      fetchData () {
        const repositories = this.$store.getters.repos
          .reduce((result, { repos }) => {
            repos.forEach((repo) => {
              const activity = repo.activity.toLowerCase();
              const status = repo.lastBuildStatus.toLowerCase();
              const isBuilding = activity === 'building' || !repo.lastBuildTime;

              const state = {
                activity,
                id: repo.lastBuildLabel,
                img: this.statusToImgName(status, isBuilding),
                isBuilding,
                status,
                title: repo.name,
                url: repo.webUrl,
              };

              result.push(state);

              const previousState = this.history[repo.name] || {};

              if (!isBuilding && previousState.isBuilding) {
                /* We've just finished building */
                this.$store.dispatch('notify', {
                  i18n: this.$i18n,
                  newState: state,
                  oldState: previousState,
                });
              }
            });

            return result;
          }, [])
          .sort((a, b) => {
            if (a.title < b.title) {
              return -1;
            } else if (a.title > b.title) {
              return 1;
            }

            return 0;
          });

        /* Update the tray */
        remote.app.emit('update-repos', repositories);

        const previousState = this.repos.reduce((result, repo) => {
          if (repo.title) {
            result[repo.title] = repo;
          }

          return result;
        }, {});

        this.loading = false;
        this.repos = repositories.reduce((result, repo) => {
          result.push(repo);
          result.push({
            divider: true,
          });

          return result;
        }, []);

        /* Set the history after the repos - timing issue if before */
        this.history = previousState;
      },

      /**
       * Open URL
       *
       * Opens a URL in the default browser
       *
       * @param {string} url
       * @returns {boolean}
       */
      openUrl (url) {
        return shell.openExternal(url);
      },

      statusToImgName (status, building = false) {
        const statuses = {
          building: 'building',
          exception: 'fail',
          failure: 'fail',
          success: 'pass',
          unknown: 'unknown',
        };

        if (building) {
          status = 'building';
        }

        /* Default to unknown */
        return statuses[status] || statuses.unknown;
      },

      statusToImg (status) {
        const path = 'assets/img/statuses/';

        const img = this.statusToImgName(status);

        return `${path}${img}.png`;
      },

    },

  };
</script>
