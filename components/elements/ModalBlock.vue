<template>
  <div
    v-if="showIt"
    class="modal_overlay"
    :class="{ open: status, close: !status, isMobile: $device.isMobile }"
    @click="closeModal"
  >
    <div
      v-body-scroll-lock="status"
      class="modal-container"
      @mousedown="disableOutClose()"
      @mouseup="disableOutClose()"
      @click="disableOutClose()"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalBlock',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      status: false,
      showIt: false,
      shouldClose: null,
    }
  },
  watch: {
    open(value) {
      this.status = value
      if (value) {
        this.showIt = true
      } else {
        setTimeout(() => {
          this.showIt = false
        }, 300)
      }
    },
  },
  mounted() {
    this.status = this.open
    this.showIt = this.open
  },
  methods: {
    disableOutClose() {
      this.shouldClose = false
    },
    closeModal() {
      if (this.shouldClose === null) {
        this.shouldClose = true
      }

      if (this.shouldClose) {
        this.status = false
        this.$emit('close')
      }

      this.shouldClose = null
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
  @media screen and (max-width: 480px) {
    top: 64px;
  }

  .modal {
    width: 100%;
    opacity: 0;
    max-height: 100%;
  }

  &.open {
    animation: backin 0.4s ease-in-out;
    opacity: 1;

    .modal {
      animation: popup 0.4s ease-in-out;
      opacity: 1;
    }
  }

  &.close {
    animation: backout 0.4s ease-in-out;

    &.modal {
      animation: popout 0.4s ease-in-out;
    }
  }

  &.isMobile .modal {
    overflow-y: auto;
  }
}

.isDashboard + div .modal_overlay {
  top: 3rem;
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
