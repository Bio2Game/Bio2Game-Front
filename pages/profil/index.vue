<template>
  <div class="animation-container">
    <div class="block">
      <div class="head">
        <h5>Informations</h5>
      </div>
      <div class="content">
        <div class="part mr-3">
          <InputElement
            v-model="basics.username"
            :value="basics.username"
            type="text"
            placeholder="Pseudonyme"
            :error="filtredErrors('username')"
          />
          <InputElement
            v-model="basics.email"
            :value="basics.email"
            type="email"
            placeholder="Adresse email"
            :error="filtredErrors('email')"
          />
          <InputElement
            v-model="basics.old_password"
            type="password"
            placeholder="Ancien mot de passe"
            :error="filtredErrors('old_password')"
          />
          <InputElement
            v-model="basics.password"
            type="password"
            placeholder="Nouveau mot de passe"
            :error="filtredErrors('password')"
          />
          <AnimatorSelectorElement @input="complete.animators = $event" />

          <p class="additional-info">
            En sélectionnant un enseignant, vous acceptez qu'il ai accès à vos
            résultats.
          </p>
        </div>
        <div class="part">
          <InputElement
            v-model="basics.name"
            :value="basics.name"
            type="text"
            name="name"
            placeholder="Nom complet"
            :error="filtredErrors('name')"
          />
          <InputElement
            v-model="basics.birth_date"
            :value="formatDate(basics.birth_date)"
            type="date"
            placeholder="Date de naissance"
            :error="filtredErrors('birth_date')"
          />
          <SelectorElement
            v-model="basics.sex"
            :selected="basics.sex"
            :items="sexes"
            :default-value="0"
            placeholder="Sexe"
          />

          <InputElement
            v-model="basics.localisation"
            :value="basics.localisation"
            type="text"
            placeholder="Localisation"
            :error="filtredErrors('localisation')"
          />
          <a class="button md green" @click="update(basics)">Sauvegarder</a>
        </div>
      </div>
    </div>
    <div v-if="$auth.user.status" class="block">
      <div class="head">
        <h5>Informations de contributeur</h5>
      </div>
      <div class="content">
        <div class="part mr-3">
          <SelectorElement
            v-model="complete.contributor_type"
            :selected="complete.contributor_type"
            :items="types"
            placeholder="Contributeur"
          />
          <InputElement
            v-model="complete.contributor_mobile"
            :value="complete.contributor_mobile"
            type="tel"
            placeholder="Numéro de téléphone (Contributeur)"
            :error="filtredErrors('contributor_mobile')"
          />
          <InputElement
            v-model="complete.website"
            :value="complete.website"
            type="url"
            placeholder="Site web (Contributeur)"
            :error="filtredErrors('website')"
          />
        </div>
        <div class="part">
          <TextareaElement
            v-model="complete.description"
            :value="complete.description"
            placeholder="Description"
            :error="filtredErrors('description')"
            :max="400"
          />

          <CheckboxElement
            class="is_animator"
            :checked="complete.is_animator"
            label="Enseignant ?"
            :disabled="!$auth.user.status"
            @input="complete.is_animator = $event"
          />
          <a class="button md green" @click="update(complete)">Sauvegarder</a>
        </div>
      </div>
    </div>
    <div v-else class="become-contributor-zone">
      <nuxt-link to="/profil/become" class="before button md green">
        Devenir contributeur
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  transition: 'left',
  data() {
    return {
      basics: {
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        name: '',
        birth_date: '',
        sex: '',
        localisation: '',
      },
      complete: {
        contributor_type: null,
        contributor_mobile: '',
        website: '',
        description: '',
        is_animator: false,
      },
      errors: [],
      sexes: [
        {
          ref: 1,
          name: 'Homme',
        },
        {
          ref: 2,
          name: 'Femme',
        },
        {
          ref: 3,
          name: 'Autre',
        },
      ],
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
  mounted() {
    this.basics = {
      username: this.$auth.user.username,
      email: this.$auth.user.email,
      password: '',
      password_confirmation: '',
      name: this.$auth.user.name || '',
      birth_date: this.$auth.user.birth_date,
      sex: this.$auth.user.sex,
      localisation: this.$auth.user.localisation,
    }
    this.complete = {
      contributor_type: this.$auth.user.status
        ? this.$auth.user.contributor_type
        : '',
      contributor_mobile: this.$auth.user.status
        ? this.$auth.user.contributor_mobile
        : '',
      website: this.$auth.user.status ? this.$auth.user.website : '',
      description: this.$auth.user.description || '',
      is_animator: this.$auth.user.is_animator
        ? this.$auth.user.is_animator
        : false,
    }
  },
  methods: {
    formatDate(date) {
      return date
    },
    filtredErrors(field) {
      return this.errors.find((error) => error.field === field)
    },
    async update(payload) {
      try {
        await this.$axios.$patch('/api/user', payload)
        this.$notify({
          type: 'success',
          text: 'Vos informations ont été mises à jour !',
          duration: 3000,
          width: 400,
        })
        await this.$auth.fetchUser()
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
.become-contributor-zone {
  margin-top: 24px;
  display: flex;
  justify-content: center;

  .button {
    min-width: 220px;
  }
}
</style>
