<template>
  <div
    v-if="showIt"
    class="modal_overlay"
    :class="{ open: status, close: !status }"
    @click.self="$emit('close')"
  >
    <div class="modal" :class="[status ? 'open' : 'close', classes]">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      status: false,
      showIt: false,
    }
  },
  watch: {
    async open(value) {
      if (value) {
        this.showIt = true
        await this.$nextTick()
        this.status = value
      } else {
        this.status = false
        setTimeout(() => {
          this.showIt = false
        }, 400)
      }
    },
  },
}
</script>

<style lang="scss">
.modal_overlay {
  position: fixed;
  z-index: 1002;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  @media screen and (max-width: 400px) {
    top: 80px;
  }
  &.open {
    animation: backin 0.4s ease-in-out;
    opacity: 1;
  }
  &.close {
    animation: backout 0.4s ease-in-out;
  }
  .modal {
    display: flex;
    opacity: 0;
    flex-direction: column;
    @media screen and (max-width: 720px) {
      margin-top: 80px;
    }
    &.open {
      animation: popup 0.4s ease-in-out;
      opacity: 1;
    }
    &.close {
      animation: popout 0.4s ease-in-out;
    }
  }
}
@keyframes popup {
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }
  90% {
    transform: translateY(0);
  }
  100% {
    opacity: 1;
  }
}
@keyframes popout {
  0% {
    opacity: 1;
  }
  10% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100px);
    opacity: 0;
  }
}
@keyframes backin {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes backout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
