<template>
  <div class="container formations">
    <div
      class="block question right-data"
      :right-data="formation.id ? 'Formation N°' + formation.id : ''"
    >
      <div class="head">
        <InputElement
          :value="get('label')"
          type="text"
          name="label"
          class="white_label"
          placeholder="Libélé"
          :max="30"
          :error="filtredErrors('label')"
          @input="label = $event"
        />
        <SelectorElement
          class="white_label"
          :selected="get('level')"
          :items="profils"
          :error="filtredErrors('level')"
          placeholder="Profil du public"
          @input="level = $event"
        />
        <DomainsSelector
          :selected="get('domain_id')"
          class="white_label"
          placeholder="Domaine"
          :error="filtredErrors('domainId')"
          @input="domain_id = $event"
        />
        <div class="button md equal border_white" @click="status = !status">
          {{ get('status') ? 'Publique' : 'Privé' }}
        </div>
      </div>
      <div class="content">
        <div class="parts">
          <div class="part">
            <TextareaElement
              id="formation-textarea"
              :value="get('description')"
              type="text"
              name="description"
              placeholder="Description"
              :error="filtredErrors('description')"
              :counter="true"
              :max="250"
              @input="description = $event"
            />
          </div>
          <div class="part">
            <SelectorElement
              :selected="get('duration')"
              :items="durations"
              :error="filtredErrors('duration')"
              placeholder="Durée"
              @input="duration = $event"
            />
            <InputElement
              :value="get('leaves')"
              type="number"
              placeholder="Impact positif sur la nature"
              :error="filtredErrors('leaves')"
              :min="0"
              :max="5"
              @input="leaves = $event"
            />
          </div>
        </div>
        <client-only>
          <MarkdownEditor
            :value="get('content')"
            placeholder="Contenu de la formation"
            :error="filtredErrors('content')"
            :quizzes="quizzes"
            :formations="true"
            @input="content = $event"
          />
        </client-only>
      </div>
    </div>
    <div class="buttons-bar">
      <nuxt-link class="button green lg" to="/contributeur/formations">
        Mes formations
      </nuxt-link>
      <div class="button green lg" @click="createFormation()">Sauvegarder</div>
      <div class="button green lg" @click="deleteFormation()">Supprimer</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import MarkdownEditor from '@/components/elements/MarkdownEditor'

moment.locale('fr')

export default {
  name: 'AdminFormation',
  components: {
    MarkdownEditor,
  },
  middleware: ['auth', 'contributor'],
  async asyncData({ store, error, params }) {
    if (params.formation !== 'create') {
      try {
        if (!/\d/.test(params.formation)) {
          throw new Error('Match failed')
        }
        await store.dispatch('formations/fetchFormations')
        await store.dispatch('quizzes/fetchQuizzes')
      } catch (e) {
        error({
          statusCode: 503,
          message: 'Unable to fetch your formation on the Bio2Game API',
        })
      }
    }
    await store.dispatch('quizzes/fetchQuizzes')
  },
  data() {
    return {
      label: null,
      description: null,
      content: null,
      level: null,
      keyswords: null,
      duration: null,
      leaves: null,
      domain_id: null,
      status: null,
      errors: [],
      durations: [
        {
          name: 'Court',
          ref: 0,
        },
        {
          name: 'Long',
          ref: 1,
        },
      ],
      profils: [
        {
          name: 'Non validé',
          ref: 0,
        },
        {
          name: 'Niveau primaire',
          ref: 1,
        },
        {
          name: 'Niveau secondaire',
          ref: 2,
        },
        {
          name: 'Niveau universitaire',
          ref: 3,
        },
        {
          name: 'Niveau expert',
          ref: 4,
        },
      ],
    }
  },
  computed: {
    formation() {
      return (
        this.$store.state.formations.formations.find(
          f => f.id === Number(this.$route.params.formation),
        ) || {}
      )
    },
    quizzes() {
      return this.$store.state.quizzes.quizzes
    },
    isCreationPage() {
      return this.$route.params.formation === 'create'
    },
    isDataEdited() {
      // eslint-disable-next-line prettier/prettier
      return [ 'label', 'description', 'content', 'level', 'status', 'duration', 'leaves', 'domain_id'
      ].some(v => this.get(v) !== this.formation[v])
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isDataEdited) {
      return next()
    }
    next(
      window.confirm(
        "Vous n'avez pas sauvegardé vos modifications, êtes vous sûr de vouloir quitter la page ?",
      ),
    )
  },
  methods: {
    get(key) {
      return this[key] === null ? this.formation[key] : this[key]
    },
    filtredErrors(field) {
      return this.errors.find(error => error.field === field)
    },
    deleteData() {
      this.label = null
      this.description = null
      this.content = null
      this.level = null
      this.duration = null
      this.leaves = null
      this.domain_id = null
      this.status = null
      this.errors = []
    },
    async createFormation() {
      try {
        await this.$store.dispatch(
          `formations/${this.isCreationPage ? 'create' : 'update'}Formation`,
          {
            id: this.formation.id,
            label: this.get('label'),
            url: this.generateURL(this.get('label')),
            description: this.get('description'),
            content: this.get('content'),
            level: this.get('level'),
            duration: this.get('duration'),
            leaves: this.get('leaves'),
            domain_id: this.get('domain_id'),
            user_id: this.$auth.user.id,
            quizzes: this.findContentQuizzes(this.get('content')),
            status: !!this.get('status') + 0,
          },
        )

        this.$notify({
          type: 'success',
          text: `Votre formation a été ${
            this.formation.id ? 'sauvegardé' : 'créée'
          } avec succès`,
          duration: 3000,
          width: 400,
        })
        this.deleteData()
      } catch (error) {
        console.log(error)
        const messages = error.response.data.messages
        if (messages) {
          this.errors = messages.errors
        }
      }
    },
    async deleteFormation() {
      try {
        await this.$store.dispatch(
          `formations/deleteFormation`,
          this.formation.id,
        )

        return this.$router.push(`/contributeur/formations`)
      } catch (error) {
        console.log(error)
        this.$notify({
          type: 'error',
          text:
            "Une erreur s'est produite lors de la suppression de la question.",
          duration: 3000,
          width: 400,
        })
      }
    },
    generateURL(label = '') {
      /* eslint-disable no-control-regex */
      return label
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\x00-\x7F]+/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
    },
    findContentQuizzes(content) {
      const regex = /{{\s*([\d])+?\s*}}/gm
      const quizzes = []
      let temp
      do {
        temp = regex.exec(content)
        if (temp) {
          quizzes.push(Number(temp[1]))
        }
      } while (temp)
      return [...new Set(quizzes)]
    },
  },
}
</script>

<style lang="scss">
.formations {
  .block.question {
    .head {
      .input-container,
      .selector-container,
      .domains-selector-container {
        margin-bottom: 8px;
        flex: 2;
        margin-right: 16px;
        &:first-child {
          flex: 3;
        }
      }
      .button {
        min-width: 120px;
      }
    }
    .content {
      display: flex;
      padding-top: 16px;
      flex-direction: column;
      min-height: 0;
      .CodeMirror,
      .CodeMirror-scroll {
        min-height: 500px;
      }
      .parts {
        display: flex;
        .part {
          flex: 1;
          display: flex;
          flex-direction: column;
          &:last-child {
            margin-left: 24px;
          }
        }
      }
    }
  }
  /* stylelint-disable-next-line no-descending-specificity */
  .buttons-bar .button {
    flex: 1;
  }
}
</style>
