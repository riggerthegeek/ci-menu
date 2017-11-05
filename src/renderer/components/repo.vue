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
                  v-model="url"
                )

                v-switch(
                  :label="$t('repo:REQUIRES_AUTH')",
                  v-model="auth"
                )

                v-text-field(
                  :label="$t('repo:USERNAME')",
                  v-model="username",
                  v-if="auth",
                  :rules="conditionalRequired",
                  :required="auth"
                )

                v-text-field(
                  :label="$t('repo:PASSWORD')",
                  v-model="password",
                  type="password",
                  v-if="auth",
                  :rules="conditionalRequired",
                  :required="auth"
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
                v-model="allRepos"
              )

              v-checkbox(
                v-for="repo in repos",
                :label="repo.name",
                :value="repo.name",
                v-model="reposToAdd",
                v-if="!allRepos"
              )

              v-btn(
                color="primary",
                @click.native="step = 3",
              ) {{ $t('buttons:NEXT') }}

            v-stepper-step(
              step="3"
              v-bind:complete="step > 3"
            ) {{ $t('repo:STEP_3') }}

            v-stepper-content(
              step="3"
            )

              v-checkbox(
                v-for="repo in repos",
                :label="repo.name",
                :value="repo.name",
                v-model="reposToIgnore"
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

    data () {
      return {
        allRepos: false,
        auth: false,
        conditionalRequired: [
          (value) => {
            if (!this.auth) {
              return true;
            }

            return !!value || this.$i18n.t('common:REQUIRED');
          },
        ],
        error: false,
        password: '',
        reposToAdd: [],
        reposToIgnore: [],
        repos: [],
        step: 0,
        url: '',
        urlRules: [
          value => !!value || this.$i18n.t('common:REQUIRED'),
        ],
        username: '',
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
            active: this.auth,
            password: this.password,
            username: this.username,
          },
          url: this.url,
        }).then(({ repos }) => {
          if (repos.length === 0) {
            throw new Error('NO_REPOS');
          }

          this.repos = repos;
          this.allRepos = true;
          this.step = 2;
        }).catch((err) => {
          this.error = err;
        });
      },

      save () {
        const data = {
          all: this.allRepos,
          auth: {
            active: this.auth,
            password: this.password,
            username: this.username,
          },
          ignore: this.reposToIgnore,
          repos: this.reposToAdd,
          url: this.url,
        };

        if (data.all) {
          data.repos = [];
        }

        return this.$store.dispatch('addRepo', data)
          .then(() => this.$router.push({
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
