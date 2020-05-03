<template>
  <div class="container page-padding">
    <div class="background"></div>
    <topup :amount="Reseller.withdrawable_earnest" :idx="0"></topup>
    <topup :amount="Reseller.withdrawable_offpay" :idx="1"></topup>
    <topup :amount="Reseller.withdrawable_rebate" :idx="2"></topup>
    <topup :amount="Reseller.unwithdrawable_amount" :idx="3" :disabled="true"></topup>
  </div>
</template>

<script>
import { httpRequest } from '@/utils/adapter';
import topup from '@/components/topup';

export default {
  data() {
    return {
    };
  },
  components: {
    topup,
  },
  computed: {
    Reseller() {
      console.log(this.$store.state.reseller);
      return this.$store.state.reseller;
    },
  },
  methods: {
    getReseller() {
      httpRequest({
        url: 'reseller/',
        method: 'GET',
        success: (res) => {
          if (res.statusCode > 199 && res.statusCode < 300) {
            this.$store.commit('SET_RESELLER', res.data[0]);
            console.log(res.data[0]);
          }
        },
      });
    },
  },
  onShow() {
    this.getReseller();
  },
};
</script>

<style scoped>
</style>
