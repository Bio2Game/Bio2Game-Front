<template>
  <div class="animation-container">
    <div class="block">
      <div class="head">
        <h5>Devenir contributeur</h5>
      </div>
      <div class="content column">
        <InputElement
          v-model="become.name"
          :value="become.name"
          type="text"
          placeholder="Nom du groupe, association, entreprise"
          :error="filtredErrors('name')"
        />
        <SelectorElement
          v-model="become.contributor_type"
          :selected="become.contributor_type"
          :items="types"
          noSelect="Contributeur"
        />
        <InputElement
          v-model="become.contributor_mobile"
          :value="become.contributor_mobile"
          type="tel"
          placeholder="Numéro de téléphone (Optionel)"
          :error="filtredErrors('contributor_mobile')"
        />
        <InputElement
          v-model="become.website"
          :value="become.website"
          type="url"
          placeholder="Site web"
          :error="filtredErrors('website')"
        />
        <a class="button md green" @click="register(become)">Sauvegarder</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Become',
  transition: 'left',
  data() {
    return {
      become: {
        name: '',
        contributor_type: null,
        contributor_mobile: '',
        is_animator: true,
        website: '',
        status: 1,
      },
      errors: [],
      types: [
        {
          ref: 1,
          name: 'Association',
        },
        {
          ref: 2,
          name: 'Expert',
        },
        {
          ref: 3,
          name: 'Institution',
        },
        {
          ref: 4,
          name: 'Marque',
        },
        {
          ref: 5,
          name: 'Producteur',
        },
      ],
    }
  },
  methods: {
    filtredErrors(field) {
      return this.errors.find(error => error.field === field)
    },
    async register(payload) {
      try {
        await this.$axios.$patch('/api/user', { ...payload, status: 1 })
        this.$notify({
          type: 'success',
          text: 'Vous êtes maintenant contributeur !',
          duration: 3000,
          width: 400,
        })
        await this.$auth.fetchUser()
        this.$router.push('/profil')
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
.content.column {
  flex-direction: column;
}
</style>
