<template>
  <div class="full wrapper" :class="{'on-show-animation': startAnimate}" v-show="show">
    <div v-if="expand">
      <div class="up-arrow-wrapper flex-justify_between" @click.stop="toggleExpand">
        <p>全部分类</p>
        <i class="iconfont icon-15 grey99-color" style="margin-top:8px;">&#xe61a;</i>
      </div>
      <div class="weui-navbar flex-justify_start wrap-line">
        <div v-for="(item,index) in navs" :key="index" :class="{'navbar-slider':activeIndex === index, 'slider-bottom':activeIndex !== index}" class="navbar__item" @click.stop="navClick(index)">
          <div :id="index" :class="{'main-color':activeIndex == index}" class="title">{{item.title ? item.title : item}}</div>
        </div>
      </div>
    </div>
    <div v-else class="flex-justify_between">
      <div class="weui-navbar scroll-line" :class="{'flex-justify_start': justify === 'start', 'flex-justify_center': justify === 'center' }" :style="{'width': (navs.length < 8 ? 100 : 90 ) + '%'}">
        <div v-for="(item,index) in navs" :key="index" :class="{'navbar-slider':activeIndex === index, 'slider-bottom':activeIndex !== index}" class="navbar__item" @click.stop="navClick(index)">
          <div :id="index" :class="{'main-color':activeIndex == index}" class="title">{{item.title ? item.title : item}}</div>
        </div>
      </div>
      <div class="down-arrow-wrapper flex-justify_center" v-if="navs.length > 7" @click.stop="toggleExpand">
        <i class="iconfont icon-15 grey99-color" style="margin-top:-8px;">&#xe612;</i>
      </div>
    </div>
  </div>
</template>

<script>
  import { vibrateShort } from '@/utils/adapter';

  export default {
    data() {
      return {
        expand: false,
        startAnimate: false,
      };
    },
    props: {
      activeIndex: {
        default: 0,
      },
      navs: {
        default: [],
      },
      show: {
        default: false,
      },
      justify: {
        default: 'start',
      },
    },
    computed: {
      systemInfo() {
        return this.$store.state.systemInfo;
      },
    },
    watch: {
      show(val, oldVal) {
        if ((!oldVal) && val) {
          this.showAnimation();
        }
      },
    },
    methods: {
      navClick(i) {
        vibrateShort();
        this.activeIndex = i;
        this.$emit('indexChange', i);
      },
      toggleExpand() {
        vibrateShort();
        this.expand = !this.expand;
      },
      showAnimation() {
        this.startAnimate = true;
        const that = this;
        setTimeout(() => {
          that.startAnimate = false;
        }, 200);
      },
    },
  };
</script>

<style scoped>
  .wrapper{
    position: fixed;
    z-index: 99;
		margin-left: -50%;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }
  .wrap-line{
    position: relative;
    flex-flow: row wrap;
  }
  .scroll-line{
    position: relative;
    overflow-x: scroll;
  }
  .up-arrow-wrapper{
    padding: 0 24rpx;
    z-index: 99;
    background-color: #fff;
    height: 60rpx;
  }
  .down-arrow-wrapper{
    background-color: #fff;
    height: 116rpx;
    width: 10%;
  }
  .navbar__item{
    flex-shrink: 0;
    margin: 16rpx 8vw;
    /*margin: 8px 42.5px;*/
  }
  .navbar-slider {
    border-bottom: #f56250 4rpx solid;
  }
  .slider-bottom {
    border-bottom: white 4rpx solid;
  }
  .title{
    font-size: 26rpx;
    line-height: 80rpx;
  }
  .fix-height {
    height: 60rpx;
  }
  @keyframes animation {
    0% { top: -100rpx; }
    50% { top: -20rpx; }
    100% { top: -2rpx; }
  }
  .on-show-animation {
    animation: animation 0.2s normal linear;
  }
</style>
