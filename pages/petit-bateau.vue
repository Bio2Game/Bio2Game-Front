<template>
  <div class="container petit-bateau-event">
    <div class="wrapper">
      <div class="logo">
        <PetitBateau />
      </div>
      <h1 class="title">Water Family & Bio2Game</h1>
      <div class="description">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
        necessitatibus a molestias velit fuga. Nemo repudiandae aperiam
        deserunt. Pariatur ducimus sunt eaque provident cumque eveniet fugit
        saepe incidunt officiis ipsa.
      </div>
      <div class="languages">
        <div class="lang"><LangFR /></div>
        <div class="lang"><LangEN /></div>
        <div class="lang"><LangDE /></div>
        <div class="lang"><LangIT /></div>
        <div class="lang"><LangMAR /></div>
      </div>
    </div>
  </div>
</template>

<script>
import PetitBateau from '@/assets/images/petit-bateau-event.svg?inline'

import LangFR from '@/assets/images/lang/fr.svg?inline'
import LangEN from '@/assets/images/lang/en.svg?inline'
import LangDE from '@/assets/images/lang/de.svg?inline'
import LangIT from '@/assets/images/lang/it.svg?inline'
import LangMAR from '@/assets/images/lang/mar.svg?inline'

export default {
  components: {
    PetitBateau,

    // Langs
    LangFR,
    LangEN,
    LangDE,
    LangIT,
    LangMAR,
  },
}
</script>

<style lang="scss">
.petit-bateau-event {
  display: flex;

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 70px 16px;
  }

  .logo {
    display: flex;
    max-width: 300px;
    max-height: 300px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 32px;
    line-height: 39px;
    text-align: center;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    margin-bottom: 16px;
  }

  .description {
    color: #3d3f38;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    text-align: center;
    max-width: 800px;
    margin-bottom: 32px;
  }

  .languages {
    display: grid;
    gap: 32px;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    @media screen and (max-width: 1028px) {
      // grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    max-width: 1200px;

    .lang {
      border-radius: 5px;
      position: relative;
      cursor: pointer;

      svg {
        width: 100%;
        height: 100%;
      }

      // .placeholder {
      //   padding-bottom: 65.4296875%;
      // }
    }
  }
}
</style>
