<template>
  <section class="profil-page container">
    <div class="user-card block">
      <div class="user">
        <label for="avatar" class="image"
          ><AvatarElement
            :name="$auth.user.username"
            :email="$auth.user.email"
            :path="$auth.user.avatar_path"
            :size="160"
          />
          <div v-if="isIndex" class="cover"></div>
          <span v-if="isIndex" class="target">Modifier</span>
          <input
            v-if="isIndex"
            id="avatar"
            type="file"
            name="avatar"
            class="form-control"
            accept="image/*"
          />
        </label>

        <h5 class="username">{{ $auth.user.username }}</h5>
        <h6 class="fullname">{{ $auth.user.name }}</h6>
      </div>
      <div class="infos">
        <div class="info">
          <span>Adresse email</span>
          <p>{{ $auth.user.email }}</p>
        </div>

        <div class="info">
          <span>Date de naissance</span>
          <p>{{ $auth.user.birthDate || 'Aucune date de naissance' }}</p>
        </div>

        <div class="info">
          <span>Adresse</span>
          <p>{{ $auth.user.localisation || 'Aucune adresse' }}</p>
        </div>
      </div>
      <nuxt-link
        v-if="!$auth.user.status && isIndex"
        to="/profil/become"
        class="before button md green"
      >
        Devenir contributeur
      </nuxt-link>
    </div>
    <div class="forms ml-3">
      <nuxt-child />
    </div>
  </section>
</template>

<script>
import meta from '@/mixins/meta.js'

export default {
  name: 'Profil',
  middleware: ['auth', 'user'],
  computed: {
    isIndex() {
      return this.$route.name === 'profil'
    },
  },
  head() {
    return meta.get({
      name: 'Profil',
      description:
        'Jeu pour apprendre à consommer de façon responsable en testant vos connaissances dans le développement durable. En adhérant à BIO2GAME vous partagerez vos préoccupations environnementales.',
      slug: 'profil',
    })
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

.profil-page {
  display: flex;
  @media screen and (max-width: $sm) {
    flex-direction: column;
    .forms.ml-3 {
      margin-left: 0;
      margin-top: 24px;
    }
  }
  .block {
    &:first-child {
      margin-top: 0;
    }
    &.user-card {
      display: flex;
      flex-direction: column;
      padding: 0;
      min-width: 300px;
      .user {
        padding: 24px;
        background-color: $green;
        border-radius: 8px 8px 0 0;
        .image {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
          .cover {
            position: absolute;
            z-index: 2;
            top: 0;
            width: 160px;
            border: 3px solid #ffffff;
            cursor: pointer;
            bottom: 0;
            background-color: #0000001f;
            border-radius: 80px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            &:hover {
              opacity: 1;
            }
          }
          img {
            border: 3px solid #ffffff;
            border-radius: 80px;
            &:hover + .cover {
              opacity: 1;
            }
          }
          .target {
            position: absolute;
            z-index: 3;
            padding: 6px 12px;
            color: white;
            font-size: 14px;
            font-weight: 300;
            cursor: pointer;
            background-color: #3d3d3de6;
            border-radius: 4px;
            bottom: -10px;
            box-shadow: 0 1px 3px #71717199;
          }
          input {
            width: 0;
            height: 0;
            visibility: hidden;
          }
        }
        .username {
          color: #ffffff;
          font-size: 18px;
          font-weight: 600;
          text-align: center;
          margin-top: 24px;
        }
        .fullname {
          color: #4e4e4e;
          font-size: 12px;
          font-weight: 400;
          text-align: center;
          margin-top: 8px;
        }
      }
      hr {
        width: 100%;
      }
      .infos {
        padding: 24px;
        .info {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          span {
            color: #ababab;
            font-size: 10px;
            margin-bottom: 4px;
          }
          p {
            color: #717171;
            font-size: 14px;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      .badges {
        padding: 16px 24px 24px;
        .title {
          font-size: 16px;
        }
        .elements {
          display: flex;
          flex-wrap: wrap;
        }
      }
      .before {
        margin: auto 24px 24px;
        color: white;
        font-size: 14px;
      }
    }
  }
  .forms {
    position: relative;
    width: 100%;
    .animation-container {
      width: 100%;
      .content {
        display: flex;
        padding: 24px;
        @media screen and (max-width: $lg) {
          flex-direction: column;
          & > .part {
            margin-right: 0;
          }
        }
        & > .part {
          display: flex;
          flex-direction: column;
          flex: 1 0;
          .button {
            height: 44px;
            margin-top: 8px;
            box-shadow: none;
          }
        }
      }
    }
  }
}
</style>
