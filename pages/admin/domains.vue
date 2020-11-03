<template>
  <div class="block">
    <div class="head">
      <div class="infos">
        <h5>Domaines</h5>
        <p>Créez, modifiez les domaines disponibles pour chaque quiz</p>
      </div>
    </div>
    <div class="content">
      <InputElement
        v-model="domain.name"
        type="text"
        placeholder="Nom du domaine"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'

moment.locale('fr')

export default {
  name: 'Domaines',
  middleware: ['auth', 'admin'],
  async fetch({ store, error }) {
    try {
      await store.dispatch('admin/fetchDomains')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch users on the Bio2Game API',
      })
    }
  },
  data() {
    return {
      domain: {
        name: '',
        icon_id: null,
        illustration: '',
        keyswords: [],
      },
    }
  },
  computed: {
    domains() {
      return this.$store.state.admin.domains
    },
  },
}
</script>
