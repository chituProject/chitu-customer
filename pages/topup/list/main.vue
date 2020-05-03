<template>
  <div class="container">
    <div class="background"></div>
    <div class="weui-tab">
      <div class="weui-navbar">
        <div v-for="(item,index) in tabs" :key="index" :class="{'navbar-slider':activeIndex == index}" class="weui-navbar__item" @click="tabClick(index)">
          <div :id="index" :class="{'color-main':activeIndex == index}" class="fs-16 weui-navbar__title">{{item}}</div>
        </div>
      </div>
      <div v-for="(n, tabIndex) in 3" :key="tabIndex" :hidden="activeIndex != tabIndex">
        <div class="weui-tab__panel">
          <div v-for="(item,i) in list" :key="i" class="item" style="margin-top:12px;" @click="navDetail(item.id)">
            <div class="fs-14 grey39-color">{{statusName[item.status]}}</div>
            <div style="text-align:center;">
              <div class="fs-13 grey66-color">提现金额</div>
              <div class="fs-25 grey39-color"><span class="fs-16">￥</span>{{item.amountStr}}</div>
            </div>
            <!-- <div class="flex-justify_start _table-adjust">
              <div class="fs-14 grey99-color">提现类型</div>
              <div class="fs-14 grey39-color _text-adjust">{{topupName[item.type]}}</div>
            </div> -->
            <div class="flex-justify_start _table-adjust">
              <div class="fs-14 grey99-color">提现银行</div>
              <div class="fs-14 grey39-color _text-adjust">{{item.bank}}({{item.card_tail}})</div>
            </div>
            <div class="flex-justify_start _table-adjust">
              <div class="fs-14 grey99-color">发起时间</div>
              <div class="fs-14 grey39-color _text-adjust">{{ item.createdAt }}</div>
            </div>
            <div class="flex-justify_start _table-adjust">
              <div class="fs-14 grey99-color">提现单号</div>
              <div class="fs-14 grey39-color _text-adjust">{{item.id}}</div>
            </div>
            <hr style="margin:0">
            <div class="flex" style="margin-top:10px">
              <p>查看详情</p>
              <div class="arrow-right"></div>
            </div>
          </div>
        </div>
        <div v-if="is_end[n]" style="text-align:center;" :class="{'empty':list.length===0, 'notempty':list.length>0}">
          <p class="explain">没有更多了</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpRequest, navigateTo } from '@/utils/adapter';
import { formatPrice, formatTime } from '@/utils/index';
import Constants from '../../../static/data/constants.json';

export default {
  data() {
    return {
      list: [],
      tabs: ['全部', '已发起', '已到账'],
      tabParams: ['', 'DEALING', 'TRANSFERRED'],
      statusName: Constants.statusName,
      topupName: Constants.topupName,
      activeIndex: 0,
      page_num: 1,
      page_size: 3,
      is_end: [false, false, false],
    };
  },
  computed: {
    nowd() {
      return new Date();
    },
    y() {
      return this.nowd.getFullYear();
    },
    m() {
      return this.nowd.getMonth() + 1;
    },
    mStr() {
      if (this.m < 10) {
        return `0${this.m}`;
      }
      return this.m;
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
    getList(index) {
      httpRequest({
        url: 'withdrawal/',
        method: 'GET',
        data: {
          page_num: this.page_num,
          page_size: this.page_size,
          status: this.tabParams[index],
        },
        success: (res) => {
          if (res.statusCode > 199 && res.statusCode < 300) {
            if (!res.data.next) {
              this.is_end[this.activeIndex] = true;
            }
            if (res.data.results.length > 0) {
              for (let i = 0; i < res.data.results.length; i += 1) {
                if (Object.prototype.hasOwnProperty.call(res.data.results, i)) {
                  res.data.results[i].amountStr = formatPrice(res.data.results[i].amount);
                  res.data.results[i].createdAt = formatTime(res.data.results[i].created_at);
                }
              }
              this.list = this.list.concat(res.data.results);
            }
          }
        },
      });
    },
    navDetail(id) {
      console.log(id);
      navigateTo({ url: `/pages/topup/detail/main?id=${id}` });
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
    this.getList(this.activeIndex);
  },
};
</script>

<style scoped>
.weui-navbar{
  position:fixed;
}
.navbar-slider {
  border-bottom: #f56250 6rpx solid;
}
.weui-tab__content {
  background-color: #ffffff;
}
._adjust{
  padding: 35rpx 24rpx;
}
._table-adjust{
  margin:20rpx 0;
}
._text-adjust{
  margin-left:48rpx;
}
.empty{
  margin-top:50vh;
}
.notempty{
  margin-top:24rpx;
}
</style>
