<template>
  <div class="quiz-creation">
    <nuxt-child :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  name: 'Contributor',
  middleware: ['auth', 'contributor'],
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.quiz-creation {
  .container {
    flex-direction: column;
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
          width: 40%;
        }
        .no-elements {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          h3 {
            color: $green;
            font-size: 32px;
            font-weight: 700;
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
    .buttons-bar {
      display: flex;
      justify-content: space-between;
      margin: 24px -12px 0;
      /* stylelint-disable-next-line  */
      .button {
        flex: 1;
        margin: 0 12px;
        max-width: none;
      }
    }
  }
}
.vuetable {
  display: table;
  table-layout: fixed;
  width: 100%;
  thead {
    border-bottom: 1px solid #8b8b8b;
    margin: 0 -24px;
    th {
      position: relative;
      padding: 16px 0;
      font-size: 15px;
      font-weight: 600;
      text-align: left;
      transition: 0.3s color ease-in-out;
      user-select: none;
      i {
        position: absolute;
        margin: -1px 0 0 5px;
        font-size: 18px;
      }
      &.sorted-asc,
      &.sorted-desc,
      &.sortable:hover {
        color: $green;
        cursor: pointer;
        i {
          color: $green;
        }
      }
      &:first-child() {
        padding-left: 16px;
      }
    }
  }
  .vuetable-body {
    tr {
      &:nth-child(2n + 1) {
        background-color: #cecece26;
      }
      td {
        overflow: hidden;
        height: 20px;
        padding: 12px 24px 12px 0;
        font-size: 15px;
        line-height: 20px;
        text-align: left;
        cursor: pointer;
        vertical-align: middle;
        text-overflow: ellipsisdden;
      }
    }
  }
  .vuetable-empty-result {
    display: none;
  }
}
</style>
