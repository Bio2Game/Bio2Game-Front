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
          <div class="cover"></div>
          <span class="target">Modifier</span>
          <input
            id="avatar"
            type="file"
            name="avatar"
            class="form-control"
            accept="image/*"
          />
        </label>

        <h5 class="pseudo">{{ $auth.user.username }}</h5>
        <h6 class="fullName">{{ $auth.user.name }}</h6>
      </div>
      <hr />
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
      <a
        v-if="!$auth.user.status"
        href="/become-contributor"
        class="before button md green"
        >Devenir contributeur</a
      >
    </div>
    <div class="forms ml-3">
      <div class="block">
        <h5>Informations primordiales</h5>
        <div class="content">
          <div class="basics mr-3">
            <Input
              v-model="user.username"
              :value="getInfo('username')"
              type="text"
              placeholder="Pseudonyme"
              :error="filtredErrors('username')"
            />
            <Input
              v-model="user.email"
              :value="getInfo('email')"
              type="email"
              placeholder="Adresse email"
              :error="filtredErrors('email')"
            />
            <Input
              v-model="user.old_password"
              type="password"
              placeholder="Ancien mot de passe"
              :error="filtredErrors('old_password')"
            />
            <Input
              v-model="user.password"
              type="password"
              placeholder="Nouveau mot de passe"
              :error="filtredErrors('password')"
            />
          </div>
          <div class="full">
            <Input
              v-model="user.name"
              :value="getInfo('name')"
              type="text"
              name="name"
              placeholder="Nom complet"
              :error="filtredErrors('name')"
            />
            <Input
              v-model="user.birthDate"
              :value="formatDate(getInfo('birthDate'))"
              type="date"
              placeholder="Date de naissance"
              :error="filtredErrors('birthDate')"
            />
            <div class="input-field">
              <SelectorElement
                v-model="user.sex"
                :selected="getInfo('sex')"
                :items="sexes"
                :defaultValue="0"
                noSelect="Sexe"
              />
            </div>
            <div class="input-field input-with-label">
              <span>Animateurs à suivre :</span>
              <select
                v-if="all_animators.length > 0"
                name="playersAnimators"
                multiple
              >
                <option
                  v-for="(animator, index) in all_animators"
                  :key="index"
                  :value="animator.id"
                  :selected="current_animators_ids.includes(animator.id)"
                >
                  {{ animator.username }}
                </option>
              </select>
              <!-- <select v-else>
                <option selected disabled>Aucun animateur pour l'instant</option>
              </select> -->
            </div>
            <Input
              v-model="user.localisation"
              :value="getInfo('localisation')"
              type="text"
              placeholder="Localisation"
              :error="filtredErrors('localisation')"
            />
          </div>
        </div>
        <a class="button md green" @click="saveFull()">Sauvegarder</a>
      </div>
      <div class="block" v-if="$auth.user.status > 0">
        <h5>Informations contributeur</h5>
        <div class="content">
          <div class="basics mr-3"></div>
          <div class="full">
            <div class="input-field">
              <SelectorElement
                v-model="user.contributorType"
                :selected="getInfo('contributorType')"
                :items="types"
                noSelect="Contributeur"
              />
            </div>
            <div class="status-container">
              <label>
                <input
                  id="isAnimator"
                  type="checkbox"
                  name="isAnimator"
                  :checked="$auth.user.isAnimator"
                  value="1"
                />
                <span>Animateur ?</span>
              </label>
            </div>
            <Input
              v-model="user.contributor_mobile"
              :value="getInfo('contributor_mobile')"
              type="tel"
              placeholder="Numéro de téléphone (Contributeur)"
              :error="filtredErrors('contributor_mobile')"
            />
            <Input
              v-model="user.website"
              :value="getInfo('website')"
              type="url"
              placeholder="Site web (Contributeur)"
              :error="filtredErrors('website')"
            />
          </div>
        </div>
        <a class="button md green" @click="saveFull()">Sauvegarder</a>
      </div>
    </div>
  </section>
</template>

<script>
import Input from '@/components/elements/InputElement.vue'

export default {
  name: 'Profil',
  components: {
    Input,
  },
  data() {
    return {
      user: {
        username: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        sex: '',
        birthDate: '',
      },
      errors: [],
      all_animators: [],
      sexes: [
        {
          ref: 1,
          name: 'Homme',
        },
        {
          ref: 2,
          name: 'Femme',
        },
        {
          ref: 3,
          name: 'Autre',
        },
      ],
      types: [
        {
          ref: 1,
          name: 'Association',
        },
        {
          ref: 2,
          name: 'Expert',
        },
        {
          ref: 3,
          name: 'Institution',
        },
        {
          ref: 4,
          name: 'Marque',
        },
        {
          ref: 5,
          name: 'Producteur',
        },
      ],
    }
  },
  methods: {
    getInfo(key) {
      return this.user[key] !== '' ? this.user[key] : this.$auth.user[key]
    },
    formatDate(date) {
      return date
    },
    filtredErrors(field) {
      return this.errors.find((error) => error.field === field)
    },
  },
}
</script>

<style lang="scss">
.profil-page {
  display: flex;
  .block {
    background-color: $gray-light;
    padding: 24px;
    margin-top: 24px;
    &:first-child {
      margin-top: 0;
    }
    &.user-card {
      display: flex;
      flex-direction: column;
      .user {
        margin-bottom: 16px;
        .image {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
          .cover {
            position: absolute;
            top: 0;
            bottom: 0;
            background-color: #0000001f;
            border-radius: 80px;
            z-index: 2;
            width: 160px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            cursor: pointer;
            &:hover {
              opacity: 1;
            }
          }
          img {
            border-radius: 80px;
            &:hover + .cover {
              opacity: 1;
            }
          }
          .target {
            padding: 6px 12px;
            background-color: #3d3d3de6;
            font-size: 14px;
            border-radius: 4px;
            color: white;
            font-weight: 300;
            position: absolute;
            bottom: -10px;
            box-shadow: 0 1px 3px #71717199;
            cursor: pointer;
            z-index: 3;
          }
          input {
            width: 0;
            height: 0;
            visibility: hidden;
          }
        }
      }
      hr {
        width: 100%;
      }
      .infos {
        .info {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          span {
            text-transform: uppercase;
            font-size: 10px;
            color: #666666;
            margin-bottom: 4px;
          }
          p {
            font-size: 14px;
            color: #727272;
          }
        }
      }
      .before {
        margin-top: auto;
        font-size: 14px;
        color: white;
      }
    }
  }
  .forms {
    width: 100%;
    .content {
      display: flex;
      & > div {
        display: flex;
        flex-direction: column;
        flex: 1 0;
      }
      // .basics {
      // }
      // .full {
      // }
    }
  }
}
</style>
