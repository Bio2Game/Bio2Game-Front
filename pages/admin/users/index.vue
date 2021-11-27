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
          :defaultSortBy="{ field: 'username', direction: 'asc' }"
        >
          <template slot="status-slot" slot-scope="props">
            <span
              class="button sm equal"
              :class="`level_${props.rowData.status}`"
              @click="changeType(props.rowData)"
            >
              {{ levelsLabels[props.rowData.status] }}
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
  middleware: ['auth', 'admin'],
  transition: 'left',
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
      levelsLabels: [
        'Joueur',
        'Contributeur',
        'Primaire',
        'Secondaire',
        'Universitaire',
        'Expert',
      ],
    }
  },
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
        status: user.status < 5 ? user.status + 1 : 0,
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

  .level_0 {
    background-color: #9dcd09;
    color: #ffffff;
  }

  .level_1 {
    background-color: #82ab07;
    color: #ffffff;
  }

  .level_2 {
    background-color: #709306;
    color: #ffffff;
  }

  .level_3 {
    background-color: #ff3333;
    color: #ffffff;
  }

  .level_4 {
    background-color: #cc0000;
    color: #ffffff;
  }

  .level_5 {
    background-color: #810000;
    color: #ffffff;
  }
}
</style>
