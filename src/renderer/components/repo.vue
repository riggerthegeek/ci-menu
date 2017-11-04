<template lang="jade">
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
            :disabled="!auth",
            :rules="conditionalRequired",
            :required="auth"
          )

          v-text-field(
            :label="$t('repo:PASSWORD')",
            v-model="password",
            type="password",
            :disabled="!auth",
            :rules="conditionalRequired",
            :required="auth"
          )

          v-btn(
            color="primary",
            @click="getRepos",
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
        auth: false,
        conditionalRequired: [
          (value) => {
            if (!this.auth) {
              return true;
            }

            return !!value || this.$i18n.t('common:REQUIRED');
          },
        ],
        repos: [],
        valid: false,
        url: '',
        urlRules: [
          value => !!value || this.$i18n.t('common:REQUIRED'),
        ],
      };
    },

    methods: {

      getRepos () {
        if (!this.$refs.form.validate()) {
          return undefined;
        }

        return this.$store.dispatch('queryRepo', {
          url: this.url,
        }).then(({ repos }) => {
          if (repos.length === 0) {
            throw new Error('NO_REPOS');
          }

          this.repos = repos;
        }).catch((err) => {
          console.log({
            err,
          });
        });
      },

    },

  };
</script>
