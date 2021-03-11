<template>
  <div class="block">
    <div class="head">
      <div class="infos">
        <h5>Utilisateurs</h5>
        <p>Gérez les utilisateurs</p>
      </div>
      <InputElement
        v-model="search"
        class="search-bar white_label"
        type="text"
        placeholder="Rechercher"
      />
    </div>
    <div class="content">
      <client-only v-if="filtredUsers.length">
        <vuetable
          class="users"
          :fields="tableFields"
          :data="filtredUsers"
          defaultSortBy="username"
        >
          <template slot="status-slot" slot-scope="props">
            <span
              class="button sm equal"
              :class="[props.rowData.status ? 'red' : 'green']"
              @click="changeType(props.rowData)"
            >
              {{ props.rowData.status ? 'Contributeur' : 'Joueur' }}
            </span>
          </template>
          <template slot="actions-slot" slot-scope="props">
            <nuxt-link
              class="password"
              :to="'/admin/users/password/' + props.rowData.id"
            >
              Changer le mot de passe
            </nuxt-link>
          </template>
        </vuetable>
      </client-only>
      <div v-else class="no-elements">
        <h3>Aucuns utilisateurs</h3>
        <p>Il n'a pas d'utilisateurs inscrits !</p>
        <nuxt-link class="button md green equal" to="/login">
          Créer un compte
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import vuetable from 'vuetable-2'

moment.locale('fr')

export default {
  name: 'Utilisateurs',
  components: {
    vuetable,
  },
  transition: 'left',
  middleware: ['auth', 'admin'],
  async fetch({ store, error }) {
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
      search: '',
      tableFields: [
        {
          name: 'id',
          title: 'ID',
          sortField: 'id',
        },
        {
          name: 'username',
          title: 'Pseudo',
          sortField: 'username',
        },
        {
          name: 'email',
          title: 'Email',
          sortField: 'email',
        },
        {
          name: 'status-slot',
          title: 'Status',
          sortField: 'status',
        },
        {
          name: 'actions-slot',
          title: 'Actions',
        },
      ],
    }
  },
  computed: {
    users() {
      return this.$store.getters['admin/getNoAdminUsers']
    },
    filtredUsers() {
      /* eslint-disable indent */
      return this.search
        ? this.users.filter(
            user =>
              user.username.includes(this.search) ||
              user.email.includes(this.search) ||
              user.id === this.search,
          )
        : this.users
      /* eslint-enable indent */
    },
  },
  methods: {
    changeType(user) {
      this.$store.dispatch('admin/updateUser', {
        id: user.id,
        status: user.status ? 0 : 1,
      })
    },
  },
}
</script>

<style lang="scss">
.users {
  .password {
    color: $green;
    text-decoration: none;
  }
}
</style>
