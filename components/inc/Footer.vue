<template>
  <footer>
    <div class="content">
      <div class="items">
        <div class="item a-propos">
          <div class="title">
            <Nature />
            <nuxt-link to="/annexes/a-propos">
              <h5>QUI SOMMES NOUS</h5>
            </nuxt-link>
          </div>
          <p>
            Un jeu qui vous permet de tester vos connaissances sur l’impact
            environnemental de votre consommation et d'apprendre.
          </p>
          <div class="title subtitle">
            <Nature />
            <h5>MODES D'EMPLOIS</h5>
          </div>
          <a class="big-link" href="/MODE_EMPLOI_JOUEUR.pdf" target="blank"
            >Partenaire</a
          >
          <span class="separator">•</span>
          <a
            class="big-link"
            href="/MODE_EMPLOI_CONTRIBUTEUR.pdf"
            target="blank"
            >Contributeur</a
          >
          <span class="separator">•</span>
          <a class="big-link" href="/MODE_EMPLOI_PARTENAIRE.pdf" target="blank"
            >Joueur</a
          >
        </div>
        <div class="item contact">
          <div class="title">
            <Nature />
            <h5>NOS ENGAGEMENTS</h5>
          </div>
          <nuxt-link class="link" to="/annexes/charte-bio2game">
            La Charte Bio2Game
          </nuxt-link>
          <!-- Dans le login -->
          <nuxt-link class="link" to="/annexes/cgu">
            Conditions générales d'utilisation
          </nuxt-link>
          <nuxt-link class="link" to="/annexes/donnees-personnelles">
            Politique de protection des données personnelles
          </nuxt-link>
          <nuxt-link class="link" to="/annexes/cookies"
            >Utilisation des cookies</nuxt-link
          >
        </div>
        <div class="item social">
          <div class="title">
            <Nature />
            <h5>DOSSIERS DE PRESSE</h5>
          </div>
          <a class="link" href="/Dossier_de_presse_JMDL.pdf" target="blank">
            Presse journée mondiale de l'eau
          </a>
          <a class="contact-button" href="mailto:contact@bio2game.com"
            >Contactez nous</a
          >
        </div>
      </div>
    </div>
    <div class="copyright">
      <p class="text">
        Copyright Bio2Game 2018 - {{ new Date().getFullYear() }} © - All rights
        reserved - Développé par
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
  position: relative;
  display: flex;
  align-items: center;
  background: url('../../assets/images/footer.jpg');
  flex-direction: column;
  background-size: cover;
  background-position: center;

  .content {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 40px;
    background-color: #212522c9;

    .items {
      display: flex;
      width: 100%;
      margin: 0 auto;
      max-width: 1150px;

      .item {
        flex: 1;

        .title {
          position: relative;
          display: flex;
          margin-bottom: 16px;

          &.subtitle {
            margin-top: 24px;
            margin-bottom: 8px;
          }

          h5 {
            margin: 0;
            color: white;
            font-size: 14px;
            padding-left: 15px;
          }

          a {
            text-decoration: none;
            color: white;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        p {
          width: 80%;
          color: #ffffff;
          font-size: 12px;
          line-height: 20px;
          margin-bottom: 10px;
        }

        .separator {
          color: $green;
        }

        a.big-link {
          color: $green;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          text-transform: uppercase;
        }

        &.contact {
          display: flex;
          flex-direction: column;
        }

        a.link {
          padding: 6px 0;
          color: #ffffff;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.3s ease-in-out;

          &:hover {
            color: $green;
          }
        }

        &.social {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .contact-button {
          padding: 8px 14px;
          border: 2px solid $green;
          color: $green;
          font-size: 11px;
          font-weight: 600;
          line-height: 14px;
          border-radius: 30px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s ease-in-out;
          margin-top: 16px;

          &:hover {
            color: #3b413e;
            background-color: $green;
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
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    background-color: #1a1d1be3;

    .text {
      padding: 0 20px;
      color: #757575;
      font-size: 14px;

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
      right: 0;
      cursor: pointer;
      bottom: 0;
      border-bottom: 90px solid $green;
      border-left: 90px solid transparent;

      & + svg {
        position: absolute;
        z-index: 1;
        right: 15px;
        color: #ffffff;
        cursor: pointer;
        bottom: 20px;
        transition: opacity 0.3s;
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
