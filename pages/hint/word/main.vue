<template>
  <div class="container _100vh" @click="toNextPage(text_num)">
    <p class="fs-16 welcome-text">{{welcome_text[text_num]}}</p>
    <div v-if="text_num===1" style="width:100%;">
      <div class="fs-14 color-main" style="margin-left:40px;margin-bottom:32px;">原因：{{Reseller.audit_reason}}</div>
      <div class="flex">
        <button class="btn btn-main-reverse btn-small btn-radius-6" @click.stop="navEdit">修改资料</button>
      </div>
    </div>
    <img style="width:110px;height:48px;position:absolute;margin:auto;bottom:20px;" src="/static/img/logo.png"/>
  </div>
</template>

<script>
import { getQuery, reLaunch, redirectTo } from '@/utils/adapter';

export default {
  data() {
    return {
      text_num: 0,
      welcome_text: [
        // 提示语在此增加
        '感谢您对免单君的信任，资料审核通过后。我们将第一时间通知您。',
        '很抱歉，您提交的申请审核不通过，请参考下面原因修改资料后重新提交审核.',
      ],
    };
  },
  computed: {
    Reseller() {
      return this.$store.state.reseller;
    },
  },
  methods: {
    toNextPage() {
      reLaunch({ url: '/pages/welcome/main' });
    },
    navEdit() {
      redirectTo({ url: '/pages/apply/offpay/main' });
    },
  },
  onShow() {
    const query = getQuery(this);
    this.text_num = parseInt(query.num, 10);
    console.log('welcome ', query.num);
  },
};
</script>

<style scoped>
.welcome-text{
  margin:0px 40px 20px 40px;
}
._100vh{
  height:100vh;
  justify-content:center;
}
</style>
