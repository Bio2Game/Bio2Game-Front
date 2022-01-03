<template>
  <section class="playground animator-playground">
    <div v-if="!game.status" class="block waiting-animator">
      <div class="head">
        <h5>Partie</h5>
      </div>
      <div class="content">
        <PartyWaitingState />
      </div>
    </div>
    <div v-else class="stats-animator-zone">
      <Tabs v-model="views" :value="views">
        <Tab id="global" name="Vue général" :hidden="game.status === 3">
          <PartyQuestionState :interactive="false" />
        </Tab>
        <Tab id="stats" name="Statistiques">
          <PartyStaticticsState :name="game.name" />
        </Tab>
        <Tab id="responses" name="Réponses" :hidden="game.status !== 1">
          <PartyQuestionState
            v-if="game.status === 1"
            :interactive="false"
            :force-answer="true"
          />
        </Tab>
      </Tabs>
      <Tabs v-if="views === 'stats'" v-model="question" :value="question">
        <Tab
          v-for="(item, index) in room_responses"
          :id="item.id.toString()"
          :key="index"
          :name="`Question ${index + 1}`"
        >
          <vuetable
            :fields="usersAnswersFields"
            :data="item.answers"
            :default-sort-by="{ field: 'time', direction: 'asc' }"
          >
            <template slot="response" slot-scope="props">
              <div class="response-slot">
                <div
                  :class="['color-stats', colors[props.rowData.responseNb]]"
                ></div>
                <span>{{ props.rowData.response }}</span>
              </div>
            </template>
          </vuetable>
        </Tab>
      </Tabs>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import vuetable from 'vuetable-2'

export default {
  name: 'AnimatorPlayground',
  components: {
    vuetable,
  },
  data() {
    return {
      views: null,
      question: null,
      colors: ['right', 'wrong', 'wrong', 'realy_wrong'],
      usersAnswersFields: [
        {
          name: 'username',
          title: 'Pseudo',
          sortField: 'username',
        },
        {
          name: 'response',
          title: 'Réponse',
          sortField: 'response',
        },
        {
          name: 'time',
          title: 'Temps',
          sortField: 'time',
          formatter: (time) =>
            `${time.toFixed(1)} ${time.toFixed(0) !== 1 ? 'secs' : 'sec'}`,
        },
      ],
    }
  },
  computed: {
    ...mapState('parties', ['game', 'room_responses']),
  },
}
</script>

<style lang="scss">
.animator-playground {
  display: flex;
  flex-direction: column;

  .waiting-animator {
    flex: 1;
  }

  .tabs {
    width: 100%;
  }

  .response-slot {
    display: flex;
    align-items: center;
    height: 100%;

    .color-stats {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      margin-right: 4px;

      &.right {
        background-color: $green;
      }

      &.wrong {
        background-color: #ff1d1d;
      }

      &.realy_wrong {
        background-color: #e01515;
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
