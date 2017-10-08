<template lang="jade">
  div
    div(
      v-if='loading'
    ) loading...

    v-list(
      v-else
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
          @click="openUrl(repo.url)"
          download
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
</template>

<script>
  /**
   * projects
   */

  /* Node modules */

  /* Third-party modules */
  import { shell } from 'electron';

  /* Files */

  export default {

    created () {
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'updateRepos') {
          this.repos = this.$store.getters.repos.reduce((result, { repos }) => {
            repos.forEach((repo) => {
              result.push({
                status: repo.lastBuildStatus,
                title: repo.name,
                url: repo.webUrl,
              });

              result.push({
                divider: true,
              });
            });

            return result;
          }, []);

          this.loading = false;
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

      statusToImg (status) {
        const path = 'assets/img/';
        const statuses = {
          exception: 'fail.png',
          failure: 'fail.png',
          success: 'pass.png',
          unknown: 'unknown.png',
        };

        const img = statuses[status.toLowerCase()];

        return `${path}${img}`;
      },

    },

  };
</script>
