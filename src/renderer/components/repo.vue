<template lang="jade">
  div
    v-alert(
      color="danger",
      icon="check_circle",
      value="true",
      transition="scale-transition"
      v-if="error"
    ) {{ $t('error:' + (error.message || 'UNKNOWN')) }}

    v-container(
      fluid
      grid-list-md
    )
      v-layout(
        row
        wrap
      )
        v-flex

          v-stepper(
            v-model="step",
            vertical
          )

            v-stepper-step(
              step="1",
              :editable="step > 1",
              v-bind:complete="step > 1"
            ) {{ $t('repo:STEP_1') }}
              small {{ url }}

            v-stepper-content(
              step="1"
            )

              v-form(
                v-model="valid"
                ref="form"
                lazy-validation
              )

                v-text-field(
                  :label="$t('repo:URL')",
                  required,
                  :rules="urlRules",
                  v-model="settings.url"
                )

                v-switch(
                  :label="$t('repo:REQUIRES_AUTH')",
                  v-model="settings.auth"
                )

                v-text-field(
                  :label="$t('repo:USERNAME')",
                  v-model="settings.username",
                  v-if="settings.auth",
                  :rules="conditionalRequired",
                  :required="settings.auth"
                )

                v-text-field(
                  :label="$t('repo:PASSWORD')",
                  v-model="settings.password",
                  type="password",
                  v-if="settings.auth",
                  :rules="conditionalRequired",
                  :required="settings.auth"
                )

                v-btn(
                  color="primary",
                  @click="getRepos",
                ) {{ $t('buttons:NEXT') }}

            v-stepper-step(
              step="2",
              :editable="step > 2",
              v-bind:complete="step > 2"
            ) {{ $t('repo:STEP_2') }}

            v-stepper-content(
              step="2"
            )

              v-switch(
                :label="$t('repo:SHOW_ALL_REPOS')",
                v-model="settings.allRepos"
              )

              v-checkbox(
                v-for="repo in repos",
                :label="repo.name",
                :value="repo.name",
                v-model="settings.reposToAdd",
                v-if="!settings.allRepos"
              )

              v-btn(
                color="primary",
                @click.native="step = 3",
              ) {{ $t('buttons:NEXT') }}

            v-stepper-step(
              step="3",
              v-bind:complete="step > 3"
            ) {{ $t('repo:STEP_3') }}

            v-stepper-content(
              step="3"
            )

              v-checkbox(
                v-for="repo in repos",
                :label="repo.name",
                :value="repo.name",
                v-model="settings.reposToIgnore"
              )

              v-btn(
                color="primary",
                @click="save",
              ) {{ $t('buttons:SAVE') }}

</template>

<script>
  /**
   * repo
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {

    created () {
      this.$store.subscribe(({ type }) => {
        if (type === 'updateRepoSettings') {
          this.load();
        }
      });

      this.load();
    },

    data () {
      return {
        conditionalRequired: [
          (value) => {
            if (!this.auth) {
              return true;
            }

            return !!value || this.$i18n.t('common:REQUIRED');
          },
        ],
        editable: false,
        error: false,
        repoId: null,
        repos: [],
        settings: {
          allRepos: true,
          auth: false,
          password: '',
          reposToAdd: [],
          reposToIgnore: [],
          url: '',
          username: '',
        },
        step: 0,
        urlRules: [
          value => !!value || this.$i18n.t('common:REQUIRED'),
        ],
        valid: false,
      };
    },

    methods: {

      getRepos () {
        if (!this.$refs.form.validate()) {
          return undefined;
        }

        return this.$store.dispatch('queryRepo', {
          auth: {
            active: this.settings.auth,
            password: this.settings.password,
            username: this.settings.username,
          },
          url: this.settings.url,
        }).then(({ repos }) => {
          if (repos.length === 0) {
            throw new Error('NO_REPOS');
          }

          this.repos = repos;
          this.step = 2;
        }).catch((err) => {
          this.error = err;
        });
      },

      load () {
        this.repoId = this.$route.query.repoId;

        if (!this.repoId || this.editable) {
          /* Already loaded - don't reload */
          return;
        }

        this.editable = this.$store.getters.repoSettings
          .find(({ id }) => id === this.repoId);

        if (!this.editable) {
          this.error = new Error('UNKNOWN_REPO');
          return;
        }

        this.error = false;
        this.settings = {
          allRepos: this.editable.all,
          auth: this.editable.auth.active,
          password: this.editable.auth.password,
          reposToIgnore: this.editable.ignore,
          reposToAdd: this.editable.repos.map(({ name }) => name),
          url: this.editable.url,
          username: this.editable.username,
        };
      },

      save () {
        const data = {
          all: this.settings.allRepos,
          auth: {
            active: this.settings.auth,
            password: this.settings.password,
            username: this.settings.username,
          },
          ignore: this.settings.reposToIgnore,
          repos: this.settings.reposToAdd.map(name => ({ name })),
          url: this.settings.url,
        };

        if (data.all) {
          data.repos = [];
        }

        return this.$store.dispatch('saveRepo', {
          data,
          id: this.repoId,
        }).then(() => this.$router.push({
          name: 'projects',
        }));
      },

    },

    watch: {

      allRepos () {
        if (this.allRepos) {
          this.repos.forEach(({ name }) => {
            this.reposToAdd.push(name);
          });
        }
      },

    },

  };
</script>
