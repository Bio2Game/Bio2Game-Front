<template>
  <div class="parties-page">
    <div class="content">
      <div class="infos">
        <h1>PARTIES EN GROUPE</h1>
        <p>Ce mode de jeu vous permettra de jouer avec d’autres personnes</p>
      </div>
      <div class="items" :class="{ center: !$auth.user || !$auth.user.status }">
        <nuxt-link
          class="item"
          to="/parties/create"
          :class="{ disabled: !isContributor }"
        >
          <div class="wrapper">
            <img src="@/assets/images/create.jpg" alt="Créer une partie" />
            <div class="item__content">
              <h2>Créer</h2>
            </div>
          </div>
        </nuxt-link>
        <label class="item" for="to-focus" :class="{ focus: code.length }">
          <div class="wrapper">
            <img src="@/assets/images/join.jpg" alt="Rejoindre une partie" />
            <div class="item__content join">
              <h2>Rejoindre</h2>
              <div class="input-continer">
                <input
                  id="to-focus"
                  v-model="code"
                  type="text"
                  placeholder="code"
                  maxlength="8"
                />
                <span
                  class="go"
                  :class="{ show: showButton }"
                  @click="redirectToParty(code)"
                  >GO</span
                >
              </div>
            </div>
          </div>
        </label>
      </div>
      <div v-if="parties.length" class="infos" style="margin-top: 100px">
        <h1>PARTIES TERMINÉS</h1>
        <p>Retrouvez toutes les parties que vous avez effectués</p>
      </div>
      <div v-if="parties.length" class="parties">
        <table class="highlight responsive-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Code</th>
              <th>Questions</th>
              <th>Joueurs</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <nuxt-link
              v-for="item of parties"
              :key="item.id"
              :to="`/game/history/${item.id}`"
              tag="tr"
              onclick="document.location = ''"
            >
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.code }}</td>
              <td>{{ item.questionsSize }}</td>
              <td>{{ item.playersSize }}</td>
              <td>{{ item.created_at }}</td>
            </nuxt-link>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Parties',
  data() {
    return {
      parties: [],
      code: '',
    }
  },
  computed: {
    isContributor() {
      return this.$auth.loggedIn && this.$auth.user.status > 0
    },
    showButton() {
      return this.code.length === 8
    },
  },
  methods: {
    redirectToParty(code) {
      code = code.trim()
      if (!code) {
        this.code = ''
      }
      this.$router.push(`/parties/${code}`)
    },
  },
}
</script>

<style lang="scss">
.parties-page {
  display: flex;
  justify-content: center;
  .infos {
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
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 16px;
    }
  }

  .items {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    padding: 16px 0 72px;

    @media screen and (max-width: 780px) {
      flex-direction: column-reverse;
    }

    .item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 6px solid #ffffff;
      margin: 0 32px;
      cursor: pointer;
      flex: 1 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
      transition: transform 0.3s;
      &.disabled {
        filter: grayscale(1);
        transform: none !important;
      }

      @media screen and (max-width: 780px) {
        margin: 0 24px 24px;
        max-width: 500px;
      }

      @media screen and (max-width: 480px) {
        margin: 0 16px 16px;
        max-width: 500px;
      }

      &:hover {
        transform: scale(1.03);
      }

      img {
        display: flex;
        width: 100%;
      }

      .item__content {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(
          0deg,
          rgba(187, 226, 66, 0.9) 0%,
          rgba(187, 226, 66, 0.65) 100%
        );
        bottom: 0;
        left: 0;
        transition: padding-top 0.3s;

        h2 {
          color: white;
          font-size: 45px;
          font-weight: bold;
          text-transform: uppercase;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);

          @media screen and (max-width: 480px) {
            font-size: 32px;
          }
        }

        &.join {
          flex-direction: column;
          padding-top: calc(3rem + 28px);

          .input-continer {
            display: flex;
            align-items: flex-end;
            width: 100%;
            transition: opacity 0.3s;
            opacity: 0;
            margin-top: 24px;
            max-width: 200px;

            .go {
              display: none;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 37px;
              border: 3px solid #ffffff;
              margin: 0 0 8px 10px;
              color: #ffffff;
              font-size: 20px;
              font-weight: 600;
              max-width: 48px;
              text-transform: uppercase;
              text-decoration: none;
              background-color: transparent;
              transition: opacity 0.3s, background-color 0.3s, color 0.3s,
                border-width 0.3s;

              &.show {
                display: flex;
              }
            }

            input {
              width: 100%;
              border: none;
              margin: 0 0 8px 0;
              color: #ffffff;
              font-size: 24px;
              font-weight: 600;
              text-align: center;
              padding-bottom: 5px;
              border-bottom: 3px solid white !important;
              text-transform: uppercase;
              transition: border-bottom-width 0.3s;
              background-color: transparent;
              outline: 0;

              &::placeholder {
                color: #ffffff;
                opacity: 0.6;
              }
            }
          }

          &:hover,
          &.focus {
            padding-top: 0 !important;

            .input-continer {
              opacity: 1;
              transition: opacity 0.3s 0.2s;
            }
          }
          @media screen and (max-width: 780px) {
            padding-top: 0 !important;

            .input-continer {
              opacity: 1;
              transition: opacity 0.3s 0.2s;
            }
          }
        }
      }
    }
  }
  .scores {
    margin-top: 40px;
    table {
      max-width: 500px;
    }
  }
  .players {
    min-width: 80vw;

    table {
      .title {
        text-align: center;
      }
      .trans {
        margin: 0 1px !important;
        text-align: center;
        border-radius: 0 !important;
        border-right: 1px solid #bfbfbf;
        background-color: white;
        &.right_a {
          color: white;
          background-color: #2e7d32;
        }
        &.wrong {
          color: white;
          background-color: #d32f2f;
        }
        &.realy_wrong {
          color: white;
          background-color: #b71c1c;
        }
        &.no {
          color: white;
          background-color: #868686;
        }
      }
    }
  }
}
</style>
