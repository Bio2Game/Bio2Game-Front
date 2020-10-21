<template>
  <div class="container">
    <div class="block index">
      <div class="head">
        <h5>Mes quizzes</h5>
        <nuxt-link
          to="/contributeur/quizzes/create"
          class="button white_sky sm equal"
        >
          Créer un quizz
        </nuxt-link>
      </div>
      <div class="content">
        <TableElement
          v-if="quizzes.length"
          :fields="tableFields"
          :data="quizzes"
          @selectRow="
            $router.push(
              `/contributeur/quizzes/${$event.data.id}-${$event.data.url}`,
            )
          "
        />
        <div v-else class="no-elements">
          <h3>Aucuns quizzes</h3>
          <p>Votre profil ne contient pas le moindre quiz !</p>
          <nuxt-link
            class="button md green equal"
            to="/contributeur/quizzes/create"
          >
            Créer un quiz
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="buttons-bar">
      <nuxt-link class="button green lg" to="/contributeur/quizzes">
        Mes quizzes
      </nuxt-link>
      <nuxt-link class="button green lg" to="/contributeur/questions">
        Mes questions
      </nuxt-link>
      <div class="button green lg disabled">Sauvegarder</div>
      <div class="button green lg disabled">Supprimer</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

moment.locale('fr')

export default {
  name: 'MesQuizzes',
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
      tableFields: [
        {
          name: 'id',
          title: 'ID',
          sortField: 'id',
        },
        {
          name: 'label',
          title: 'Nom',
          sortField: 'label',
        },
        {
          name: 'domain',
          title: 'Domaine',
          sortField: 'domain.label',
          formatter: domain => (domain ? domain.label : 'Aucun'),
        },
        {
          name: 'status',
          title: 'Status',
          formatter: bool => (bool ? 'Publique' : 'Privé'),
          sortField: 'status',
        },
        {
          name: 'author.username',
          title: 'Contributeur',
          sortField: 'author.username',
          visible: this.$auth.user.status > 1,
        },
        {
          name: 'questions',
          title: 'Questions',
          formatter: questions => (questions ? questions.length : 0),
        },
        {
          name: 'updated_at',
          title: 'Edition',
          formatter: date => moment(date).fromNow(),
          sortField: 'updated_at',
        },
        {
          name: 'created_at',
          title: 'Création',
          formatter: date => moment(date).fromNow(),
          sortField: 'created_at',
        },
      ],
    }
  },
  computed: {
    quizzes() {
      return this.$store.state.quizzes.contributorQuizzes
    },
  },
}
</script>

<style lang="scss">
.block.index .head {
  align-items: center;
}
</style>
