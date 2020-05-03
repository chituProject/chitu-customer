<template>
  <container>
    <title-bar :title="'我的粉丝'" :pageStackAmount="pageStackAmount"></title-bar>
    <loading-animation :showAnimation="showAnimation"></loading-animation>
    <div class="container box">
      <div class="background"></div>
      <!-- <nav-bar-fixed :navs="tabs" :show="true" :justify="'center'" :activeIndex="activeIndex" @indexChange="navCallback"></nav-bar-fixed> -->
      <div class="weui-navbar">
        <div v-for="(item,index) in tabs" :key="index" :class="{'navbar-slider':activeIndex == index}" class="weui-navbar__item" @click="navCallback(index)">
          <div :id="index" :class="{'color-main':activeIndex == index}" class="fs-16 weui-navbar__title">{{item}}</div>
        </div>
      </div>
			<div class="item">
        <div class="flex-justify_start">
          <div class="flex-column-center width-item">
            <div class="fs-28 grey39-color">
              {{activatedFanNum + inactivatedFanNum}}
            </div>
            <span class="fs-14 grey99-color">粉丝总数</span>
          </div>
          <div class="flex-column-center width-item">
            <div class="fs-28 grey39-color">
              {{inactivatedFanNum}}
            </div>
            <div class="fs-14 grey99-color">未激活粉丝</div>
          </div>
          <div class="flex-column-center width-item">
            <div class="fs-28 grey39-color">
              {{activatedFanNum}}
            </div>
            <div class="fs-14 grey99-color">激活粉丝</div>
          </div>
        </div>
      </div>
<!--      <img :class="userinfo-avatar" src="/static/img/icons/calendar.png">-->
      <div class="full fans-list">
        <div v-for="(fan, i) in fans" :key="i">
          <div class="flex-justify_between fan-item">
            <div class="flex-justify_between">
              <img :src="fan.customer_user.wechat_avatar_url" class="userinfo-avatar">
              <div style="margin-left:10px;">
                <div class="fs-12 grey66-color">{{fan.customer_user.wechat_nickname}}</div>
                <div class="fs-12 grey66-color">{{fan.createdAt}}</div>
              </div>
            </div>
            <div v-if="fan.status === 'ACTIVATED'" class="fs-14 line-20 main-color flex">
              <i class="iconfont icon-main">&#xe6e0;</i>永久绑定
            </div>
            <div v-else-if="fan.status === 'INACTIVATED'" class="fs-14 grey66-color">
              未激活
            </div>
          </div>
        </div>
      </div>
    </div>
  </container>
</template>

<script>
import { httpRequest } from '@/utils/adapter';
import { formatTime } from '@/utils/index';
import navBarFixed from '@/components/navBarFixed';

export default {
  data() {
    return {
      showAnimation: true,
      fans: [],
      tabs: ['全部粉丝', '未激活粉丝', '激活粉丝'],
      tabParam: ['', 'INACTIVATED', 'ACTIVATED'],
      activeIndex: 0,
      activatedFanNum: 0,
      inactivatedFanNum: 0,
    };
  },
  components: {
    navBarFixed,
  },
  computed: {
  },
  methods: {
    fetchData() {
      httpRequest({
        method: 'GET',
        url: 'reseller_fans/count/',
        success: (res) => {
          this.activatedFanNum = res.data.ACTIVATED;
          this.inactivatedFanNum = res.data.INACTIVATED;
          this.getList(this.activeIndex);
        },
      });
    },
    navCallback(e) {
      this.fans = [];
      this.activeIndex = e;
      this.getList(e);
    },
    getList(index) {
      const data = {
        status: this.tabParam[index],
      };
      httpRequest({
        url: 'reseller_fans/',
        method: 'GET',
        data,
        success: (res) => {
          if (res.statusCode > 199 && res.statusCode < 300) {
            for (let i = 0; i < res.data.length; i += 1) {
              res.data[i].createdAt = formatTime(res.data[i].created_at);
            }
            this.fans = res.data;
          }
        },
      });
    },
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  onShow() {
    this.fetchData();
  },
};
</script>

<style scoped>
  .width-item{
    width: 33vw;
  }

  .item {
    padding: 30px 18px 30px 12px;
    margin: 56px 15px 0;
    background-color: white;
    flex: 1;
    align-items: center;
    border-radius: 6px;
  }

  .flex-column-center {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .userinfo-avatar {
    overflow:hidden;
    width: 39px;
    height: 39px;
    border-radius: 20px;
  }
  .icon-main{
    color: #f56250;
    font-size: 19px;
    -webkit-text-stroke-width:0;
    margin-right: 5px;
  }

  .fans-list{
    overflow: scroll;
    /* height: calc(70vh - 150px); */
    /* margin-top: 11px; */
  }

  .fan-item{
    background-color: #fff;
    padding: 20px 14px;
    margin-top: 11px;
  }
	.weui-navbar{
		position:fixed;
	}
	.navbar-slider {
		border-bottom: #f56250 6rpx solid;
	}
</style>
