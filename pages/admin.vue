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
        <nuxt-link class="button green md" to="/admin/icons">Icones</nuxt-link>
      </div>
      <nuxt-child :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPages',
}
</script>

<style lang="scss">
.admin-pages {
  .container {
    flex-direction: column;
    .block {
      .head {
        align-items: center;
        height: 92px;
        .infos {
          h5 {
            font-weight: 500;
            font-size: 24px;
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
</style>
