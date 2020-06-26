<template>
  <footer>
    <div class="content">
      <div class="items">
        <div class="item a-propos">
          <div class="title"><h5>A PROPOS</h5></div>
          <p>
            Un jeu qui vous permet de tester vos connaissances sur l’impact
            environnemental de votre consommation et d'apprendre.
          </p>
          <nuxt-link to="/a-propos">En savoir plus</nuxt-link>
        </div>
        <div class="item contact">
          <div class="title"><h5>CONTACT</h5></div>
          <nuxt-link to="/charte-bio2game">La Charte Bio2Game</nuxt-link>
          <nuxt-link to="/donnees-personnelles">
            Politique de protection des données personnelles
          </nuxt-link>
          <nuxt-link to="/cookies">Utilisation des cookies</nuxt-link>
        </div>
        <div class="item social">
          <div class="title"><h5>SOCIAL</h5></div>
          <a class="contact-button" href="mailto:">Contactez nous</a>
        </div>
      </div>
    </div>
    <div class="copyright">
      <p class="text">
        Copyright Bio2Game 2018 © - All rights reserved - Développé par
        <a href="https://www.draftman.fr">DraftMan</a>
      </p>
      <div class="scroll-top"></div>
      <i class="icon-scroll-top"></i>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style lang="scss">
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: url('/images/footer.jpg');
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
          position: relative;
          margin-bottom: 16px;
          h5 {
            padding-left: 15px;
            margin: 0;
            color: white;
            &::after {
              content: '';
              position: absolute;
              border-left: 3px solid #19683b;
              height: 100%;
              left: 2px;
            }
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
          color: #27ae60;
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
              color: #27ae60;
            }
          }
        }
        &.social {
          flex: none;
        }
        .contact-button {
          color: #27ae60;
          line-height: 34px;
          border: 2px solid #27ae60;
          border-radius: 30px;
          padding: 8px 14px;
          font-size: 11px;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease-in-out;
          &:hover {
            background-color: #27ae60;
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
    }
    .scroll-top {
      position: absolute;
      bottom: 0;
      right: 0;
      border-bottom: 90px solid #19683b;
      border-left: 90px solid transparent;
      & + i {
        position: absolute;
        bottom: 20px;
        right: 15px;
        z-index: 1;
        color: #ffffff;
        transition: opacity 0.3s;
      }
      &:hover + i,
      & + i:hover {
        opacity: 0.6;
      }
    }
    @media screen and (max-width: 720px) {
      justify-content: left;
    }
  }
}
</style>
