<template>
  <client-only placeholder="Loading...">
    <vuetable
      :apiMode="false"
      :data="data"
      :fields="fields"
      :sortOrder="sortOrder"
      :css="table"
      @vuetable:row-clicked="$emit('selectRow', $event)"
    >
    </vuetable>
  </client-only>
</template>

<script>
import Vuetable from 'vuetable-2'

export default {
  name: 'Table',
  components: {
    Vuetable,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sortOrder: [
        {
          field: 'updated_at',
          direction: 'desc',
        },
      ],
      table: {
        ascendingIcon: 'expand_less',
        descendingIcon: 'expand_more',
        sortableIcon: 'unfold_more',
        handleIcon: 'unfold_more',
        renderIcon(icon, options) {
          return `<i class="material-icons">${icon[1]}</span>`
        },
      },
    }
  },
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
.vuetable {
  display: table;
  table-layout: fixed;
  width: 100%;
  thead {
    border-bottom: 1px solid #8b8b8b;
    margin: 0 -24px;
    th {
      text-align: left;
      padding: 16px 0;
      font-weight: 600;
      font-size: 15px;
      transition: 0.3s color ease-in-out;
      user-select: none;
      position: relative;
      i {
        font-size: 18px;
        margin: -1px 0 0 5px;
        position: absolute;
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
        cursor: pointer;
        text-align: left;
        font-size: 15px;
        padding: 12px 0;
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
