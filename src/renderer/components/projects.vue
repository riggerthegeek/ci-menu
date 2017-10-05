<template lang="jade">
  v-list
    template(
      v-for="repo in repos"
    )
      v-subheader(
        v-if="repo.header"
        v-text="repo.header"
      )
      v-divider(
        v-else-if="repo.divider"
        v-bind:inset="repo.inset"
      )

      v-list-tile(
        avatar
        v-else
        v-bind:key="repo.title",
        @click="openUrl(repo.url)"
        download
      )

        v-list-tile-avatar
          img(
            v-bind:src="repo.img"
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

    data () {
      return {
        repos: [{
          img: 'assets/img/fail.png',
          title: 'riggerthegeek/ci-menu',
          url: 'https://travis-ci.org/riggerthegeek/ci-menu',
        }, {
          divider: true,
        }],
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

    },

  };
</script>
