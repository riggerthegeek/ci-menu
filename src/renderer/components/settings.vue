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

        v-flex(xs12)

          v-slider(
            :label="$t('settings:UPDATE_TIMEOUT')",
            :hint="$t('settings:TIMEOUT_VALUE', { value: data.timeout / 1000 })",
            v-model="data.timeout",
            snap,
            step="5000",
            :min="minTimeout",
            :max="maxTimeout"
          )

          v-data-table(
            hide-actions,
            hide-headers,
            :no-data-text="$t('settings:NO_REPOS')",
            :items="repoSettings"
          )

            template(
              slot="items"
              scope="props"
            )

              td(
                width="10%"
              )

                v-btn(
                  small
                  fab
                  color="red",
                  @click.native.stop="dialog = true; activeId = props.item.id;"
                )
                  v-icon delete

              td.pointer(
                @click="editRepo(props.item.id)"
              ) {{ props.item.url }}

          v-dialog(
            v-model="dialog",
            lazy
          )

            v-card
              v-card-title.headline {{ $t('settings:DELETE_REPO') }}
              v-card-text {{ getRepo(activeId).url }}
              v-card-text {{ $t('settings:DO_YOU_WANT_TO_DELETE_REPO') }}
              v-card-actions
                v-spacer
                v-btn(
                  color="gray darken-1",
                  flat,
                  @click.native="dialog = false"
                ) {{ $t('buttons:CANCEL') }}
                v-btn(
                  color="red darken-1",
                  @click="deleteRepo(activeId)"
                ) {{ $t('buttons:OK') }}

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
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'updateRepoSettings') {
          this.repoSettings = this.$store.getters.repoSettings;
        }
      });

      return {
        activeId: null,
        data: {
          timeout: this.$store.getters.updateInterval,
        },
        dialog: false,
        minTimeout: this.$store.getters.minTimeout,
        maxTimeout: 60 * 1000,
        repoSettings: this.$store.getters.repoSettings,
        version: remote.app.getVersion(),
      };
    },

    methods: {

      deleteRepo (repoId) {
        return this.$store.dispatch('deleteRepo', repoId)
          .then(() => {
//            this.dialog = false;
          });
      },

      editRepo (repoId) {
        return this.$router.push({
          name: 'repo',
          query: {
            repoId,
          },
        });
      },

      getRepo (repoId) {
        return this.repoSettings.find(({ id }) => repoId === id) || {};
      },

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

<style lang="scss">
  .pointer {
    cursor: pointer;
  }
</style>
