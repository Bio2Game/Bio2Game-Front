<template>
  <div :class="['route', $route.name]">
    <Header />
    <div class="db-container">
      <div class="cover-hero" />
      <Hero />
      <transition name="slide">
        <Nuxt class="page" />
      </transition>
      <Donate />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/inc/Header.vue'
import Footer from '~/components/inc/Footer.vue'
import Hero from '~/components/home/Hero.vue'

export default {
  components: {
    Header,
    Footer,
    Hero,
  },
  head: {
    meta: [
      // OpenGraph data (Most widely used)
      // {
      //   hid: 'robots',
      //   name: 'robots',
      //   content: 'noindex',
      // },
    ],
  },
}
</script>

<style lang="scss">
.slide-enter,
.slide-leave-to {
  opacity: 0;
}

.slide-leave,
.slide-enter-to {
  opacity: 1;
}

.slide-enter-active {
  position: absolute;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.6s ease-in-out;
}

.db-container {
  position: relative;
  min-height: calc(100vh - 5rem);

  .cover-hero {
    height: 0;
    transition: all 0.3s;
  }

  .page {
    position: relative;
    z-index: 3;
    padding-top: 24px;
    padding-bottom: 24px;
    min-height: calc(100vh - 5rem);
  }
}

.route.index .db-container {
  .page {
    background-color: white;
  }

  .cover-hero {
    height: 100vh;
    transition: all 0.1s;
    @media screen and (max-width: 780px) {
      height: calc(100vh + 280px);
    }
  }
}

.markdown-reset,
.editor-preview.editor-preview-active {
  blockquote {
    padding: 10px 16px;
    margin: 8px 0;
    color: #828282;
    line-height: normal;
    border-left: 5px solid $green;
  }

  ul {
    list-style: disc;
    padding-left: 32px;
    margin: 8px 0;
  }

  ol {
    list-style: decimal;
    padding-left: 32px;
    margin: 8px 0;
  }

  a {
    color: $green;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: revert;
    font-size: revert;
  }

  .quiz-sample {
    padding: 16px;
    margin: 16px 0;
    color: #2c2c2c;
    background-color: #a7a7a7;
    border-radius: 4px;
  }

  table {
    margin: 8px 0;
  }

  img {
    display: flex;
    margin: 8px 0;
  }
}

.quiz-next {
  position: relative;
  display: flex;
  overflow: hidden;
  width: calc(50% - 32px);
  margin: 0;
  cursor: default;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -1px rgba(0, 0, 0, 0.2);
  background-color: $green;
  user-select: none;
  border-radius: 16px;
  margin-right: 32px;

  .left-part {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    transition: 0.4s min-height ease;

    .icon {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 0;
      transition: 0.4s margin-left ease;

      img {
        position: relative;
        z-index: 2;
        width: 100px;
        height: 100px;
        margin: 42px;
      }

      &::after {
        position: absolute;
        z-index: 1;
        width: 140px;
        height: 140px;
        content: '';
        background-color: white;
        border-radius: 70px;
      }
    }
  }

  .right-part {
    display: flex;
    background-color: #ffffff;
    flex: 1;

    .text {
      display: flex;
      margin: 16px;
      color: #484848;
      font-size: 15px;
      flex-direction: column;

      .title {
        overflow: hidden;
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .creator {
        margin: 16px 0 0;
        color: $green;

        b {
          font-weight: 600;
        }
      }
    }

    .buttons {
      position: absolute;
      right: 16px;
      display: flex;
      justify-content: flex-end;
      bottom: 16px;

      &.two {
        justify-content: space-between;
      }

      .jouer {
        padding: 6px 24px;
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        text-transform: uppercase;
        border-radius: 15px;
        text-decoration: none;
        background-color: $green;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        transition: opacity 0.3s, background-color 0.3s, color 0.3s;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .left-part .icon img {
      width: 80px;
      height: 80px;
      margin: 30px;

      &::after {
        width: 110px;
        height: 110px;
        border-radius: 55px;
      }
    }
  }
}

.deleted-quiz {
  display: table;
  padding: 10px;
  margin: 10px;
  color: white;
  font-size: 14px;
  cursor: not-allowed;
  background-color: #bce342;
  box-shadow: 0 0 6px #00000063;
  user-select: none;
}

.vue-notification-group {
  top: 6rem !important;
  width: 400px !important;

  .notifications {
    padding: 16px;
    margin: 0 16px 8px;
    background: #ffffff;
    color: #636363;
    font-size: 14px;
    border-left: 5px solid $green;
    box-shadow: 0 3px 6px #00000033;

    &.warn {
      background: #ffb648;
      border-left-color: #f48a06;
    }

    &.error {
      background: #e54d42;
      color: #ffffff;
      border-left-color: #b82e24;
    }

    &.success {
      // background: #68cd86;
      color: #636363;
      border-left-color: $green;
    }
  }
}
</style>
