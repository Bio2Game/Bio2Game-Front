<template>
  <div class="login-page">
    <div class="modal">
      <div class="overlay" :class="{ register }">
        <div v-if="register" class="content">
          <h3>Vous avez déjà<br />un compte?</h3>
          <p>
            Cela signifie que vous êtes déjà des nôtres !<br />Connectez-vous
            dès maintenant à votre compte
          </p>
          <a class="button green md equal" @click="register = false"
            >Se connecter</a
          >
        </div>
        <div v-else class="content">
          <h3>Vous n’avez pas de compte?</h3>
          <p>
            Créer votre compte gratuitement et commencez<br />dès maintenant à
            jouer à nos quizz
          </p>
          <a class="button green md equal" @click="register = true"
            >Créer un compte</a
          >
        </div>
      </div>
      <div class="part register-part">
        <h1>Créer un compte</h1>
        <Input
          v-model="pseudo"
          type="text"
          placeholder="Pseudonyme"
          :error="error"
        />
        <Input
          v-model="email"
          type="email"
          placeholder="Email"
          :error="error"
        />
        <Input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          :error="error"
        />
        <Input
          v-model="password_confirmation"
          type="password"
          placeholder="Confirmez votre mot de passe"
          :error="error"
        />
        <a class="button green md full" @click="register()">Créer mon compte</a>
      </div>
      <div class="part login-part">
        <h1>Connectez vous</h1>
        <Input
          v-model="email"
          type="email"
          placeholder="Email"
          :error="error"
        />
        <Input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          :error="error"
        />
        <a href="/connexion/forgot" class="password">Mot de passe oublié ?</a>

        <div class="group">
          <Checkbox
            id="remember"
            :checked="remember"
            label="Se souvenir de moi"
          />
          <a class="button green sm" @click="login()">Connexion</a>
        </div>
        <hr />
        <p class="description">Connectez vous avez vos réseaux sociaux</p>

        <div class="social">
          <a class="social-link facebook" href="/connexion/facebook">
            <Facebook />
          </a>
          <a class="social-link google" href="/connexion/google">
            <Google />
          </a>
          <a class="social-link twitter" href="/connexion/twitter">
            <Twitter />
          </a>
          <a class="social-link likedin" href="/connexion/likedin">
            <Linkedin />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '@/components/elements/InputElement.vue'
import Facebook from '@/assets/icons/facebook.svg?inline'
import Google from '@/assets/icons/google.svg?inline'
import Twitter from '@/assets/icons/twitter.svg?inline'
import Linkedin from '@/assets/icons/linkedin.svg?inline'

import Checkbox from '@/components/elements/CheckboxElement.vue'

export default {
  name: 'Login',
  components: {
    Input,
    Facebook,
    Google,
    Twitter,
    Linkedin,
    Checkbox,
  },
  data() {
    return {
      pseudo: '',
      email: '',
      password: '',
      password_confirmation: '',
      error: false,
      register: false,
      remember: true,
    }
  },
  methods: {
    async login() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        // eslint-disable-next-line no-console
        console.log(response)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    },
  },
}
</script>

<style lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  .modal {
    width: 100%;
    max-width: 850px;
    display: flex;
    margin: 50px 0;
    background-color: #ffffff;
    border-radius: 16px;
    position: relative;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
    .part {
      display: flex;
      flex: 1 0;
      flex-direction: column;
      padding: 48px;
      h1 {
        font-weight: bold;
        font-size: 35px;
        text-align: center;
        color: $green;
        margin-bottom: 30px;
      }
      .input-field {
        margin: 7px 0;
      }
      .group {
        display: flex;
        label {
          margin: auto 0;
          flex: 1;
        }
        input[type='submit'] {
          padding: 10px 14px;
        }
      }
      hr {
        width: 100%;
        margin-top: 24px;
        border: 1px solid #999999;
      }
      .password {
        color: #19683b;
        font-size: 14px;
        margin: -6px 0 16px;
        display: flex;
        justify-content: flex-end;
        text-decoration: none;
        font-weight: 500;
      }
      .description {
        text-align: center;
        margin-top: 16px;
        font-size: 14px;
        color: #999999;
      }
      .social {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
        gap: 12px;
        margin-top: 26px;
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          color: #ffffff;
          height: 52px;
          font-size: 60px;
          border-radius: 6px;
          svg {
            width: 28px;
          }
        }
        .facebook {
          background-color: #3b5998;
        }
        .google {
          background-color: #dd4b39;
        }
        .twitter {
          background-color: #00acee;
        }
        .likedin {
          background-color: #0e76a8;
        }
      }
    }
    .overlay {
      position: absolute;
      width: 50%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      flex: 1 0;
      background: linear-gradient(
          0deg,
          rgba(33, 37, 34, 0.85),
          rgba(33, 37, 34, 0.85)
        ),
        url('/images/login.jpg');
      background-size: cover;
      padding: 40px;
      z-index: 10;
      border-radius: 16px;
      transition: transform 0.3s ease;
      &.register {
        transform: translateX(100%);
      }
      .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        h3 {
          font-weight: 300;
          font-size: 32px;
          color: #ffffff;
          line-height: 40px;
          margin-bottom: 10px;
        }
        p {
          font-size: 11px;
          line-height: 13px;
          color: #999999;
          margin-bottom: 15px;
        }
      }
    }
  }
  &.register .model {
    @media screen and (max-width: 600px) {
      flex-flow: column;
    }
  }
}
</style>
