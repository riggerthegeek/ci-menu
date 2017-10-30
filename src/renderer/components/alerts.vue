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

          v-form(
            ref="form"
            lazy-validation
          )

            v-select(
              :items="alertOpts",
              :label="$t('notifications:WHEN_TO_ALERT')",
              v-model="data.notify",
              prepend-icon="warning"
            )

            v-switch(
              :label="$t('notifications:SHOW_DND')"
              v-model="data.dnd",
              v-if="data.notify !== 'never'"
            )

            div(
              v-if="data.dnd && data.notify !== 'never'",
            )

              v-select(
                :label="$t('notifications:DND_START')"
                v-model="data.dndStart",
                :items="times",
                prepend-icon="access_time"
              )

              v-select(
                :label="$t('notifications:DND_END')"
                v-model="data.dndEnd",
                :items="times",
                prepend-icon="access_time"
              )

</template>

<script>
  /**
   * projects
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {

    data () {
      const state = {
        id: 'id',
        status: 'success',
        title: 'hello/world',
      };
      const previousState = {
        status: 'fail',
      };

      this.$store.dispatch('notify', {
        i18n: this.$i18n,
        newState: state,
        oldState: previousState,
      });


      const times = [];

      for (let hour = 0; hour < 24; hour += 1) {
        for (let mins = 0; mins < 60; mins += 30) {
          const time = {
            hour,
            mins,
          };

          if (time.hour < 10) {
            time.hour = `0${time.hour}`;
          }

          if (time.mins < 10) {
            time.mins = `0${time.mins}`;
          }

          times.push(`${time.hour}:${time.mins}`);
        }
      }

      return {
        alertOpts: this.$store.getters.notifyOpts.map(value => ({
          text: this.$i18n.t(`notifications:OPT_${value.toUpperCase()}`),
          value,
        })),
        data: this.$store.getters.notify,
        saving: false,
        times,
      };
    },

    methods: {

      save () {
        this.saving = true;

        setTimeout(() => {
          this.saving = false;
        }, 5000);

        return this.$store.dispatch('saveNotification', this.data);
      },

    },

    watch: {
      'data.dnd': 'save',
      'data.dndEnd': 'save',
      'data.dndStart': 'save',
      'data.notify': 'save',
    },

  };
</script>
