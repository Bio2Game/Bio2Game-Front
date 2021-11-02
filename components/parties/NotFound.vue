<template>
  <div class="not-found">
    <div class="head">
      <h1>
        <img
          src="../../assets/images/logo.png"
          alt="Logo Bio2Game"
          title="Bio2Game"
        />
        <div v-html="getCode(error.error)" />
      </h1>
      <h4>{{ error.message }}</h4>
    </div>
    <div class="buttons">
      <nuxt-link to="/parties" class="button green lg">
        Changer de partie
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getCode(code) {
      const caracters = code.toString().split('')
      return caracters
        .map((c, index) => (index % 2 ? `<span>${c}</span>` : c))
        .join('')
    },
  },
}
</script>

<style lang="scss">
.not-found {
  margin: 20vh auto 0;
  max-width: 600px;

  .head {
    text-align: center;

    h1 {
      display: flex;
      justify-content: center;
      align-items: center;
      color: $green;
      font-size: 160px;
      font-weight: 900;
      margin-bottom: 0;
      user-select: none;

      div {
        text-shadow: 0 1px 6px #00000040;
      }

      span {
        color: #ffffff;
      }

      img {
        height: 150px;
      }

      @media screen and (max-width: 720px) {
        font-size: 120px;

        img {
          height: 130px;
        }
      }
    }

    h4 {
      margin: 5px 0 20px;
      color: #272727;
      font-size: 26px;
      @media screen and (max-width: 720px) {
        font-size: 20px;
      }
    }
  }

  .buttons {
    display: flex;
    justify-content: center;

    .button {
      max-width: 100%;
      width: 100%;
    }
  }
}
</style>
