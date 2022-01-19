<template>
  <ModalBlock
    :open="donatorStatus"
    @close="$store.commit('SET_DONATION_STATUS', false)"
  >
    <div class="donation-interface modal">
      <h2>Nous soutenir !</h2>
      <form>
        <InputElement
          v-if="needIdentity"
          :value="identity"
          type="text"
          placeholder="Prénom et Nom"
          :error="filtredErrors('identity')"
          @input="identity = $event"
        />

        <InputElement
          v-if="needIdentity"
          :value="email"
          type="email"
          placeholder="Prénom et Nom"
          :error="filtredErrors('email')"
          @input="email = $event"
        />

        <!-- 1) Sélecteur motif : Vous organisez une formation / Vous organisez une événement ponctuel -->
        <SelectorElement
          :selected="reason"
          :items="reasons"
          placeholder="Selectionner le motif"
          :error="filtredErrors('reason')"
          @input="reason = $event"
        />
        <!-- 2) Champ text  Nom de l'évènement (que pour événements) -->
        <InputElement
          v-if="reason === 'event'"
          :value="name"
          type="text"
          placeholder="Nom de l'évènement"
          :error="filtredErrors('name')"
          @input="name = $event"
        />

        <!-- 3) Date picker : Date du début de l'évènement (que pour événements) -->
        <InputElement
          v-if="reason === 'event'"
          :value="startDate"
          type="date"
          placeholder="Date du début de l'évènement"
          :error="filtredErrors('startDate')"
          @input="startDate = $event"
        />

        <!-- 4) Sélecteur Durée : Une Journées / Une semaine / Un mois (que pour événements) -->
        <SelectorElement
          v-if="reason === 'event'"
          :selected="duration"
          :items="durations"
          placeholder="Durée de l'évènement"
          :error="filtredErrors('duration')"
          @input="duration = $event"
        />

        <!-- 5) Champ text Nom de la formation (que pour formations) -->
        <InputElement
          v-if="reason === 'formation'"
          :value="name"
          type="text"
          placeholder="Nom de la formation"
          :error="filtredErrors('name')"
          @input="name = $event"
        />

        <!-- 6) Sélecteur du nombre maximum d'élèves:   (que pour formations) -->
        <SelectorElement
          v-if="reason === 'formation'"
          :selected="students"
          :items="studentsList"
          placeholder="Nombre maximum d'élèves"
          :error="filtredErrors('students')"
          @input="students = $event"
        />
        <!-- <br /> -->

        <!-- 7) Case à cocher: Vous souhaitez récupérer les résultats des participants qui l'acceptent -->
        <CheckboxElement
          id="results"
          :checked="results"
          label="Vous souhaitez récupérer les résultats des participants qui l'acceptent"
          @input="results = $event"
        />

        <!-- 8) Case à cocher: Vous souhaitez incruster les quiz et les formations de Bio2Game sur votre site et vos communications digitales -->
        <CheckboxElement
          id="iframe"
          :checked="iframe"
          label="Vous souhaitez incruster les quiz et les formations de Bio2Game sur votre site et vos communications digitales"
          @input="iframe = $event"
        />

        <div v-if="results || iframe" class="message-notif">
          Vous serez prochainement recontacté par Bio2Game afin de mettre ces
          fonctionnalités en place.
        </div>

        <!-- 10) Plusieurs boutons pour ajouter : 4 €, 10 €, 30 €, 50 €, 100 €, 500 € (que pour faire un don) -->
        <div class="donation-buttons">
          <a
            v-for="amount in donationsList"
            :key="amount"
            class="donation-button button md"
            :class="{ active: donations.includes(amount) }"
            @click="toggleDonation(amount)"
          >
            {{ amount }}€
          </a>
        </div>

        <section v-if="total" class="abstract">
          <h5>Résumé :</h5>
          <ul>
            <li v-if="totalCosts">{{ totalCosts }} € de frais</li>
            <li v-if="totalDonations">
              {{ totalDonations }} € de dons (Merci ❤️)
            </li>
          </ul>
          <p>
            TOTAL : <b>{{ total }} €</b>
          </p>
        </section>

        <div class="buttons">
          <a
            class="button white_sky sm submit"
            @click="$store.commit('SET_DONATION_STATUS', false)"
          >
            Annuler
          </a>
          <a class="button green sm submit" @click="donate()"> Don </a>
        </div>
      </form>
    </div>
  </ModalBlock>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js/pure'

export default {
  name: 'Donate',
  data() {
    return {
      reasons: [
        {
          name: 'Vous organisez une événement ponctuel',
          ref: 'event',
        },
        {
          name: 'Vous organisez une formation',
          ref: 'formation',
        },
      ],
      durations: [
        {
          name: 'Une Journée',
          ref: 'day',
        },
        {
          name: 'Une semaine',
          ref: 'week',
        },
        {
          name: 'Un mois',
          ref: 'month',
        },
      ],
      donationsList: [4, 10, 30, 50, 100, 500],
      studentsList: [
        {
          name: '40 étudiants',
          ref: 40,
        },
        {
          name: '150 étudiants',
          ref: 150,
        },
        {
          name: '500 étudiants',
          ref: 500,
        },
        {
          name: '1000 étudiants',
          ref: 1000,
        },
      ],

      identity: '',
      email: '',
      reason: null,
      name: '',
      startDate: '',
      duration: null,
      students: null,
      results: false,
      donations: [],
      iframe: false,

      stripe: null,

      errors: [],
    }
  },
  computed: {
    donatorStatus() {
      return this.$store.state.donatorStatus
    },
    total() {
      return this.totalDonations + this.totalCosts
    },
    totalDonations() {
      return this.donations.reduce((acc, current) => acc + current, 0)
    },
    totalCosts() {
      let costs = 0
      switch (this.reason) {
        case 'formation':
          switch (this.students) {
            case 40:
              costs += 4
              break
            case 150:
              costs += 10
              break
            case 500:
              costs += 20
              break
            case 1000:
              costs += 30
              break
            default:
              break
          }
          break
        case 'event':
          switch (this.duration) {
            case 'day':
              costs += 10
              break
            case 'week':
              costs += 20
              break
            case 'month':
              costs += 50
              break
            default:
              break
          }
          break

        default:
          break
      }

      return costs
    },
    needIdentity() {
      return !this.$auth.loggedIn || this.$store.state.auth.strategy === 'guest'
    },
  },
  watch: {
    donatorStatus(status) {
      if (status && this.stripe === null) {
        this.loadStripeLib()
      }
    },
  },
  methods: {
    filtredErrors(field) {
      return this.errors.find((error) => error.field === field)
    },
    async loadStripeLib() {
      this.stripe = await loadStripe(this.$config.publishableKey, {
        locale: 'fr',
      })
    },
    toggleDonation(amount) {
      if (this.donations.includes(amount)) {
        const index = this.donations.indexOf(amount)
        this.$delete(this.donations, index)
      } else {
        this.donations.push(amount)
      }
    },
    async donate() {
      try {
        if (!this.total) {
          return this.$notify({
            type: 'error',
            text: `Veuillez sélectionner des options pour faire un don.`,
            duration: 3000,
            width: 400,
          })
        }

        const session = await this.$axios.$post(`/api/payment`, {
          identity: this.needIndentity ? this.identity : null,
          email: this.needIndentity ? this.email : null,

          reason: this.reason,
          name: this.name,
          startDate: this.startDate,
          duration: this.duration,
          students: this.students,
          results: this.results,
          iframe: this.iframe,
          costs: this.totalCosts,
          donations: this.totalDonations,
        })

        this.errors = []

        if (this.stripe === null) {
          await this.loadStripeLib()
        }

        const result = await this.stripe.redirectToCheckout({
          sessionId: session.id,
        })

        if (result.error) {
          return this.$notify({
            type: 'error',
            text: `Une erreur s'est produite: ${result.error.message}`,
            duration: 3000,
            width: 400,
          })
        }
      } catch (error) {
        console.error(error)
        if (error.response) {
          this.errors = error.response.data.errors
        }
      }
    },
  },
}
</script>

<style lang="scss">
.donation-interface {
  padding: 24px;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  max-width: 500px;

  h2 {
    color: #bbe242;
    font-size: 24px;
    text-align: center;
    margin-bottom: 32px;
  }

  .input-container,
  .selector-container {
    margin: 8px 0 24px;
  }

  .checkbox span {
    color: #999999;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 20px;
  }

  .message-notif {
    padding: 16px;
    color: white;
    background-color: $green;
    border-radius: 4px;
    font-size: 14px;
  }

  .donation-buttons {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;

    .donation-button {
      color: $green;
      font-size: 16px;
      flex: 1;
      min-width: 0;
      margin-top: 16px;
      transition: 0.3s all ease;

      &.active {
        color: white;
        background-color: $green;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        // transform: scale(0.98);
      }
    }
  }

  .abstract {
    margin-bottom: 24px;

    h5 {
      color: #6c6c6c;
      font-size: 14px;
      font-weight: 500;
    }

    ul {
      margin: 8px 0;
      padding-left: 20px;

      li {
        list-style: initial;
        color: #999999;
      }
    }

    p {
      color: #6c6c6c;
    }
  }

  .buttons {
    display: flex;
    justify-content: flex-end;

    .button {
      margin: 0 0 0 16px !important;
    }
  }
}
</style>
