<template>
  <div class="header" :class="{ 'fixed-header': isFixed, stage }">
    <div class="wrapper">
      <div class="container menu">
        <div class="left-menu">
          <nuxt-link to="/">
            <img class="logo" src="/images/logo.png" alt="Logo Bio2Game" />
          </nuxt-link>
          <nuxt-link class="link" to="/">Accueil</nuxt-link>
          <nuxt-link class="link" to="/quizs">Quizs</nuxt-link>
          <nuxt-link class="link" to="/parties">Parties</nuxt-link>
        </div>
        <div v-if="!$auth.loggedIn" class="right-menu">
          <nuxt-link class="button md green" to="/">
            Créer un quiz
          </nuxt-link>
          <nuxt-link class="button md gray right" to="/login">
            Se connecter
          </nuxt-link>
        </div>
        <div v-else class="right-menu">
          <div
            class="user"
            :class="{ active: toggleUserMenu }"
            @click="toggleUserMenu = !toggleUserMenu"
          >
            <Avatar
              class="avatar"
              :email="$auth.user.email"
              :path="$auth.user.path"
              :name="$auth.user.username"
              :size="32"
            />
            <span>{{ $auth.user.username }}</span>
            <ul v-if="toggleUserMenu">
              <nuxt-link to="/profil">Mon profil</nuxt-link>
              <nuxt-link to="/quizs">Mes domaines</nuxt-link>
              <nuxt-link to="/quizs">Mes favoris</nuxt-link>
              <nuxt-link to="/quizs">Mes quiz</nuxt-link>
              <a href="" @click.prevent="logout()">Déconnexion</a>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <notifications group="auth" classes="notifications" />
  </div>
</template>

<script>
import Avatar from '@/components/elements/AvatarElement'

export default {
  components: {
    Avatar,
  },
  data() {
    return {
      isFixed: false,
      stage: false,
      toggleUserMenu: false,
    }
  },
  watch: {
    $route(newRoute, oldRoute) {
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
    checkHeader() {
      if (this.$route.name !== 'index') {
        this.isFixed = true
        return
      }

      const position = window.pageYOffset || document.documentElement.scrollTop
      const isScrollingUp = this.isFixed ? position > 0 : position > 0

      if (this.isFixed !== isScrollingUp) {
        this.isFixed = isScrollingUp
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
    .menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left-menu {
        display: flex;
        align-items: center;
        a .logo {
          height: 4rem;
          margin-top: -10px;
        }
        .link {
          font-weight: 500;
          font-size: 1rem;
          line-height: 24px;
          color: #4f4f4f;
          margin: 0 0.8rem;
          text-decoration: none;
        }
      }
      .right-menu {
        display: flex;
        .user {
          display: flex;
          align-items: center;
          padding: 18px 20px;
          position: relative;
          text-decoration: none;
          cursor: pointer;
          user-select: none;
          @media screen and (max-width: 680px) {
            display: none;
          }
          .avatar {
            height: 32px;
            width: 32px;
            border: 2px solid $green;
            border-radius: 16px;
            margin-right: 8px;
          }
          & > span {
            display: flex;
            align-items: center;
            color: #000000;
            font-size: 19px;
            i {
              font-size: 30px;
              margin-top: 2px;
            }
          }
          ul {
            width: 100%;
            position: absolute;
            flex-direction: column;
            top: 0;
            right: 0;
            transform: translateY(60px);
            background-color: #ffffff;
            border: 1px solid #d5d5d5;
            border-radius: 6px;
            z-index: 1000;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.175);
            a {
              padding: 16px;
              position: relative;
              transition: 0.3s background-color ease;
              text-decoration: none;
              color: #7e7e7e;
              display: flex;
              align-items: center;
              i,
              svg {
                margin-right: 5px;
                position: absolute;
                top: 16px;
                left: 14px;
                font-size: 20px;
              }
              &:hover {
                background-color: #f7f7f7;
              }
            }
          }
          &.active ul {
            animation: DropDownSlide 0.3s both;
            @keyframes DropDownSlide {
              0% {
                transform: translateY(90px);
              }
              100% {
                transform: translateY(80px);
              }
            }
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
    }
    &.fixed-header {
      height: 0;
      animation: none;
      .wrapper {
        background-color: white;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
          0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
    }
  }
}
</style>
