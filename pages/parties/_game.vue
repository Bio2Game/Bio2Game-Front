<template>
  <div class="party-page">
    <div v-if="game && you" class="container">
      <PlayerPlayground v-if="!you.animator" />
      <AnimatorPlayground v-else />
      <div class="side-bar">
        <div v-if="you.animator" class="admin-buttons">
          <div
            v-if="!game.status && game.players.length"
            class="button green md"
            @click="$socket.client.emit('startGame')"
          >
            Lancer la partie
          </div>
          <template v-if="game.currentQuestion && !game.finished">
            <div
              v-if="!game.pause"
              class="button green md"
              @click="$socket.client.emit('pause')"
            >
              Pause
            </div>
            <div
              v-else
              class="button green md"
              @click="$socket.client.emit('resume')"
            >
              Relancer
            </div>
          </template>
        </div>
        <div class="block">
          <div class="head">
            <h5>Utilisateurs</h5>
            <BanIcon
              v-if="you.animator"
              class="ban_icon"
              @click="bannedWindow = true"
            />
          </div>
          <div class="content">
            <div class="user animator">
              <div class="icon">
                <CrownIcon class="crown" />
                <AvatarElement
                  class="avatar"
                  :email="game.animator.email"
                  :path="game.animator.avatar_path"
                  :name="game.animator.name || game.animator.username"
                  :size="32"
                />
              </div>
              <div class="username">
                {{ game.animator.name || game.animator.username }}
              </div>
            </div>
            <div class="players">
              <div
                v-for="(player, index) in game.players"
                :key="index"
                class="user player"
              >
                <div class="icon">
                  <AvatarElement
                    class="avatar"
                    :email="player.email"
                    :path="player.icon_url"
                    :name="player.name || player.username"
                    :size="32"
                  />
                </div>
                <div class="username">
                  {{ player.name || player.username }}
                </div>
                <CloseIcon
                  v-if="you.animator"
                  class="close"
                  @click=";(banPlayer = player), (banWindow = true)"
                />
              </div>
            </div>
            <span class="players-counter"
              >{{ game.players.length }}
              {{
                game.players.length !== 1 ? 'utilisateurs' : 'utilisateur'
              }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <NotFound v-else-if="error" :error="error" />
    <template v-if="you && you.animator">
      <ModalElement
        v-if="game"
        :open="bannedWindow"
        @close="bannedWindow = false"
      >
        <div class="block">
          <div class="head">
            <h5>Joueurs bannis</h5>
          </div>
          <div class="content">
            <div
              v-for="player of game.bannedPlayers"
              :key="player.id"
              class="player"
            >
              <div class="icon">
                <AvatarElement
                  class="avatar"
                  :email="player.email"
                  :path="player.icon_url"
                  :name="player.name || player.username"
                  :size="32"
                />
              </div>
              <div class="username">
                {{ player.name || player.username }}
              </div>
              <UnbanIcon @click="$socket.client.emit('unbanUser', player.id)" />
            </div>
          </div>
        </div>
      </ModalElement>
      <ModalElement :open="banWindow && banPlayer" @close="banWindow = null">
        <div class="block ban-window">
          <div class="head">
            <h5>Bannir ce joueur ?</h5>
          </div>
          <div class="content element">
            <p class="description">
              Êtes vous sûr de vouvoir bannir
              <b>{{
                banPlayer ? banPlayer.name || banPlayer.username : 'Joueur'
              }}</b>
              ?
            </p>
            <div class="player">
              <div class="icon">
                <AvatarElement
                  class="avatar"
                  :email="banPlayer ? banPlayer.email : 'fake@bio2game.com'"
                  :path="banPlayer && banPlayer.icon_url"
                  :name="banPlayer && (banPlayer.name || banPlayer.username)"
                  :size="32"
                />
              </div>
              <div class="username">
                {{
                  banPlayer ? banPlayer.name || banPlayer.username : 'Joueur'
                }}
              </div>
            </div>
            <div class="buttons">
              <div class="button red md" @click="banWindow = false">Non</div>
              <div class="button green md" @click="executeBan(banPlayer)">
                Oui
              </div>
            </div>
          </div>
        </div>
      </ModalElement>
    </template>
    <section v-if="askAuth" class="simpleAuth">
      <div class="block">
        <div class="head">
          <h5>Identification</h5>
        </div>
        <div class="content">
          <p>
            Afin de vous distinguer des autres joueurs dans la partie, veuillez
            indiquer un pseudo ou vous
            <nuxt-link class="b2glink" to="/login">
              connecter avec votre compte
            </nuxt-link>
            .
          </p>
          <InputElement
            :value="username"
            type="text"
            placeholder="Pseudo utilisateur"
            @input="username = $event"
          />
          <div class="button green lg" @click="registerSimpleAuth()">
            Rejoindre la partie !
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import BanIcon from '@/assets/icons/ban.svg?inline'
import CrownIcon from '@/assets/icons/crown.svg?inline'
import CloseIcon from '@/assets/icons/close.svg?inline'
import UnbanIcon from '@/assets/icons/unban.svg?inline'

export default {
  name: 'Game',
  components: {
    BanIcon,
    CrownIcon,
    CloseIcon,
    UnbanIcon,
  },
  validate({ params }) {
    return /^[A-Za-z1-9]{8}$/.test(params.game)
  },
  data() {
    return {
      disconnected: false,
      error: null,
      usersResponses: null,
      askAuth: false,
      bannedWindow: false,
      banWindow: false,
      banPlayer: null,
      username: '',
    }
  },
  computed: mapState('parties', ['game', 'you']),
  mounted() {
    this.startSession()
  },
  destroyed() {
    if (this.$socket.connected) {
      this.$socket.client.close()
    }
    this.$store.commit('parties/RESET_STATE')
  },
  methods: {
    startSession() {
      if (!this.$socket.connected) {
        this.$socket.client.open()
      }
      return this.$socket.client.emit('joinGame', {
        gameId: this.$route.params.game,
        auth: {
          token: this.$auth.token ? this.$auth.token.get('local') : null,
          /* eslint-disable indent */
          user: this.$auth.user
            ? {
                id: this.$auth.user.id,
                username: this.$auth.user.username,
                name: this.$auth.user.name,
                email: this.$auth.user.email,
                avatar_path: this.$auth.user.avatar_path,
              }
            : null,
          /* eslint-enable indent */
        },
      })
    },
    async registerSimpleAuth() {
      await this.$auth.loginWith('guest', {
        data: { username: this.username },
      })

      this.askAuth = false

      return this.startSession()
    },
    executeBan(banPlayer) {
      if (!banPlayer) {
        return
      }
      this.$socket.client.emit('banPlayer', banPlayer)
      this.banWindow = false
    },
  },
  sockets: {
    connect() {
      console.log('socket connected')
    },
    disconnect() {
      this.disconnected = true
      console.log('socket disconected')
    },
    gameError(data) {
      this.error = data
    },
    authError() {
      this.askAuth = true
    },
  },
}
</script>

<style lang="scss">
.party-page {
  display: flex;
  min-height: 0;

  .playground {
    width: 100%;

    .question-interface {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;

      .infos {
        margin-bottom: 25px;

        .title {
          display: flex;
          align-items: flex-end;

          h1 {
            margin: 10px 0 24px;
            color: #414141;
            font-size: 35px;
            font-weight: 600;
            text-transform: uppercase;
            flex: 1;
          }

          .question-position {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;

            .total {
              color: $green;
            }
          }
        }

        p {
          font-size: 16px;
          font-weight: 600;
          text-align: center;
        }

        .progress-bar {
          overflow: hidden;
          height: 20px;
          background-color: #eeeeee;
          border-radius: 10px;

          .bar {
            width: 0%;
            height: 100%;
            background-color: $green;
            transition: width 1s linear;
            border-radius: 10px;
          }
        }
      }

      .question {
        padding: 16px;
        color: #414141;
        box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
        background-color: #f8f7f7;
        margin-bottom: 16px;
        user-select: none;

        .question-content {
          width: calc(100% - 100px);

          p {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            line-height: 25px;
          }

          img {
            max-width: 100%;
          }
        }
      }

      .responses {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        flex-direction: column;

        .separator {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .item,
        .response {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: calc(50% - 8px);
          padding: 16px 20px;
          color: #000000;
          font-size: 16px;
          font-weight: 500;
          cursor: not-allowed;
          margin-bottom: 16px;
          box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
          background-color: #dadada;
          user-select: none;
          border-radius: 3px;
          transition: 0.3s background-color ease-out, 0.3s border-color ease-out;

          &.interactive {
            border: 5px solid #f8f7f7;
            cursor: pointer;
            background-color: #f8f7f7;
          }
          @media screen and (max-width: 480px) {
            width: 100%;
          }

          &.animator {
            color: #6d6d6d;
            cursor: not-allowed;
            background-color: #c7c7c7;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
          }

          &.right {
            color: white;
            background-color: $green !important;
            border-color: $green;
          }

          &.wrong {
            color: white;
            background-color: #ff1d1d !important;
            border-color: #ff1d1d;
          }

          &.realy_wrong {
            color: white;
            background-color: #e01515 !important;
            border-color: #e01515;
          }

          &.checked {
            background-color: #c5c5c5;
            border-color: #c5c5c5;
          }
        }
      }

      .explication {
        padding: 16px;
        border: 2px solid #bbe242;
        color: #585858;
        box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
        background-color: #f8f7f7;
        margin-bottom: 16px;
        border-radius: 4px;

        a {
          color: $green;
        }
      }
      // .appreciation {
      //   background-color: #1e8449;
      //   color: #ffffff;
      //   padding: 10px;
      //   text-align: center;
      //   font-size: 17px;
      //   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      //   p {
      //     margin: 0;
      //   }
      // }
      // .result {
      //   margin: 60px 0 16px;
      //   font-size: 16px;
      //   color: #5a5a5a;
      //   font-weight: 500;
      //   background-color: white;
      //   position: relative;
      //   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      //   .content {
      //     padding: 16px;
      //     &.content__responses {
      //       display: flex;
      //       justify-content: space-between;
      //       .question {
      //         word-break: break-word;
      //         padding-right: 16px;
      //       }
      //       .right {
      //         background-color: #19683b;
      //         color: white;
      //         padding: 6px 10px;
      //         margin: -6px -6px -6px 0;
      //         white-space: nowrap;
      //         height: fit-content;
      //       }
      //     }
      //     p {
      //       margin: 0;
      //       img {
      //         width: 100%;
      //       }
      //     }
      //   }

      //   .response {
      //     background-color: #19683b;
      //     color: #ffffff;
      //     padding: 10px;
      //     text-align: center;
      //   }
      //   .responses_range {
      //     display: flex;
      //     .item {
      //       color: #ffffff;
      //       text-align: center;
      //       overflow: hidden;
      //       padding: 10px 0;
      //       &.right {
      //         background-color: #2e7d32;
      //       }
      //       &.wrong {
      //         background-color: #d32f2f;
      //       }
      //       &.realy_wrong {
      //         background-color: #b71c1c;
      //       }
      //       &.nothing {
      //         background-color: #868686;
      //         width: 100%;
      //       }
      //     }
      //   }
      //   .more {
      //     background-color: lightgray;
      //     // padding-left: 10px;

      //     p {
      //       font-size: 14px;
      //       line-height: 22px;
      //     }

      //     .more-collapsible {
      //       padding: 8px 0;
      //       user-select: none;
      //       text-align: center;
      //       cursor: pointer;
      //     }

      //     .content {
      //       padding: 0 16px 16px;
      //       p {
      //         font-size: 14px;
      //         line-height: 22px;
      //         &.kown {
      //           margin-top: 10px;
      //           a {
      //             font-weight: 700;
      //             text-decoration: underline;
      //             color: #19683b !important;
      //           }
      //         }
      //       }
      //     }
      //   }
      //   span {
      //     position: absolute;
      //     top: -22px;
      //     left: 0;
      //     font-size: 14px;
      //   }
      // }
      // .user-response {
      //   display: flex;
      //   height: 80px;
      //   padding: 12px;
      //   background-color: #e4e4e4;
      //   .animator-image {
      //     margin-right: 12px;
      //     border-radius: 100%;
      //   }
      //   .msg-content {
      //     flex: 1 0;
      //     .username {
      //       color: #000000;
      //       font-weight: 600;
      //       font-size: 18px;
      //       margin-top: 9px;
      //     }
      //     .res {
      //       font-size: 14px;
      //     }
      //   }
      //   .status {
      //     display: flex;
      //     justify-content: center;
      //     align-items: center;
      //     font-size: 30px;
      //     height: 56px;
      //     width: 56px;
      //     img {
      //       width: 50px;
      //     }
      //   }
      // }
      // .stats {
      //   display: flex;
      //   justify-content: space-around;
      //   color: #19683b;
      //   margin: 25px 0;
      //   .item {
      //     text-align: center;
      //     h3 {
      //       font-weight: 700;
      //       font-size: 60px;
      //       margin: 0 0 -5px;
      //     }
      //     span {
      //       font-size: 13px;
      //       font-weight: 500;
      //     }
      //   }
      // }
      // .buttons {
      //   display: flex;
      //   justify-content: space-between;
      //   input[type='submit'],
      //   a {
      //     border: 0;
      //     text-decoration: none;
      //     background-color: #19683b;
      //     outline: 0;
      //     color: #ffffff;
      //     width: 100%;
      //     padding: 12px 30px;
      //     text-align: center;
      //     box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
      //       0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
      //     cursor: pointer;
      //     transition: all 0.3s;
      //     &:hover {
      //       box-shadow: 0 8px 17px 2px rgba(0, 0, 0, 0.14),
      //         0 3px 14px 2px rgba(0, 0, 0, 0.12),
      //         0 5px 5px -3px rgba(0, 0, 0, 0.2);
      //     }
      //     &.space {
      //       margin-right: 16px;
      //     }
      //   }
      // }
    }
  }

  .side-bar {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    margin-left: 24px;

    .admin-buttons {
      display: flex;
      flex-direction: column;

      .button {
        height: 48px;
        font-size: 18px;
        margin-top: 24px;
      }
    }

    .block {
      display: flex;
      flex-direction: column;
      flex: 1;

      .head {
        .ban_icon {
          width: 24px;
          height: 24px;
          margin: -4px;
          fill: white;
          cursor: pointer;
        }
      }
      /* stylelint-disable-next-line no-descending-specificity */
      .content {
        display: flex;
        flex-direction: column;
        height: 100%;
        align-content: center;

        .user {
          display: flex;
          align-items: center;

          .icon {
            position: relative;
            display: flex;
            justify-content: center;

            .avatar {
              border-radius: 16px;
              user-select: none;
            }
          }

          .username {
            margin-left: 20px;
          }

          &.animator {
            justify-content: center;
            width: 100%;
            padding: 20px 0 24px;
            border-bottom: 1px solid #a9a9a9;

            .icon .crown {
              position: absolute;
              top: -20px;
            }
          }

          &.player {
            position: relative;
            margin: 8px 0;

            .username {
              overflow: hidden;
              max-width: calc(100% - 100px);
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .close {
              position: absolute;
              right: 0;
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
          }
        }

        .players {
          display: flex;
          flex-direction: column;
          padding: 16px 8px 16px;
          flex: 1;
        }

        .players-counter {
          color: #585858;
          font-size: 15px;
          font-weight: 500;
          line-height: 18px;
          text-align: center;
        }
      }
    }
  }

  .ban-window .element {
    display: flex;
    flex-direction: column;

    .player {
      display: flex;
      align-items: center;
      padding: 16px;
      margin: 16px 0;
      /* stylelint-disable-next-line no-descending-specificity */
      .avatar {
        border-radius: 16px;
        user-select: none;
      }
      /* stylelint-disable-next-line no-descending-specificity */
      .username {
        margin-left: 16px;
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;

      .button {
        flex: 1;

        &:first-child {
          margin-right: 24px;
        }
      }
    }
  }

  .simpleAuth {
    max-width: 500px;
    margin: auto;

    .block {
      margin-top: 0;
      // stylelint-disable-next-line no-descending-specificity
      .content {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        // stylelint-disable-next-line no-descending-specificity
        p {
          line-height: 24px;
          margin-bottom: 16px;
        }

        .input-container {
          width: 100%;
        }
        // stylelint-disable-next-line no-descending-specificity
        .button {
          width: 100%;
          max-width: 100%;
        }
      }
    }
  }
}
</style>
