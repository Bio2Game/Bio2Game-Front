<template>
  <div class="quiz-creation">
    <nuxt-child :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  name: 'Contributor',
}
</script>

<style lang="scss">
.quiz-creation {
  .container {
    flex-direction: column;
    .buttons-bar {
      display: flex;
      justify-content: space-between;
      margin: 24px -12px 0;
      .button {
        flex: 1;
        margin: 0 12px;
        max-width: none;
      }
    }
    .block {
      .head {
        align-items: center;
        .section {
          display: flex;
          flex-direction: column;
          flex: 1 0;
          margin-left: 24px;
          &:first-child {
            margin-left: 0;
          }
        }
        .button {
          margin-left: 24px;
        }
      }
      .content {
        min-height: calc(50vh);
        .big {
          width: 45%;
        }
        .no-elements {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          h3 {
            font-weight: 700;
            font-size: 32px;
            color: $green;
            margin-bottom: 16px;
          }
          p {
            color: #777777;
            font-size: 16px;
            margin-bottom: 24px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
