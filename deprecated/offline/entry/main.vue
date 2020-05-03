<template>
  <div class="container page-padding">
    <offpay-calendar v-model="date" @change="changeDate"></offpay-calendar>
    <div class="background"></div>

    <div class="full-vw" style="z-index: 1;">
      <div class="item">
        <div class="fs-19">已入账收益（元）</div>
        <div class="fs-25">{{ amount | formatPrice }}</div>
      </div>
    </div>
    <div class="box card" style="z-index: 1;" v-for="(item, index) in list" :key="index">
      <div class="fs-12 number grey99-color">{{ item.id }}</div>
      <div>
        <span class="fs-14 grey99-color">{{ item.updatedAt }}</span>
        <span class="fs-16 right color-main">¥<span class="fs-19">{{ item.order_amount | formatPrice }}</span></span>
      </div>
    </div>
  </div>
</template>

<script>
import { httpRequest } from '@/utils/adapter';
import { formatTime } from '@/utils/index';
import OffpayCalendar from '@/components/calendar';

export default {
  data() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return {
      amount: 0,
      list: [],
      date: `${year}-${month}-${day}`,
    };
  },
  components: {
    OffpayCalendar,
  },
  computed: {
    Reseller() {
      return this.$store.state.reseller;
    },
  },
  watch: {
    Reseller(val) {
      if (val && val.uuid) {
        this.getList();
      }
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
          }
        },
      });
    },
    getList() {
      const trim = word => (word || '').replace(/^0+/, '');
      const [year = '', month = '', day = ''] = this.date.split('-').map(trim);

      httpRequest({
        url: 'reseller_flow/',
        data: {
          uuid: this.Reseller.uuid.split('-').join(''),
          year,
          month,
          day,
          recorded: 'RECORDED',
        },
        success: (res) => {
          if (res.statusCode > 199 && res.statusCode < 300) {
            this.list = res.data.order || [];
            for (let i = 0; i < this.list.length; i += 1) {
              this.list[i].updatedAt = formatTime(this.list[i].updated_at);
            }
            this.amount = res.data.order_item_amount || 0;
          }
        },
      });
    },
    changeDate() {
      this.$nextTick(() => { this.getList(); });
    },
  },
  onShow() {
    this.getReseller();
    this.getList();
  },
};
</script>

<style scoped>
  .card{
    margin-top:12px;
    background-color: #fff;
    border-radius: 6px;
    padding:15px;
  }

  .number{
    margin-bottom:5px;
  }

  .flex-column-center {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .item{
    margin: 0 12px;
    padding-top: 25px;
    padding-bottom: 25px;
    border-radius: 6px;
  }
  .right{
    float: right;
  }

</style>
