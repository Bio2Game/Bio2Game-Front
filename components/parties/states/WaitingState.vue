<template>
  <div class="wating">
    <div class="loader">
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__ball"></div>
    </div>
    <h4>En attente des joueurs</h4>
    <div class="sharing">
      <input
        type="text"
        :value="gamelink"
        readonly="readonly"
        data-position="top"
        data-tooltip="Cliquer pour copier"
        @click="copy"
      />
      <div class="socials">
        <a :href="facebooklink" class="facebook" target="blank"
          ><FacebookIcon
        /></a>
        <a href="" class="google"><GoogleIcon /></a>
        <a :href="twitterlink" class="twitter" target="blank"
          ><TwitterIcon
        /></a>
        <a :href="mailtolink" class="email" target="blank"><MailIcon /></a>
      </div>
    </div>
  </div>
</template>

<script>
import FacebookIcon from '@/assets/icons/socials/facebook.svg?inline'
import GoogleIcon from '@/assets/icons/socials/google.svg?inline'
import TwitterIcon from '@/assets/icons/socials/twitter.svg?inline'
import MailIcon from '@/assets/icons/socials/mail.svg?inline'

export default {
  name: 'WaitingState',
  components: {
    FacebookIcon,
    GoogleIcon,
    TwitterIcon,
    MailIcon,
  },
  computed: {
    gamelink() {
      return `https://www.bio2game.com${this.$route.path}`
    },
    facebooklink() {
      return `https://www.facebook.com/sharer/sharer.php?u=https://www.bio2game.com${this.$route.path}`
    },
    twitterlink() {
      return `https://twitter.com/intent/tweet?text=Rejoignez%20dès%20maintenant%20mon%20quiz%20sur%20Bio2Game:%0Ahttps%3A%2F%2Fbio2game.com${this.$route.path}&via:bio2game`
    },
    mailtolink() {
      return `mailto:?subject=Rejoint%20mon%20quiz%20sur%20Bio2Game&body=Rejoint%20dès%20maintenant%20mon%20quiz%20sur%20Bio2Game%20:%0Ahttps%3A%2F%2Fbio2game.com${this.$route.path}`
    },
  },
  methods: {
    copy(el) {
      el.toElement.select()
      document.execCommand('copy')
      el.toElement.setAttribute('data-tooltip', 'Copié !')
      el.toElement.setAttribute('data-tooltip', 'Cliquer pour copier')
    },
  },
}
</script>

<style lang="scss">
.wating {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 50vh;
  .loader {
    position: relative;
    width: 75px;
    height: 100px;
    margin: -20px auto 0;

    &__bar {
      position: absolute;
      bottom: 0;
      width: 10px;
      height: 50%;
      background: $green;
      transform-origin: center bottom;

      &:nth-child(1) {
        left: (1 - 1) * 15px;
        transform: scale(1, 1 * 0.2);
        animation: barUp1 4s infinite;
      }
      &:nth-child(2) {
        left: (2 - 1) * 15px;
        transform: scale(1, 2 * 0.2);
        animation: barUp2 4s infinite;
      }
      &:nth-child(3) {
        left: (3 - 1) * 15px;
        transform: scale(1, 3 * 0.2);
        animation: barUp3 4s infinite;
      }
      &:nth-child(4) {
        left: (4 - 1) * 15px;
        transform: scale(1, 4 * 0.2);
        animation: barUp4 4s infinite;
      }
      &:nth-child(5) {
        left: (5 - 1) * 15px;
        transform: scale(1, 5 * 0.2);
        animation: barUp5 4s infinite;
      }
    }

    &__ball {
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 10px;
      height: 10px;
      background: #44eaca;
      border-radius: 50%;
      animation: ball 4s infinite;
    }
  }

  h4 {
    font-size: 20px;
    text-align: center;
    color: #585858;
    margin: 24px 0 16px;
  }
  .sharing {
    padding: 24px;

    input {
      background-color: white;
      border: 2px solid $green;
      border-radius: 8px;
      padding: 12px 16px;
      width: 435px;
      text-align: center;
      font-size: 16px;
      transition: border-color 0.2s ease-out;
      box-shadow: 0 2px 8px #00000022;
      outline: none;
      margin-bottom: 16px;
    }

    .socials {
      display: flex;
      justify-content: space-between;
      margin: 0 -12px 0;
      a {
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #19683b;
        flex: 1;
        height: 50px;
        margin: 8px 12px 0;
        transition: transform 0.1s ease-in, box-shadow 0.1s ease-out;
        box-shadow: 0 3px 6px #00000044;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 6px #00000044;
        }
        &.facebook {
          background-color: #4267b2;
        }
        &.google {
          background-color: #dd4b39;
        }
        &.twitter {
          background-color: #1da1f2;
        }
        &.email {
          background-color: #858585;
        }
        i {
          color: white;
          font-size: 40px;
        }
      }
    }
  }
}

@keyframes ball {
  0% {
    transform: translate(0, 0);
  }
  5% {
    transform: translate(8px, -14px);
  }
  10% {
    transform: translate(15px, -10px);
  }
  17% {
    transform: translate(23px, -24px);
  }
  20% {
    transform: translate(30px, -20px);
  }
  27% {
    transform: translate(38px, -34px);
  }
  30% {
    transform: translate(45px, -30px);
  }
  37% {
    transform: translate(53px, -44px);
  }
  40% {
    transform: translate(60px, -40px);
  }
  50% {
    transform: translate(60px, 0);
  }
  57% {
    transform: translate(53px, -14px);
  }
  60% {
    transform: translate(45px, -10px);
  }
  67% {
    transform: translate(37px, -24px);
  }
  70% {
    transform: translate(30px, -20px);
  }
  77% {
    transform: translate(22px, -34px);
  }
  80% {
    transform: translate(15px, -30px);
  }
  87% {
    transform: translate(7px, -44px);
  }
  90% {
    transform: translate(0, -40px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes barUp1 {
  0% {
    transform: scale(1, 0.2);
  }
  40% {
    transform: scale(1, 0.2);
  }
  50% {
    transform: scale(1, 1);
  }
  90% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 0.2);
  }
}
@keyframes barUp2 {
  0% {
    transform: scale(1, 0.4);
  }
  40% {
    transform: scale(1, 0.4);
  }
  50% {
    transform: scale(1, 0.8);
  }
  90% {
    transform: scale(1, 0.8);
  }
  100% {
    transform: scale(1, 0.4);
  }
}
@keyframes barUp3 {
  0% {
    transform: scale(1, 0.6);
  }
  100% {
    transform: scale(1, 0.6);
  }
}
@keyframes barUp4 {
  0% {
    transform: scale(1, 0.8);
  }
  40% {
    transform: scale(1, 0.8);
  }
  50% {
    transform: scale(1, 0.4);
  }
  90% {
    transform: scale(1, 0.4);
  }
  100% {
    transform: scale(1, 0.8);
  }
}
@keyframes barUp5 {
  0% {
    transform: scale(1, 1);
  }
  40% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 0.2);
  }
  90% {
    transform: scale(1, 0.2);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
