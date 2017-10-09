<template lang="jade">
  v-app(dark)
    v-tabs(dark fixed icons centered)
      v-tabs-bar.grey.darken-4
        v-tabs-slider.yellow
        v-tabs-item(
          v-for="item in pages",
          :to="{ name: item.href }",
          router
        )
          v-icon {{ item.icon }}
          | {{ item.name }}

      v-container(
        grid-list-md
      )
        v-layout(
          row
          wrap
        )
          v-flex(
            xs12
          )
            router-view

    v-footer.pa-3(
      absolute
      fixed
    )
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
