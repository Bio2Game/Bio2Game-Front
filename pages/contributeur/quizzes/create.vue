<template>
  <div class="quiz-creation create">
    <div class="container">
      <div class="block">
        <div class="head">
          <div class="section">
            <InputElement
              v-model="label"
              :value="label"
              type="text"
              name="label"
              class="white_label"
              placeholder="Libélé du quizz"
              :error="filtredErrors('label')"
            />
            <InputElement
              v-model="description"
              :value="description"
              type="text"
              name="name"
              class="white_label"
              placeholder="Description du quizz"
              :error="filtredErrors('description')"
            />
          </div>
          <div class="section">
            <InputElement
              v-model="localisation"
              :value="localisation"
              type="text"
              name="localisation"
              class="white_label"
              placeholder="Localisation (optionnel)"
              :error="filtredErrors('localisation')"
            />
          </div>
        </div>
        <div class="content">
          <client-only class="questions" placeholder="Loading...">
            <vuetable
              :apiMode="false"
              :data="quizzes"
              :fields="tableFields"
              :perPage="20"
              data-path=""
              paginationPath=""
            ></vuetable>
          </client-only>
        </div>
      </div>
      <div class="buttons-bar">
        <nuxt-link class="button green lg" to="/contributeur/quizzes">
          Mes quizzes
        </nuxt-link>
        <nuxt-link class="button green lg" to="/contributeur/quizzes">
          Les questions
        </nuxt-link>
        <nuxt-link class="button green lg" to="/contributeur/quizzes">
          Sauvegarder
        </nuxt-link>
        <nuxt-link class="button green lg" to="/contributeur/quizzes">
          Supprimer
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2'

export default {
  name: 'MesQuizzes',
  components: {
    Vuetable,
  },
  middleware: ['auth', 'contributor'],
  async fetch({ store, error }) {
    try {
      await store.dispatch('quizzes/fetchPeronnalQuizzes')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch your quizzes on the Bio2Game API',
      })
    }
  },
  data() {
    return {
      label: '',
      description: '',
      localisation: '',
      errors: [],
    }
  },
  computed: {
    quizzes() {
      return this.$store.state.quizzes.contributor_quizzes
    },
  },
  methods: {
    filtredErrors(field) {
      return this.errors.find((error) => error.field === field)
    },
  },
}
</script>

<style lang="scss">
.quiz-creation {
  &.create {
    .container {
      flex-direction: column;
      .block .head .section {
        display: flex;
        flex-direction: column;
        flex: 1 0;
        &:last-child {
          margin-left: 24px;
        }
      }
      .buttons-bar {
        display: flex;
        justify-content: space-between;
        margin: 24px -12px 0;
        .button {
          flex: 1;
          margin: 0 12px;
          max-width: none;
        }
      }
    }
  }
  .block {
    flex: 1;
    flex-direction: column;
    margin-top: 32px;
    .content {
      min-height: calc(50vh);
    }
  }
}
</style>
