<template>
  <div class="waterfamily-widget" :class="{ responsive }" :style="color">
    <div class="widget-head">
      <div class="wrapper">
        <div class="logos">
          <img
            src="~/assets/images/waterfamily.png"
            alt="Logo WaterFamily"
            class="logo"
          />
          <hr />
          <img
            src="~/assets/images/logo.png"
            alt="Logo Bio2Game"
            class="logo bio2game"
          />
        </div>
        <div class="head-content">
          <h1>Journée Mondiale de l'eau</h1>
          <h2>
            <span class="waterfamily">Water Family</span> &
            <span class="bio2game">Bio2Game</span>
          </h2>
        </div>
      </div>
    </div>
    <div class="widget-content">
      <p>
        Retrouvez un quiz par jour du<br />
        <strong>7 mars</strong> au <strong>22 mars 2022</strong> !
      </p>

      <a
        class="button md"
        href="https://www.bio2game.com/quiz?query=WaterFamily"
        target="blank"
      >
        L'eau vous challenge
      </a>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'iframe',
  data() {
    return {
      responsive: this.$route.query.responsive === 'true',
    }
  },
  computed: {
    color() {
      let color = '#199eb6'
      if (this.$route.query.color) {
        switch (this.$route.query.color) {
          case 'blue':
            color = '#199eb6'
            break
          case 'green':
            color = '#bbe242'
            break
          case 'red':
            color = '#ff0000'
            break
          default:
            break
        }
      }
      return { '--widget-color': color }
    },
  },
}
</script>

<style lang="scss">
@font-face {
  font-family: 'Uni Sans';
  src: local('Uni Sans Heavy'), local('UniSansHeavy'),
    url('~/assets/fonts/UniSans.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

.waterfamily-widget {
  z-index: 3;
  overflow: hidden;
  width: 500px;
  height: 240px;
  padding: 0;
  background-color: #fcfcfc;
  min-height: 0;

  .widget-head {
    display: flex;
    justify-content: center;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);

    .wrapper {
      display: flex;
      width: 500px;
      padding: 16px;
      column-gap: 16px;

      .logos {
        display: flex;
        gap: 16px;

        .logo {
          width: 64px;
          height: 64px;
          border-radius: 32px;

          &.bio2game {
            margin-left: -8px;
            margin-right: -8px;
          }
        }

        hr {
          width: 3px;
          height: 50px;
          border: none;
          border-radius: 1.5px;
          background-color: #c7c7c7;
        }
      }

      .head-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        gap: 8px;

        h1 {
          color: var(--widget-color);
          font-family: 'Uni Sans', sans-serif;
          font-size: 20px;
          text-align: center;
          text-transform: uppercase;
        }

        h2 {
          color: var(--widget-color);
          font-size: 16px;
          font-weight: 500;
          text-align: center;

          &.bio2game {
            color: var(--widget-color);
          }

          &.waterfamily {
            color: var(--widget-color);
          }
        }
      }
    }
  }

  .widget-content {
    padding: 16px;

    p {
      color: #173455;
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
      text-align: center;
      font-style: normal;
    }

    .button {
      color: white;
      margin-top: 16px;
      background-color: var(--widget-color);
    }
  }

  &.responsive {
    width: 100%;
    height: 100vh;

    @media screen and (max-width: 470px) {
      .wrapper {
        flex-direction: column;

        .logos {
          margin: 0 auto 16px;
        }
      }
    }
  }
}
</style>
