<template>
  <div>{{ $route.params.social }}</div>
</template>

<script>
export default {
  validate({ params }) {
    return ['google', 'linkedin', 'facebook'].includes(params.social)
  },
  async mounted() {
    try {
      const { user, token } = await this.$axios.$get(
        `/api${this.$route.fullPath}`
      )

      this.$auth.strategy.token.set(token)
      this.$auth.setUser(user)

      return this.$router.push({ path: '/' })
    } catch (error) {
      console.log(error)
      if ([401, 408].includes(error.response.status)) {
        this.$notify({
          type: 'error',
          text:
            error.response.status === 401
              ? 'La connexion a été refusée !'
              : 'Le délais maximum a été dépassé !',
          duration: 3000,
          width: 400,
        })
        return this.$router.push({ path: '/' })
      }
      // eslint-disable-next-line no-console
      console.error(error)

      return this.$notify({
        type: 'error',
        text: "Une erreur inconnue s'est produite lors de la connexion",
        duration: 3000,
        width: 400,
      })
    }
  },
}
</script>
