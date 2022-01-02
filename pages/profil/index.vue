<template>
  <div class="animation-container">
    <div class="block">
      <div class="head">
        <h5>Informations principales</h5>
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
            v-model="basics.name"
            :value="basics.name"
            type="text"
            name="name"
            placeholder="Nom complet"
            :error="filtredErrors('name')"
          />
          <TextareaElement
            v-model="basics.description"
            :value="basics.description"
            placeholder="Description"
            :error="filtredErrors('description')"
          />
        </div>
        <div class="part">
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
          <a class="button md green" @click="update(basics)">Sauvegarder</a>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="head">
        <h5>Informations secondaires</h5>
      </div>
      <div class="content">
        <div class="part mr-3">
          <InputElement
            v-model="complete.birth_date"
            :value="formatDate(complete.birth_date)"
            type="date"
            placeholder="Date de naissance"
            :error="filtredErrors('birth_date')"
          />
          <SelectorElement
            v-model="complete.sex"
            :selected="complete.sex"
            :items="sexes"
            :default-value="0"
            placeholder="Sexe"
          />

          <InputElement
            v-model="complete.localisation"
            :value="complete.localisation"
            type="text"
            placeholder="Localisation"
            :error="filtredErrors('localisation')"
          />
          <AnimatorSelectorElement @input="complete.animators = $event" />

          <p class="additional-info">
            En sélectionnant un animateur, vous acceptez qu'il ai accès à vos
            résultats.
          </p>
        </div>
        <div class="part">
          <SelectorElement
            v-model="complete.contributor_type"
            :selected="complete.contributor_type"
            :items="types"
            placeholder="Contributeur"
            :disabled="!$auth.user.status"
          />
          <InputElement
            v-model="complete.contributor_mobile"
            :value="complete.contributor_mobile"
            type="tel"
            placeholder="Numéro de téléphone (Contributeur)"
            :error="filtredErrors('contributor_mobile')"
            :disabled="!$auth.user.status"
          />
          <InputElement
            v-model="complete.website"
            :value="complete.website"
            type="url"
            placeholder="Site web (Contributeur)"
            :error="filtredErrors('website')"
            :disabled="!$auth.user.status"
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
        name: '',
        description: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      complete: {
        sex: '',
        birth_date: '',
        contributor_mobile: '',
        website: '',
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
      name: this.$auth.user.name || '',
      description: this.$auth.user.description || '',
      email: this.$auth.user.email,
      password: '',
      password_confirmation: '',
    }
    this.complete = {
      sex: this.$auth.user.sex,
      birth_date: this.$auth.user.birth_date,
      current_animators_ids: [],
      contributor_mobile: this.$auth.user.status
        ? this.$auth.user.contributor_mobile
        : '',
      contributor_type: this.$auth.user.status
        ? this.$auth.user.contributor_type
        : '',
      website: this.$auth.user.status ? this.$auth.user.website : '',
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
