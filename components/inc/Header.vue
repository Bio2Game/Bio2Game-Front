<template>
  <div class="header" :class="{ 'fixed-header': isFixed, stage }">
    <div class="wrapper">
      <div class="container">
        <nuxt-link to="/" class="logo-link">
          <img
            class="logo"
            src="@/assets/images/logo.png"
            alt="Logo Bio2Game"
          />
        </nuxt-link>
        <div class="menu" :class="{ open: toggleUserMenu }">
          <div class="left-menu">
            <nuxt-link class="link" to="/"><HomeIcon /> Accueil</nuxt-link>
            <nuxt-link class="link" to="/quiz"> <GamesIcon /> Quiz </nuxt-link>
            <nuxt-link class="link" to="/parties">
              <GroupIcon /> Parties
            </nuxt-link>
            <nuxt-link class="link" to="/formations">
              <GroupIcon /> Formations
            </nuxt-link>
          </div>
          <client-only>
            <div v-if="!$auth.loggedIn" class="right-menu">
              <nuxt-link class="button md green" to="/contributeur/quiz">
                Créer un quiz
              </nuxt-link>
              <nuxt-link class="button md border_white right" to="/login">
                Se connecter
              </nuxt-link>
            </div>
            <div v-else class="right-menu">
              <div class="user" :class="{ active: toggleUserMenu, transition }">
                <div class="group" @click="toggleUserMenu = !toggleUserMenu">
                  <AvatarElement
                    class="avatar"
                    :email="$auth.user.email || ''"
                    :path="$auth.user.path || ''"
                    :name="$auth.user.username"
                    :size="32"
                  />
                  <span class="username">{{ $auth.user.username }}</span>
                  <DownIcon class="down" />
                </div>
                <div class="user-menu">
                  <ul v-if="$auth.strategy.name === 'user'">
                    <nuxt-link to="/profil"><UserIcon /> Mon profil</nuxt-link>
                    <!-- <nuxt-link to="/quiz"><Favorite /> Mes favoris</nuxt-link> -->
                    <nuxt-link v-if="$auth.user.status" to="/contributeur/quiz">
                      <Nature2Icon /> Mes quiz
                    </nuxt-link>
                    <nuxt-link
                      v-if="$auth.user.status"
                      to="/contributeur/formations"
                    >
                      <FormationsIcon /> Mes formations
                    </nuxt-link>
                    <nuxt-link v-if="$auth.user.status > 999" to="/admin">
                      <SettingsIcon /> Admin
                    </nuxt-link>
                    <a @click.prevent="logout()"><PowerIcon /> Déconnexion</a>
                  </ul>
                  <ul v-else>
                    <nuxt-link to="/login">
                      <UserIcon /> Créer un compte
                    </nuxt-link>
                    <nuxt-link to="/parties"><Nature2Icon /> Parties</nuxt-link>
                    <a @click.prevent="logout()"><PowerIcon /> Déconnexion</a>
                  </ul>
                </div>
              </div>
            </div>
          </client-only>
        </div>
        <a
          class="hamburger"
          :class="{ open: toggleUserMenu }"
          @click="toggleUserMenu = !toggleUserMenu"
          ><span /><span /><span
        /></a>
      </div>
    </div>
    <notifications classes="notifications" />
  </div>
</template>

<script>
import DownIcon from '@/assets/icons/down.svg?inline'
import UserIcon from '@/assets/icons/user.svg?inline'
import Nature2Icon from '@/assets/icons/nature2.svg?inline'
import FormationsIcon from '@/assets/icons/formations.svg?inline'
// import Favorite from '@/assets/icons/favorite.svg?inline'
import SettingsIcon from '@/assets/icons/settings.svg?inline'
import PowerIcon from '@/assets/icons/power.svg?inline'
import HomeIcon from '@/assets/icons/home.svg?inline'
import GamesIcon from '@/assets/icons/games.svg?inline'
import GroupIcon from '@/assets/icons/group.svg?inline'

export default {
  name: 'Header',
  components: {
    DownIcon,
    // Favorite,
    Nature2Icon,
    FormationsIcon,
    SettingsIcon,
    UserIcon,
    PowerIcon,
    HomeIcon,
    GamesIcon,
    GroupIcon,
  },
  data() {
    return {
      isFixed: false,
      stage: false,
      toggleUserMenu: false,
      transition: false,
    }
  },
  watch: {
    $route(newRoute, oldRoute) {
      this.toggleUserMenu = false
      this.stage = newRoute.name !== 'index' && oldRoute.name === 'index'
      this.checkHeader()
    },
  },
  mounted() {
    this.checkHeader()
    window.addEventListener('scroll', this.checkHeader)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.checkHeader)
  },
  methods: {
    async checkHeader() {
      if (this.$route.name !== 'index') {
        this.isFixed = true
        return
      }

      const position = window.pageYOffset || document.documentElement.scrollTop
      const isScrollingDown = position > 0

      if (this.isFixed !== isScrollingDown) {
        this.transition = true
        await this.$nextTick()
        this.isFixed = isScrollingDown
        await new Promise(resolve => setTimeout(() => resolve(), 300))
        this.transition = false
      }
    },
    async logout() {
      await this.$auth.logout()
      this.$notify({
        group: 'auth',
        type: 'success',
        text: 'Vous êtes déconnecté avec succès !',
        duration: 5000,
        width: 400,
      })
    },
  },
}
</script>

<style lang="scss">
.header {
  width: 100%;
  .wrapper {
    position: relative;
    z-index: 20;
    display: flex;
    align-items: center;
    width: 100%;
    height: 5rem;
    background-color: white;
    transition: 0.1s background-color linear;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    a {
      display: flex;
      align-items: center;
      .logo {
        height: 4rem;
      }
    }
    .menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      .left-menu {
        display: flex;
        align-items: center;
        .link {
          margin: 0 12px;
          color: #4f4f4f;
          font-size: 1rem;
          font-weight: 500;
          line-height: 24px;
          text-decoration: none;
          svg {
            display: none;
          }
        }
      }
      .right-menu {
        display: flex;
        @media screen and (max-width: $lg) and (min-width: $md) {
          .button.border_white {
            border: 3px solid $green;
            color: $green;
            background-color: transparent;
            box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);

            &:hover {
              background-color: $gray-light;
            }
          }
        }
        .user {
          position: relative;
          display: flex;
          align-items: center;
          padding: 18px 20px;
          cursor: pointer;
          text-decoration: none;
          user-select: none;
          min-width: 188px;
          .group {
            display: flex;
            align-items: center;
            .avatar {
              width: 32px;
              height: 32px;
              border: 2px solid $green;
              border-radius: 16px;
              margin-right: 8px;
            }
            .username {
              display: flex;
              align-items: center;
              color: #4f4f4f;
              font-size: 19px;
              transition: 0.2s color 0.5s ease-out;
            }
            svg.down {
              width: 16px;
              margin-left: 6px;
              margin-top: 2px;
              path {
                transition: 0.2s fill 0.5s ease-out;
              }
            }
          }
          .user-menu {
            position: absolute;
            z-index: -1;
            top: -6px;
            overflow: hidden;
            left: 0;
            background-color: $green;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.175);
            border-radius: 0 0 16px 16px;
            max-height: 0;
            transition: 0.6s max-height ease-out;

            ul {
              padding: 24px;
              margin-top: 70px;
              a {
                position: relative;
                display: flex;
                align-items: center;
                padding: 16px;
                color: #ffffff;
                transition: 0.3s background-color ease;
                text-decoration: none;
                white-space: nowrap;
                svg {
                  font-size: 20px;
                  margin-right: 5px;
                }
              }
            }
          }
          &.active {
            .username {
              color: #ffffff !important;
              transition: 0.2s color ease-out;
            }
            svg.down path {
              transition: 0.2s fill ease-out;
              fill: #ffffff;
            }
            .user-menu {
              max-height: 100vh;
            }
          }
        }
      }
      @media screen and (max-width: $md) {
        position: fixed;
        top: 0;
        right: 0;
        overflow: hidden;
        flex-direction: column;
        background-color: $green;
        max-height: 0;
        border-bottom-left-radius: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        transition: 0.4s max-height ease;
        .left-menu {
          align-items: flex-start;
          width: 100%;
          padding: 72px 24px 0;
          flex-direction: column;
          .link {
            padding: 16px;
            margin: 0;
            color: white;
            font-size: 16px;
            svg {
              display: inline;
              margin-right: 5px;
            }
          }
        }
        .right-menu {
          padding: 0 24px 24px;
          flex-direction: column;
          .button {
            margin-left: 0;
            margin-top: 16px;
            &.green {
              color: $green;
              background-color: white;
            }
          }
          .user {
            padding: 0;
            min-width: 0;
            .avatar,
            .username,
            .down {
              display: none;
            }
            .user-menu {
              position: relative;
              box-shadow: none;
              ul {
                padding: 0;
                margin: 0;
              }
            }
          }
        }
        &.open {
          max-height: 100vh;
        }
      }
    }
    .hamburger {
      position: fixed;
      z-index: 5;
      top: 21px;
      right: 20px;
      display: none;
      width: 37px;
      height: 37px;
      cursor: pointer;
      transform: rotate(0deg);
      transition: 0.5s ease-in-out;

      @media screen and (max-width: 768px) {
        display: flex;
      }

      span {
        position: absolute;
        display: block;
        width: 100%;
        height: 7px;
        background: $green;
        border-radius: 10px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: all 0.25s ease-in-out;
        transform-origin: left center;

        &:nth-child(1) {
          top: 3px;
        }

        &:nth-child(2) {
          top: 15px;
        }

        &:nth-child(3) {
          top: 27px;
        }
      }

      &.open {
        span {
          background-color: white;
          &:nth-child(1) {
            width: 50px;
            transform: rotate(45deg) translate(-3px, -5px);
          }

          &:nth-child(2) {
            width: 0%;
            opacity: 0;
          }

          &:nth-child(3) {
            width: 50px;
            transform: rotate(-45deg) translate(-3px, 4px);
          }
        }
      }
    }
  }
  &.fixed-header {
    height: 0;
    animation: fadeOutBigger 0.3s ease-out forwards;
    .wrapper {
      position: fixed !important;
      z-index: 1000;
      top: 0;
      height: 5rem;
      transition: 0.1s background-color linear;
      opacity: 0;
      animation: fadeIn 0.3s ease-out forwards;
      .right-menu {
        @media screen and (min-width: $md) {
          .button.border_white {
            border: 3px solid $green;
            color: $green;
            background-color: transparent;
            box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
            &:hover {
              background-color: $gray-light;
            }
          }
        }
      }
    }
    &.stage {
      animation: fadeOutBigger 0.3s ease-out forwards 0.4s;
      .wrapper {
        animation: fadeIn 0.3s ease-out forwards 0.4s;
        transition: 0.1s background-color linear 0.3s;
      }
    }
    @keyframes fadeOutBigger {
      0% {
        height: 0;
      }
      100% {
        height: 5rem;
      }
    }
    @keyframes fadeIn {
      0% {
        opacity: 0;
        transform: translateY(-100px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}
.route.index {
  .header {
    .wrapper {
      background-color: transparent;
      position: absolute;
      .menu .right-menu .user {
        .username {
          color: white;
          @media screen and (max-width: $lg) {
            color: #4f4f4f;
          }
        }
        &.transition .username {
          transition: 0.2s color ease-out;
        }
      }
    }
    &.fixed-header {
      height: 0;
      animation: none;
      .wrapper {
        background-color: white;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
          0 1px 2px 0 rgba(0, 0, 0, 0.06);
        .menu .right-menu .user {
          .username {
            color: #4f4f4f;
          }
        }
      }
    }
  }
}
</style>
