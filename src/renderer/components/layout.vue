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
</template>

<script>
  /**
   * layout
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {
    data () {
      return {
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
  };
</script>
