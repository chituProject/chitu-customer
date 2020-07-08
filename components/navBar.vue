<template>
  <div class="navBar">
    <div class="center flex">
      <div
        v-for="(item, index) in navs"
        :key="index"
        :class="activeIndex === index ? 'active' : 'inActive'"
        class="navbar__item"
        @click="navClick(index)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeIndex: {
      type: Number,
      default: 0
    },
    navs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    navClick(i) {
      this.$emit("indexChanged", i);
    }
  }
};
</script>

<style scoped lang="scss">
.navBar {
  z-index: 500;
  width: 100%;
  height: 88px; // nav-height
  box-sizing: border-box;
  background-color: #fff;

  .center {
    /* flex-flow: row wrap; */
    .active {
      color: #a5323a;
      border-bottom: #a5323a 2px solid;
    }
    .inActive {
      color: #999;
      border-bottom: white 2px solid;
    }
    .navbar__item {
      width: 50vw;
      padding: 14px 0;
      text-align: center;
      margin: 16px 0;
      font-size: 30upx;
    }
  }
  .right {
    min-width: 44px;
  }
}
</style>
