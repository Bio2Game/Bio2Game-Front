<template>
  <div class="login-page">
    <div class="modal">
      <div class="overlay" :class="{ register: isRegister }">
        <div v-if="isRegister" class="content">
          <h3>Vous avez déjà <br />un compte?</h3>
          <p>
            Cela signifie que vous êtes déjà des nôtres !<br />Connectez-vous
            dès maintenant à votre compte
          </p>
          <a class="button green md equal" @click="switchForm(false)"
            >Se connecter</a
          >
        </div>
        <div v-else class="content">
          <h3>Vous n’avez pas de compte?</h3>
          <p>
            Créer votre compte gratuitement et commencez<br />dès maintenant à
            jouer à nos quizz
          </p>
          <a class="button green md equal" @click="switchForm(true)"
            >Créer un compte</a
          >
        </div>
      </div>
      <div class="parts" :class="{ wrap: !isRegister }">
        <div class="part register-part">
          <h1>Créer un compte</h1>
          <InputElement
            v-model="username"
            type="text"
            placeholder="Pseudonyme"
            :error="filtredErrors('username')"
          />
          <InputElement
            v-model="email"
            type="email"
            placeholder="Email"
            :error="filtredErrors('email')"
          />
          <InputElement
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            :error="filtredErrors('password')"
            @keydown.enter.native="register()"
          />
          <a class="button green md full" @click="register()"
            >Créer mon compte</a
          >
        </div>
        <div class="part login-part">
          <h1>Connectez vous</h1>
          <InputElement
            v-model="email"
            type="email"
            placeholder="Email"
            :error="filtredErrors('email')"
          />
          <InputElement
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            :error="filtredErrors('password')"
            @keydown.enter.native="login()"
          />
          <div class="password">
            <nuxt-link to="/login/forgot">Mot de passe oublié ?</nuxt-link>
          </div>

          <div class="group">
            <CheckboxElement
              id="remember"
              :checked="remember"
              label="Se souvenir de moi"
            />
            <a class="button green sm" @click="login()">Connexion</a>
          </div>
          <hr />
          <p class="description">Connectez vous avez vos réseaux sociaux</p>

          <div class="social">
            <a class="social-link facebook" href="/login/facebook">
              <Facebook />
            </a>
            <a class="social-link google" href="/login/google">
              <Google />
            </a>
            <a class="social-link twitter" href="/login/twitter">
              <Twitter />
            </a>
            <a class="social-link likedin" href="/login/likedin">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Facebook from '@/assets/icons/facebook.svg?inline'
import Google from '@/assets/icons/google.svg?inline'
import Twitter from '@/assets/icons/twitter.svg?inline'
import Linkedin from '@/assets/icons/linkedin.svg?inline'

export default {
  name: 'Login',
  components: {
    Facebook,
    Google,
    Twitter,
    Linkedin,
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errors: [],
      isRegister: false,
      remember: true,
    }
  },
  methods: {
    filtredErrors(field) {
      return this.errors.find(error => error.field === field)
    },
    switchForm(value) {
      this.isRegister = value
      this.errors = []
    },
    async login() {
      try {
        await this.$auth.login({
          data: {
            email: this.email,
            password: this.password,
          },
        })
        // eslint-disable-next-line no-console
        this.$notify({
          type: 'success',
          text: 'Merci de vous être connecté !',
          duration: 3000,
          width: 400,
        })
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect)
        }
      } catch (err) {
        const messages = err.response.data.messages
        if (messages) {
          this.errors = messages.errors
        }
      }
    },
    async register() {
      try {
        await this.$axios.post('/api/auth/user/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        await this.$auth.login({
          data: {
            email: this.email,
            password: this.password,
          },
        })
        this.$notify({
          type: 'success',
          text: 'Merci de vous être inscrit !',
          duration: 3000,
          width: 400,
        })
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect)
        }
      } catch (err) {
        const messages = err.response.data.messages
        if (messages) {
          this.errors = messages.errors
        }
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
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: $md) {
    padding: 0 !important;
  }
  .modal {
    position: relative;
    display: flex;
    width: 100%;
    margin: 50px 0;
    max-width: 850px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
    @media screen and (max-width: $md) {
      overflow: hidden;
      margin: 0;
      flex-direction: column;
      border-radius: 0;
    }
    .parts {
      display: flex;
      width: 100%;
      max-width: 100%;
      @media screen and (max-width: $md) {
        overflow: hidden;
        &.wrap .part {
          transform: translateX(-100%);
        }
      }
      .part {
        display: flex;
        padding: 48px 32px;
        flex: 1 0;
        flex-direction: column;
        transition: transform 0.3s ease-in-out;
        @media screen and (max-width: $md) {
          min-width: 100%;
        }
        h1 {
          color: $green;
          font-size: 35px;
          font-weight: bold;
          text-align: center;
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
          border: 1px solid #999999;
          margin-top: 24px;
        }
        .password {
          display: flex;
          justify-content: flex-end;
          margin: -6px 0 16px;
          a {
            color: #19683b;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
          }
        }
        .description {
          color: #999999;
          font-size: 14px;
          text-align: center;
          margin-top: 16px;
        }
        .social {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
          gap: 12px;
          margin-top: 26px;
          .social-link {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 52px;
            color: #ffffff;
            font-size: 60px;
            flex: 1;
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
    }
    .overlay {
      position: absolute;
      z-index: 10;
      top: -8px;
      display: flex;
      align-items: flex-end;
      width: calc(50% + 8px);
      padding: 48px;
      background: linear-gradient(
          0deg,
          rgba(33, 37, 34, 0.85),
          rgba(33, 37, 34, 0.85)
        ),
        url('../../assets/images/login.jpg');
      left: -8px;
      bottom: -8px;
      flex: 1 0;
      background-size: cover;
      border-radius: 16px;
      box-shadow: 0 3px 16px rgba(0, 0, 0, 0.5);
      transition: transform 0.3s ease-in-out;

      @media screen and (max-width: $md) {
        position: relative;
        top: 0;
        width: 100%;
        padding: 24px;
        left: 0;
        border-radius: 0 0 16px 16px;
        br {
          display: none;
        }
      }

      &.register {
        transform: translateX(100%);
        @media screen and (max-width: $md) {
          transform: translate(0);
        }
      }
      .content {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        h3 {
          color: #ffffff;
          font-size: 32px;
          font-weight: 300;
          line-height: 40px;
          margin-bottom: 10px;
          @media screen and (max-width: $md) {
            font-size: 24px;
            line-height: 32px;
          }
        }
        p {
          color: #999999;
          font-size: 12px;
          line-height: 14px;
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
