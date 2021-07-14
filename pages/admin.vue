<template>
  <div class="admin-pages">
    <div class="container">
      <div class="buttons-bar">
        <nuxt-link class="button green md" to="/admin/users">
          Utilisateurs
        </nuxt-link>
        <nuxt-link class="button green md" to="/admin/domains">
          Domaines
        </nuxt-link>
      </div>
      <nuxt-child :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPages',
  middleware: ['auth', 'admin'],
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
.admin-pages {
  .container {
    flex-direction: column;
    align-items: center;
    .block {
      .head {
        align-items: center;
        height: 92px;
        .infos {
          h5 {
            font-size: 24px;
            font-weight: 500;
            margin-bottom: 6px;
          }
          p {
            font-size: 15px;
            font-weight: 400;
          }
        }
        .search-bar {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          border-radius: 6px;
          min-width: 400px;
          input {
            border-radius: 6px;
          }
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
      justify-content: center;
      margin: 24px -12px 16px;
      /* stylelint-disable-next-line  */
      .button {
        margin: 0 16px;
        max-width: none;
      }
    }
  }
}
.vuetable-body-wrapper {
  max-height: 50vh;
  overflow-y: auto;
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
        padding: 12px 24px 12px 0;
        font-size: 15px;
        text-align: left;
        cursor: pointer;
        text-overflow: ellipsisdden;
      }
    }
  }
  .vuetable-td-id,
  .vuetable-th-id {
    padding-left: 16px !important;
  }
  .vuetable-empty-result {
    display: none;
  }
}
</style>
