<template>
  <div class="container _vh100 page-padding" style="justify-content: center;">
    <img style="width:75px;height:75px;margin-bottom:6vh;" src="/static/img/icons/loading.gif"/>
    <div class="color-main fs-15">加载中</div>
  </div>
</template>

<script>
import { reLaunch } from '@/utils/adapter';

export default {
  data() {
    return {
      time: 0,
    };
  },
  computed: {
  },
  methods: {
  },
  onShow() {
    this.time = 0;
    this.timer = setInterval(() => {
      this.time += 50;
      if (this.time > 3000) {
        clearInterval(this.timer);
        this.timer = null;
        reLaunch({ url: '/pages/welcome/main' });
      }
    }, 50);
  },
  onHide() {
    this.time = 0;
    clearInterval(this.timer);
    this.timer = null;
  },
  onUnload() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style scoped>
._vh100{
  height:100vh;
}
</style>
