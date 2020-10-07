<template>
  <footer>
    <div class="content">
      <div class="items">
        <div class="item a-propos">
          <div class="title">
            <Nature />
            <h5>A PROPOS</h5>
          </div>
          <p>
            Un jeu qui vous permet de tester vos connaissances sur l’impact
            environnemental de votre consommation et d'apprendre.
          </p>
          <nuxt-link to="/a-propos">En savoir plus</nuxt-link>
        </div>
        <div class="item contact">
          <div class="title">
            <Nature />
            <h5>CONTACT</h5>
          </div>
          <nuxt-link to="/charte-bio2game">La Charte Bio2Game</nuxt-link>
          <nuxt-link to="/donnees-personnelles">
            Politique de protection des données personnelles
          </nuxt-link>
          <nuxt-link to="/cookies">Utilisation des cookies</nuxt-link>
        </div>
        <div class="item social">
          <div class="title">
            <Nature />
            <h5>SOCIAL</h5>
          </div>
          <a class="contact-button" href="mailto:">Contactez nous</a>
        </div>
      </div>
    </div>
    <div class="copyright">
      <p class="text">
        Copyright Bio2Game 2018 © - All rights reserved - Développé par
        <a class="author-link" href="https://www.draftman.fr">DraftMan</a>
      </p>
      <div class="scroll-top" @click="scrollToTop()"></div>
      <svg
        width="32"
        height="20"
        viewBox="0 0 32 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="scrollToTop()"
      >
        <path
          d="M32 16L16 0L0 16L3.90018 19.9002L16.0001 7.8003L28.0999 19.9001L32 16Z"
          fill="white"
        />
      </svg>
    </div>
  </footer>
</template>

<script>
import Nature from '@/assets/icons/nature.svg?inline'

export default {
  name: 'Footer',
  components: {
    Nature,
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
}
</script>

<style lang="scss">
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: url('../../assets/images/footer.jpg');
  background-size: cover;
  background-position: center;
  .content {
    display: flex;
    justify-content: center;
    background-color: #212522c9;
    padding: 40px;
    width: 100%;
    .items {
      width: 100%;
      max-width: 1150px;
      margin: 0 auto;
      display: flex;
      .item {
        flex: 1;
        .title {
          display: flex;
          position: relative;
          margin-bottom: 16px;
          h5 {
            padding-left: 15px;
            margin: 0;
            color: white;
          }
        }
        p {
          color: #ffffff;
          font-size: 12px;
          line-height: 20px;
          width: 80%;
          margin-bottom: 10px;
        }
        &.a-propos a {
          text-decoration: none;
          color: $green;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 14px;
        }
        &.contact {
          display: flex;
          flex-direction: column;
          a {
            text-decoration: none;
            color: #ffffff;
            padding: 6px 0;
            font-size: 13px;
            transition: color 0.3s ease-in-out;
            &:hover {
              color: $green;
            }
          }
        }
        &.social {
          flex: none;
        }
        .contact-button {
          color: $green;
          line-height: 34px;
          border: 2px solid $green;
          border-radius: 30px;
          padding: 8px 14px;
          font-size: 11px;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease-in-out;
          &:hover {
            background-color: $green;
            color: #3b413e;
          }
        }
        @media screen and (max-width: 720px) {
          margin-bottom: 40px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      @media screen and (max-width: 720px) {
        flex-direction: column;
      }
    }
  }
  .copyright {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1a1d1be3;
    width: 100%;
    height: 50px;
    .text {
      color: #757575;
      font-size: 14px;
      padding: 0 20px;
      .author-link {
        color: $green;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .scroll-top {
      position: absolute;
      bottom: 0;
      right: 0;
      border-bottom: 90px solid $green;
      border-left: 90px solid transparent;
      cursor: pointer;
      & + svg {
        position: absolute;
        bottom: 20px;
        right: 15px;
        z-index: 1;
        color: #ffffff;
        transition: opacity 0.3s;
        cursor: pointer;
      }
      &:hover + svg,
      & + svg:hover {
        opacity: 0.6;
      }
    }
    @media screen and (max-width: 720px) {
      justify-content: left;
    }
  }
}
</style>
