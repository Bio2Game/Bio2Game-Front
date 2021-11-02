<template>
  <div class="formations-page">
    <div class="top">
      <h1>FORMATIONS</h1>
      <p>Formez-vous sur des domaines que vous souhaitez mieux maitriser</p>
    </div>
    <LevelSelector v-model="selectedLevels" />
    <div class="filters">
      <InputElement
        v-model="search"
        class="white_label"
        type="text"
        placeholder="Rechercher"
      />
    </div>
    <div class="container formations">
      <nuxt-link
        v-for="formation of filtredFormations"
        :key="formation.id"
        :to="`/formations/${formation.id}-${formation.url}`"
        class="formation"
      >
        <div class="image">
          <img
            v-if="formation.domain"
            :src="
              'https://cdn.bio2game.com/illustrations/' + formation.domain.image
            "
            :alt="formation.label"
          />
        </div>
        <div class="content-part">
          <span v-if="formation.domain" class="domain">
            {{ formation.domain.label }}
          </span>
          <h6 class="title">{{ formation.label }}</h6>
          <div class="labels">
            <div class="duration label">
              <span>Durée: </span>
              <ClockIcon class="icon" />
              <ClockIcon v-if="formation.duration" class="icon" />
            </div>
            <div class="leaves label">
              <span>Impact positif: </span>
              <LeafIcon
                v-for="leave of formation.leaves"
                :key="leave"
                class="icon"
              />
            </div>
          </div>
          <div class="description">
            <p>{{ formation.description }}</p>
          </div>
          <p class="creator">
            <b>Créateur :</b> {{ formation.author.username }}
          </p>
          <span class="formation-id">#{{ formation.id }}</span>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import LeafIcon from '@/assets/icons/leaf.svg?inline'
import ClockIcon from '@/assets/icons/clock.svg?inline'

export default {
  name: 'Formations',
  middleware: 'auth',
  components: {
    LeafIcon,
    ClockIcon,
  },
  async fetch({ store, error }) {
    try {
      await store.dispatch('formations/fetchFormations')
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch quiz on the Bio2Game API',
      })
    }
  },
  data() {
    return {
      selectedLevels: [0, 1, 2, 3, 4],
      search: '',
    }
  },
  computed: {
    formations() {
      return this.$store.state.formations.formations || []
    },
    filtredFormations() {
      const search = this.search.toLowerCase()
      return this.formations.filter(
        formation =>
          this.selectedLevels.includes(Number(formation.level)) &&
          (!search ||
            formation.label.toLowerCase().includes(search) ||
            formation.description.toLowerCase().includes(search) ||
            formation.id.toString() === search ||
            formation.author.username.toLowerCase().includes(search) ||
            (formation.domain &&
              formation.domain.label.toLowerCase().includes(search)) ||
            (formation.author.name
              ? formation.author.name.toLowerCase().includes(search)
              : false)),
      )
    },
  },
  methods: {
    getURL(formation) {
      return `/formation/${formation.id}-${formation.url}`
    },
  },
}
</script>

<style lang="scss">
.formations-page {
  display: flex;
  flex-direction: column;
  align-items: center;

  .nature {
    width: 350px;
    height: 293.5px;
    margin: 24px 0 16px;
  }

  .top {
    h1 {
      margin: 48px 0 24px;
      color: #414141;
      font-size: 40px;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      @media screen and (max-width: $md) {
        margin: 32px 0 24px;
        font-size: 32px;
      }
      @media screen and (max-width: $sm) {
        margin: 24px 0;
        font-size: 24px;
      }
    }

    p {
      color: #292929;
      font-size: 18px;
      text-align: center;
    }
  }

  .filters {
    display: flex;
    max-width: 400px;
    width: 100%;

    .input-container {
      width: 100%;
      border-radius: 22px;

      input {
        border-radius: 22px;

        &:focus ~ .placeholder,
        &.has-content ~ .placeholder {
          left: 14px;
        }
      }

      .focus-bg {
        border-radius: 22px;
      }
    }
  }

  .formations {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(700px, 1fr));
    gap: 32px;
    margin-top: 32px;

    .formation {
      display: flex;
      padding: 16px;
      background: #ffffff;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
      border-radius: 12px;
      cursor: pointer;
      text-decoration: none;

      .image {
        max-width: 300px;
        margin-right: 16px;

        img {
          display: flex;
          width: 100%;
          border-radius: 7px;
        }
      }

      .content-part {
        flex: 1;
        position: relative;

        .domain {
          color: #484848;
          font-size: 14px;
          line-height: 15px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .title {
          margin: 8px 0 12px;
          color: #bbe242;
          font-size: 24px;
          font-weight: bold;
          line-height: 24px;
        }

        .labels {
          display: flex;
          margin-right: 32px;
          margin-bottom: 16px;

          .icon {
            width: 16px;
            height: 16px;
          }

          .label {
            display: flex;
            align-items: center;
            color: #484848;
            font-size: 16px;
            margin-right: 16px;

            span {
              margin-right: 8px;
            }

            svg {
              margin-right: 4px;
            }
          }
        }

        .description {
          display: flex;
          color: #484848;
          font-size: 16px;
          line-height: 20px;
          margin-top: auto;
        }

        .formation-id {
          position: absolute;
          right: 0;
          bottom: 0;
          color: #dedede;
          font-size: 20px;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .creator {
          position: absolute;
          bottom: 0;
          left: 0;
          margin: 16px 0 0;
          color: $green;
          opacity: 0;
          transition: opacity 0.3s;

          b {
            font-weight: 600;
          }
        }
      }

      &:hover .formation-id,
      &:hover .creator {
        opacity: 1;
      }
    }
  }
}
</style>
