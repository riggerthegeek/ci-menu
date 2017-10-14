<template lang="jade">
  v-app#app-layout(dark)

    v-tabs(dark fixed icons centered)
      v-toolbar(app)
        v-toolbar-title.white--text CI Menu
        v-spacer
        v-btn(icon)
          v-icon refresh

      v-tabs-bar.grey.darken-4
        v-tabs-slider.yellow
        v-tabs-item(
          v-for="page in pages",
          :to="{ name: page.href }"
          router
        )
          v-icon {{ page.icon }}
          | {{ page.name }}

    main
      v-content
        router-view
          v-container(fluid)

    v-footer(app)
      div Last checked:&nbsp;
        span( v-if="lastChecked") {{ lastChecked.format('HH:mm:ss') }}
        span( v-else ) -

      v-spacer
      div &copy; {{ copyrightDate() }}
</template>

<script>
  /**
   * layout
   */

  /* Node modules */

  /* Third-party modules */
  import moment from 'moment';

  /* Files */

  export default {

    created () {
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'updateRepos') {
          this.lastChecked = moment();
        }
      });
    },

    data () {
      return {
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
      };
    },

    methods: {

      copyrightDate () {
        const startYear = 2017;
        const currentYear = new Date().getUTCFullYear();

        if (currentYear > startYear) {
          return `${startYear} - ${currentYear}`;
        }

        return currentYear;
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
