<template>
  <div class="container">
    <div class="background"></div>
    <div class="weui-tab">
      <div class="weui-navbar">
        <div v-for="(item,index) in tabs" :key="index" :class="{'navbar-slider':activeIndex == index}" class="weui-navbar__item" @click="tabClick(index)">
          <div :id="index" :class="{'color-main':activeIndex == index}" class="weui-navbar__title">{{item}}</div>
        </div>
      </div>
      <div class="weui-tab__panel">
        <div class="flex margin-box">
          <picker class="fs-16" mode="date" fields="month" start="2015-01" value="selectedMonth" @change="changeMonth">
            {{y}}年{{m}}月 
            <img class="icon-15" src="/static/img/icons/calendar.png">
          </picker>
          <div class="fs-14 grey66-color"><span v-if="sumOffpay>=0">收入</span><span v-else-if="sumOffpay<0">支出</span>{{sumOffpay>=0?sumOffpay:-sumOffpay}}元</div>
        </div>
        <div v-for="(n, tabIndex) in 3" :key="tabIndex" class="weui-tab__content" :hidden="activeIndex != tabIndex">
          <div v-for="(item,i) in list" :key="i">
            <div class="flex margin-box">
              <div>
                <p class="normal">{{item.order}}</p>
                <p class="_adjust">{{m}}月{{item.d}}日 {{item.time}}</p>
              </div>
              <div v-show="item.type==='NORMAL'">
                <p class="price" :class="{'unDrawable':item.status==='UNWITHDRAWABLE'}">
                  +{{item.amountStr}}
                </p>
                <span v-if="item.status==='UNWITHDRAWABLE'" class="color-main fs-13 unDrawable">不可提现</span>
                <span v-else class="color-main fs-13">可提现</span>
              </div>

              <div v-show="item.type==='DEDUCTED'">
                <p style="color:#3d94f1;font-size: 19px;line-height: 24.5px;">
                  0.00<span class="fs-11">(+{{item.originAmountStr}})</span>
                </p>
                <span style="color:#3d94f1;font-size: 14px;">诚意金抵扣</span>
              </div>

              <div v-show="item.type==='REFUND'">
                <p style="color:#fcc04e;font-size: 19px;line-height: 24.5px;">
                  0.00<span class="fs-11">(+{{item.amountStr}})</span>
                </p>
                <span style="color:#fcc04e;font-size: 14px;">用户退货</span>
              </div>
            </div>
            <hr>
          </div>
        </div>
      </div>
      <div v-if="is_end" style="text-align:center;" :class="{'empty':list.length===0}">
        <p class="explain">没有更多了</p>
      </div>
    </div>
  </div>
</template>

<script>
import { httpRequest } from '@/utils/adapter';
import { formatPrice } from '@/utils/index';

export default {
  data() {
    return {
      y: '2018',
      m: '09',
      list: [],
      tabs: ['全部', '可提现', '不可提现'],
      tabParams: ['', 'WITHDRAWABLE', 'UNWITHDRAWABLE'],
      activeIndex: 0,
      page_num: 1,
      page_size: 6,
      is_end: [false, false, false],
    };
  },
  components: {
  },
  computed: {
    nowd() {
      return new Date();
    },
    sumOffpay() {
      let sum = 0;
      for (let index = 0; index < this.list.length; index += 1) {
        if (Object.prototype.hasOwnProperty.call(this.list, index)) {
          sum += parseFloat(this.list[index].amount, 10);
        }
      }
      return (sum / 100).toFixed(2);
    },
    systemInfo() {
      return this.$store.state.systemInfo;
    },
  },
  methods: {
    tabClick(i) {
      this.list = [];
      this.activeIndex = i;
      this.page_num = 1;
      this.is_end[i] = false;
      this.getList(i);
    },
    changeMonth(e) {
      this.list = [];
      const str = e.target.value;
      const splitDate = str.split('-');
      [this.y, this.m] = splitDate;
      this.getList(this.activeIndex);
    },
    getList(index) {
      httpRequest({
        url: 'rebate_flow/',
        method: 'GET',
        data: {
          created_at__year: this.y,
          created_at__month: this.m,
          status: this.tabParams[index],
          page_num: this.page_num,
          page_size: this.page_size,
        },
        success: (res) => {
          if (res.statusCode > 199 && res.statusCode < 300) {
            if (!res.data.next) {
              this.is_end[this.activeIndex] = true;
            }
            for (let i = 0; i < res.data.results.length; i += 1) {
              if (Object.prototype.hasOwnProperty.call(res.data.results, i)) {
                res.data.results[i].amountStr = formatPrice(res.data.results[i].amount);
                res.data.results[i].originAmountStr =
                 formatPrice(res.data.results[i].origin_amount);
                const a = res.data.results[i].created_at.split('-');
                const Str1 = a[2];
                [res.data.results[i].y, res.data.results[i].m] = a;
                res.data.results[i].d = Str1.substr(0, 2);
                res.data.results[i].time = Str1.substr(3, 5);
              }
            }
            this.list = this.list.concat(res.data.results);
          }
        },
      });
    },
  },
  onReachBottom() {
    console.log('reached bottom');
    if (!this.is_end[this.activeIndex]) {
      this.page_num += 1;
      this.getList(this.activeIndex);
    }
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.y = this.nowd.getFullYear();
    if (this.nowd.getMonth() < 9) {
      this.m = '0'.concat((this.nowd.getMonth() + 1));
    } else {
      this.m = this.nowd.getMonth() + 1;
    }
    const wh = this.systemInfo.windowHeight;
    const pageSize = (wh - 100) / (0.135 * wh);
    console.log('pageSize', pageSize);
    this.page_size = Math.ceil(pageSize);
    this.getList(this.activeIndex);
  },
};
</script>

<style scoped>
  ._adjust{
    margin-top:8px;
  }
  .weui-navbar{
    position:fixed;
  }

  .navbar-slider {
    border-bottom: #f56250 3px solid;
  }

  .weui-tab__content {
    background-color: #ffffff;
  }
  ._adjust{
    padding: 0px;
  }
  .margin-box {
    padding: 17.5px 12px;
  }
  .unDrawable{
    color: #999;
  }
  .empty{
    margin-top:50vh;
  }
</style>