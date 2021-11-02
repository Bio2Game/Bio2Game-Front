<template>
  <div class="block password-change">
    <div class="head">
      <div class="infos">
        <h5>Mot de passe</h5>
        <p>
          {{
            user
              ? `Changer le mot de passe de ${user.username}`
              : 'Changement de mot de passe.'
          }}
        </p>
      </div>
    </div>
    <div class="content">
      <div v-if="user" class="user">
        <InputElement
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          :error="filtredErrors('password')"
        />
        <InputElement
          v-model="password_confirmation"
          type="password"
          placeholder="Confirmation du mot de passe"
          :error="filtredErrors('password_confirmation')"
        />

        <a class="button green sm full" @click="changePassword()"
          >Changer le mot de passe</a
        >
      </div>
      <div v-else class="no-elements">
        <h3>Utilisateur inconnu</h3>
        <p>Cet utilisateur n'existe pas !</p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

moment.locale('fr')

export default {
  name: 'Password',
  transition: 'left',
  middleware: ['auth', 'admin'],
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch({ params, store, error }) {
    try {
      await store.dispatch('admin/fetchUsers')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch users on the Bio2Game API',
      })
    }
  },
  data() {
    return {
      errors: [],
      password: '',
      password_confirmation: '',
    }
  },
  computed: {
    user() {
      return this.$store.getters['admin/getNoAdminUser'](
        Number(this.$route.params.id),
      )
    },
  },
  methods: {
    filtredErrors(field) {
      return this.errors.find(error => error.field === field)
    },
    async changePassword() {
      try {
        await this.$store.dispatch('admin/updateUser', {
          id: this.user.id,
          password: this.password,
          password_confirmation: this.password_confirmation,
        })
        this.$notify({
          type: 'success',
          text: `Le mot de passe de ${this.user.username} a bien été changé !`,
          duration: 3000,
          width: 400,
        })
        this.$router.push('/admin/users')
      } catch (err) {
        const messages = err.response.data.messages
        if (messages) {
          this.errors = messages.errors
        }
      }
    },
  },
}
</script>

<style lang="scss">
.password-change {
  max-width: 500px;
  width: 100%;

  .content {
    min-height: 0 !important;

    .user {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }
}
</style>
