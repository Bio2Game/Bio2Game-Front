<template>
  <div class="blocks">
    <div class="block">
      <div class="head">
        <div class="infos">
          <h5>Domaines</h5>
          <p>Créez, modifiez les domaines disponibles pour chaque quiz</p>
        </div>
      </div>
      <div class="content">
        <InputElement
          v-model="current_domain.name"
          :value="current_domain.name"
          type="text"
          placeholder="Nom du domaine"
        />
        <InputElement
          v-model="current_domain.icon_id"
          :value="current_domain.icon_id"
          type="number"
          placeholder="Icone Id"
        />
        <FileSelectorElement
          v-model="current_domain.illustration"
          placeholder="Illustration"
        />
        <ChipsSelectorElement
          v-model="current_domain.keyswords"
          :value="current_domain.keyswords"
          placeholder="Mots clés"
        />
        <div class="button md green submit">Sauvegarder</div>
      </div>
    </div>
    <div class="domains-list">
      <li v-for="domain of domains" :key="domain.id" class="domain">
        <img
          class="icon"
          :src="'https//www.bio2game.com/images/icons/' + domain.icon.reference"
          :alt="domain.label"
        />
        <span class="label">{{ domain.label }}</span>
      </li>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

moment.locale('fr')

export default {
  name: 'Domaines',
  transition: 'left',
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
      current_domain: {
        name: '',
        icon_id: '',
        illustration: '',
        keyswords: '',
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

<style lang="scss">
.blocks {
  display: flex;
  .block {
    flex: 1;
    .content {
      display: flex;
      flex-direction: column;
      min-height: 0;
      .submit {
        max-width: 100%;
        width: 100%;
        margin-top: 8px;
        margin-bottom: 4px;
      }
    }
  }
  .domains-list {
    display: flex;
    flex-direction: column;
    max-height: calc(50vh + 77px);
    overflow-y: auto;
    min-width: 350px;
    margin-left: 24px;
    margin-top: 24px;
    padding-right: 12px;
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      background-color: #e7e7e7;
      border-radius: 10px;
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: $green;
      transition: background-color 0.1s ease;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: $green-light;
    }
    .domain {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      padding: 8px;
      background-color: white;
      box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      &:last-child {
        margin-bottom: 0;
      }
      .icon {
        width: 48px;
        height: 48px;
        border-radius: 24px;
      }
      .label {
        margin-left: 16px;
        color: #a0a0a0;
      }
    }
  }
}
</style>
