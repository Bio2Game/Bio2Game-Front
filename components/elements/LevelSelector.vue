<template>
  <div class="levels">
    <div class="level_switch">
      <div
        v-for="(level, index) of levels"
        :key="index"
        class="level"
        :class="{ active: value.includes(index) }"
        @click="levelSelect(index)"
      >
        <img :src="level.icon" :alt="level.name" />
        <span class="label">{{ level.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LevelSelector',
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      levels: [
        {
          name: 'Non validé',
          icon: require('@/assets/images/levels/level1.png'),
        },
        {
          name: 'Niveau primaire',
          icon: require('@/assets/images/levels/level2.png'),
        },
        {
          name: 'Niveau secondaire',
          icon: require('@/assets/images/levels/level3.png'),
        },
        {
          name: 'Niveau universitaire',
          icon: require('@/assets/images/levels/level4.png'),
        },
        {
          name: 'Niveau expert',
          icon: require('@/assets/images/levels/level5.png'),
        },
      ],
    }
  },
  methods: {
    levelSelect(level) {
      if (this.value.includes(level)) {
        if (this.value.length === 5) {
          return this.$emit('input', [level])
        }
        return this.$emit(
          'input',
          this.value.filter((_, i) => i !== this.value.indexOf(level)),
        )
      } else {
        return this.$emit('input', [...this.value, level])
      }
    },
  },
}
</script>

<style lang="scss">
.levels {
  display: flex;
  justify-content: center;
  max-width: 800px;
  width: 100%;
  padding: 32px;

  .level_switch {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 80%;
    height: 64px;
    padding: 0 16px;

    &::after {
      position: absolute;
      z-index: 1;
      top: 20px;
      right: -8px;
      height: 24px;
      content: '';
      background-color: $green;
      left: -8px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    }

    .level {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
      cursor: pointer;
      border-radius: 32px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      transition: 0.1s border ease;

      img {
        user-select: none;
      }

      &.active {
        border: 4px solid #797979;
      }

      .label {
        position: absolute;
        z-index: 1;
        top: 80%;
        padding: 4px 8px;
        color: rgb(59, 59, 59);
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        visibility: hidden;
        background-color: #ffffff;
        border-radius: 16px;
        opacity: 0;
        transition: opacity 0.6s, top 0.3s;
        box-shadow: 0 1px 3px hsla(0, 0%, 19%, 0.5);
        white-space: nowrap;
      }

      &:hover .label,
      .label:hover {
        visibility: visible;
        opacity: 0.8;
        top: 110%;
      }
    }
  }
}
</style>
