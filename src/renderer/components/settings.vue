<template lang="jade">
  div

    v-alert(
      color="success",
      icon="check_circle",
      value="true",
      transition="scale-transition"
      v-if="saving"
    ) {{ $t('common:SAVED') }}

    v-container(
      fluid
      grid-list-md
    )
      v-layout(
        row
       wrap
      )
        v-flex

          v-slider(
            :label="$t('settings:UPDATE_TIMEOUT')",
            :hint="$t('settings:TIMEOUT_VALUE', { value: data.timeout / 1000 })",
            v-model="data.timeout",
            snap,
            step="5000",
            :min="minTimeout",
            :max="maxTimeout"
          )

          div {{ appName }} v{{ version }}

</template>

<script>
  /**
   * settings
   */

  /* Node modules */

  /* Third-party modules */
  import { remote } from 'electron';

  /* Files */

  export default {

    data () {
      return {
        appName: 'CI Menu',
        data: {
          timeout: this.$store.getters.updateInterval,
        },
        minTimeout: this.$store.getters.minTimeout,
        maxTimeout: 60 * 1000,
        version: remote.app.getVersion(),
      };
    },

    methods: {

      save () {
        return this.$store.dispatch('saveSettings', {
          updateInterval: this.data.timeout,
        });
      },

    },

    watch: {
      'data.timeout': 'save',
    },

  };
</script>
