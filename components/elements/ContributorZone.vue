<template>
  <div
    class="contributor-zone"
    @mouseenter="active = true"
    @mouseleave="active = false"
  >
    <AvatarElement
      class="icon-preview"
      :email="user.email"
      :path="user.avatar_path"
      :size="24"
      :name="user.name"
    />
    <h4 class="name-preview">{{ user.name || user.username }}</h4>
    <transition name="popup">
      <div v-show="active" class="popup">
        <div class="popup-head">
          <AvatarElement
            :email="user.email"
            :path="user.avatar_path"
            :size="96"
            :name="user.name"
          />
          <div class="head-content">
            <h4 class="username">{{ user.username }}</h4>
            <h5 class="name">{{ user.name }}</h5>
          </div>
        </div>
        <div class="popup-content">
          <div v-if="user.description" class="info">
            <span>Description</span>
            <p>{{ user.description }}</p>
          </div>
          <div class="info">
            <span>Adresse email</span>
            <p>
              <a :href="`mailto:${user.email}`" target="blank">{{
                user.email
              }}</a>
            </p>
          </div>
          <a
            v-if="user.website"
            class="button md green"
            :href="formatLink(user.website)"
            target="blank"
            >Site web</a
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      active: false,
    }
  },
  methods: {
    formatLink(link) {
      if (!link) return null
      return link.startsWith('http') ? link : `https://${link}`
    },
  },
}
</script>

<style lang="scss">
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter,
.popup-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.contributor-zone {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  background-color: #f8f7f7;
  border-radius: 6px;
  margin-bottom: 24px;
  text-decoration: none;

  .icon-preview {
    border-radius: 12px;
  }

  .name-preview {
    color: #4f4f4f;
    font-size: 14px;
    font-weight: 600;
    margin-left: 8px;
  }

  &::before {
    position: absolute;
    content: '';
    top: 100%;
    left: 0;
    width: 100%;
    height: 8px;
  }

  .popup {
    position: absolute;
    z-index: 10000;
    top: calc(100% + 8px);
    right: 0;
    display: flex;
    overflow: hidden;
    width: 300px;
    flex-direction: column;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
    border-radius: 19px;

    .popup-head {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #bbe242;

      img {
        width: 96px;
        height: 96px;
        border: 3px solid #ffffff;
        border-radius: 48px;
      }

      .head-content {
        display: flex;
        flex-direction: column;
        margin-left: 16px;

        .username {
          color: #ffffff;
          font-size: 24px;
          font-weight: 600;
          font-style: normal;
          margin-bottom: 8px;
        }

        .name {
          color: #4e4e4e;
          font-size: 18px;
        }
      }
    }

    .popup-content {
      display: flex;
      padding: 16px 24px 24px;
      flex-direction: column;
      background-color: #ffffff;

      .info {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;

        span {
          color: #ababab;
          font-size: 10px;
          margin-bottom: 8px;
        }

        p {
          color: #717171;
          font-size: 14px;
          margin-bottom: 0;

          a {
            color: $green;
          }
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
