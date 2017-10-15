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
            label="URL",
            required,
            :rules="urlRules",
            v-model="url"
          )

          v-checkbox(
            label="The server requires validation",
            v-model="auth"
          )

          v-text-field(
            label="Username",
            v-model="username",
            :disabled="!auth"
          )

          v-text-field(
            label="Password",
            v-model="password",
            type="password",
            :disabled="!auth"
          )

          v-btn(
            @click="submit",
            :disabled="!valid"
          ) Save
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
        valid: false,
        url: '',
        urlRules: [
          value => !!value || 'Required',
        ],
      };
    },

    methods: {

      submit () {
        if (this.$refs.form.validate()) {
          console.log('yay');
        }
      },

    },

  };
</script>
