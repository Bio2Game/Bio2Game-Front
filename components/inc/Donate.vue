<template>
  <ModalBlock
    :open="donatorStatus"
    @close="$store.commit('SET_DONATION_STATUS', false)"
  >
    <div class="donation-interface modal">
      <h2>Nous soutenir !</h2>
      <form>
        <!-- 1) Sélecteur motif : Vous organisez une formation / Vous organisez une événement ponctuel -->
        <SelectorElement
          :selected="reason"
          :items="reasons"
          placeholder="Selectionner le motif"
          @input="reason = $event"
        />
        <!-- 2) Champ text  Nom de l'évènement (que pour événements) -->
        <InputElement
          v-if="reason === 'event'"
          :value="name"
          type="text"
          placeholder="Nom de l'évènement"
          @input="name = $event"
        />

        <!-- 3) Date picker : Date du début de l'évènement (que pour événements) -->
        <InputElement
          v-if="reason === 'event'"
          :value="startDate"
          type="date"
          placeholder="Date du début de l'évènement"
          @input="startDate = $event"
        />

        <!-- 4) Sélecteur Durée : Une Journées / Une semaine / Un mois (que pour événements) -->
        <SelectorElement
          v-if="reason === 'event'"
          :selected="duration"
          :items="durations"
          placeholder="Durée de l'évènement"
          @input="duration = $event"
        />

        <!-- 5) Champ text Nom de la formation (que pour formations) -->
        <InputElement
          v-if="reason === 'formation'"
          :value="name"
          type="text"
          placeholder="Nom de la formation"
          @input="name = $event"
        />

        <!-- 6) Sélecteur du nombre maximum d'élèves:   (que pour formations) -->
        <SelectorElement
          v-if="reason === 'formation'"
          :selected="students"
          :items="studentsList"
          placeholder="Nombre maximum d'élèves"
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

        <section v-if="totalCosts + totalDonations" class="abstract">
          <h5>Résumé :</h5>
          <ul>
            <li>{{ totalCosts }} € de frais</li>
            <li v-if="totalDonations">
              {{ totalDonations }} € de dons (Merci ❤️)
            </li>
          </ul>
          <p>
            TOTAL : <b>{{ totalCosts + totalDonations }} €</b>
          </p>
        </section>

        <div class="buttons">
          <a class="button white_sky sm submit" @click="$store.commit('SET_DONATION_STATUS', false)">
            Annuler
          </a>
          <a class="button green sm submit" @click="saveInvoice()"> Don </a>
        </div>
      </form>
    </div>
  </ModalBlock>
</template>

<script>
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

      reason: null,
      name: '',
      startDate: '',
      duration: null,
      students: null,
      results: false,
      donations: [],
      iframe: false,
    }
  },
  computed: {
    donatorStatus() {
      return this.$store.state.donatorStatus
    },
    totalDonations() {
      return this.donations.reduce((acc, current) => acc + current, 0)
    },
    totalCosts() {
      return 0
    },
  },
  methods: {
    toggleDonation(amount) {
      if (this.donations.includes(amount)) {
        const index = this.donations.indexOf(amount)
        this.$delete(this.donations, index)
      } else {
        this.donations.push(amount)
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

  .input-container, .selector-container {
    margin: 8px 0 24px;
  }

  .checkbox span {
    color: #999999;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 20px;
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
