<template lang="jade">
  div
    div(
      v-if='loading'
    ) loading...

    v-list(
      v-else-if="repos.length > 0"
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
            img(
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
      this.fetchData();

      /* Watch for changes to the repo store */
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'updateRepos') {
          this.fetchData();
        }
      });
    },

    data () {
      return {
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
              const status = repo.lastBuildStatus.toLowerCase();

              result.push({
                img: this.statusToImgName(status),
                status,
                title: repo.name,
                url: repo.webUrl,
              });
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

        this.loading = false;
        this.repos = repositories.reduce((result, repo) => {
          result.push(repo);
          result.push({
            divider: true,
          });

          return result;
        }, []);
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

      statusToImgName (status) {
        const statuses = {
          exception: 'fail',
          failure: 'fail',
          success: 'pass',
          unknown: 'unknown',
        };

        /* Default to unknown */
        return statuses[status] || statuses.unknown;
      },

      statusToImg (status) {
        const path = 'assets/img/statuses/';

        const img = this.statusToImgName(status);

        return `${path}${img}.png`;
      },

    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
