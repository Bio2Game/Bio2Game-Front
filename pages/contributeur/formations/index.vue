<template>
  <div class="container">
    <div class="block index">
      <div class="head">
        <h5>Formations</h5>
        <nuxt-link
          to="/contributeur/formations/create"
          class="button white_sky sm equal"
        >
          Créer une formation
        </nuxt-link>
      </div>
      <div class="content">
        <client-only v-if="formations.length">
          <vuetable
            :fields="tableFields"
            :data="formations"
            :defaultSortBy="{ field: 'updated_at', direction: 'desc' }"
            @row-clicked="
              $router.push(`/contributeur/formations/${$event.data.id}`)
            "
          />
        </client-only>
        <div v-else class="no-elements">
          <h3>Aucune formation</h3>
          <p>Aucune formation n'a encore été créé !</p>
          <nuxt-link
            class="button md green equal"
            to="/contributeur/formations/create"
          >
            Créer une formation
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import vuetable from 'vuetable-2'

moment.locale('fr')

export default {
  name: 'AdminFormations',
  components: {
    vuetable,
  },
  middleware: ['auth', 'contributor'],
  async fetch({ store, error }) {
    try {
      await store.dispatch('formations/fetchPersonnalFormations')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch your formations on the Bio2Game API',
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
          visible: this.$auth.user.status > 999,
        },
        {
          name: 'quizzes',
          title: 'Quizzes',
          formatter: quizzes => (quizzes ? quizzes.length : 0),
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
    formations() {
      return this.$store.state.formations.contributorFormations
    },
  },
}
</script>

<style lang="scss">
.block.index .head {
  align-items: center;
}
</style>
