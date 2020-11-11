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
            <nuxt-link class="link" to="/quizzes">
              <GamesIcon /> Quizzes
            </nuxt-link>
            <nuxt-link class="link" to="/parties">
              <GroupIcon /> Parties
            </nuxt-link>
            <nuxt-link class="link" to="/formations">
              <GroupIcon /> Formations
            </nuxt-link>
          </div>
          <div v-if="!$auth.loggedIn" class="right-menu">
            <nuxt-link class="button md green" to="/">Créer un quiz</nuxt-link>
            <nuxt-link class="button md border_white right" to="/login">
              Se connecter
            </nuxt-link>
          </div>
          <div v-else class="right-menu">
            <div class="user" :class="{ active: toggleUserMenu, transition }">
              <div class="group" @click="toggleUserMenu = !toggleUserMenu">
                <AvatarElement
                  class="avatar"
                  :email="$auth.user.email"
                  :path="$auth.user.path"
                  :name="$auth.user.username"
                  :size="32"
                />
                <span class="username">{{ $auth.user.username }}</span>
                <DownIcon class="down" />
              </div>
              <div class="user-menu">
                <ul>
                  <nuxt-link to="/profil"><UserIcon /> Mon profil</nuxt-link>
                  <!-- <nuxt-link to="/quizzes"><Favorite /> Mes favoris</nuxt-link> -->
                  <nuxt-link to="/contributeur/quizzes">
                    <Nature2Icon /> Mes quizzes
                  </nuxt-link>
                  <nuxt-link v-if="$auth.user.status > 1" to="/admin">
                    <SettingsIcon /> Admin
                  </nuxt-link>
                  <a @click.prevent="logout()"><PowerIcon /> Déconnexion</a>
                </ul>
              </div>
            </div>
          </div>
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
// import Favorite from '@/assets/icons/favorite.svg?inline'
import SettingsIcon from '@/assets/icons/settings.svg?inline'
import PowerIcon from '@/assets/icons/power.svg?inline'
import HomeIcon from '@/assets/icons/home.svg?inline'
import GamesIcon from '@/assets/icons/games.svg?inline'
import GroupIcon from '@/assets/icons/group.svg?inline'

export default {
  components: {
    DownIcon,
    // Favorite,
    Nature2Icon,
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
      const isScrollingUp = this.isFixed ? position > 0 : position > 0

      if (this.isFixed !== isScrollingUp) {
        this.transition = true
        await this.$nextTick()
        this.isFixed = isScrollingUp
        await this.$nextTick()
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
    display: flex;
    align-items: center;
    width: 100%;
    height: 5rem;
    z-index: 20;
    background-color: white;
    transition: 0.1s background-color linear;
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
          font-weight: 500;
          font-size: 1rem;
          line-height: 24px;
          color: #4f4f4f;
          margin: 0 12px;
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
            background-color: transparent;
            color: $green;
            border: 3px solid $green;
            box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);

            &:hover {
              background-color: $gray-light;
            }
          }
        }
        .user {
          display: flex;
          align-items: center;
          padding: 18px 20px;
          position: relative;
          text-decoration: none;
          cursor: pointer;
          user-select: none;
          min-width: 188px;
          .group {
            display: flex;
            align-items: center;
            .avatar {
              height: 32px;
              width: 32px;
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
            left: 0;
            background-color: $green;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.175);
            border-radius: 0 0 16px 16px;
            max-height: 0;
            transition: 0.6s max-height ease-out;
            overflow: hidden;

            ul {
              margin-top: 70px;
              padding: 24px;
              a {
                padding: 16px;
                position: relative;
                transition: 0.3s background-color ease;
                text-decoration: none;
                color: #ffffff;
                display: flex;
                align-items: center;
                white-space: nowrap;
                svg {
                  margin-right: 5px;
                  font-size: 20px;
                }
              }
            }
          }
          &.active {
            .username {
              transition: 0.2s color ease-out;
              color: #ffffff !important;
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
        flex-direction: column;
        position: fixed;
        background-color: $green;
        top: 0;
        right: 0;
        overflow: hidden;
        max-height: 0;
        border-bottom-left-radius: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        transition: 0.4s max-height ease;
        .left-menu {
          padding: 72px 24px 0;
          flex-direction: column;
          width: 100%;
          align-items: flex-start;
          .link {
            color: white;
            padding: 16px;
            font-size: 16px;
            margin: 0;
            svg {
              display: inline;
              margin-right: 5px;
            }
          }
        }
        .right-menu {
          flex-direction: column;
          padding: 0 24px 24px;
          .button {
            margin-left: 0;
            margin-top: 16px;
            &.green {
              background-color: white;
              color: $green;
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
                margin: 0;
                padding: 0;
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
      display: none;
      width: 37px;
      height: 37px;
      transform: rotate(0deg);
      transition: 0.5s ease-in-out;
      cursor: pointer;
      position: fixed;
      right: 20px;
      top: 21px;
      z-index: 5;

      @media screen and (max-width: 768px) {
        display: flex;
      }

      span {
        display: block;
        position: absolute;
        height: 7px;
        width: 100%;
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
            transform: rotate(45deg) translate(-3px, -5px);
            width: 50px;
          }

          &:nth-child(2) {
            width: 0%;
            opacity: 0;
          }

          &:nth-child(3) {
            transform: rotate(-45deg) translate(-3px, 4px);
            width: 50px;
          }
        }
      }
    }
  }
  &.fixed-header {
    height: 0;
    animation: fadeOutBigger 0.3s ease-out forwards;
    .wrapper {
      transition: 0.1s background-color linear;
      position: fixed !important;
      top: 0;
      z-index: 1000;
      opacity: 0;
      height: 5rem;
      animation: fadeIn 0.3s ease-out forwards;
      .right-menu {
        @media screen and (min-width: $md) {
          .button.border_white {
            background-color: transparent;
            color: $green;
            border: 3px solid $green;
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
