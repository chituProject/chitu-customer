<template>
  <form class="container page-padding" report-submit="true" @submit="submitForm">
    <div class="box">
      <h3 style="margin-bottom:28px;">申请入驻</h3>
      <div class="color-main fs-14">申请人信息</div>
      <div class="flex _input-warpper">
        <input type="text" class="input-text" placeholder="姓名*"
               v-model.trim="Reseller.username" maxlength="18"/>
      </div>
      <div class="flex _input-warpper">
        <input type="idcard" class="input-text" placeholder="身份证*"
               v-model.trim="Reseller.idcard" maxlength="18"/>
      </div>
      <offpay-phone :phone="phone" @input-code="code = $event" @input-phone="phone = $event">
      </offpay-phone>
    </div>

    <div class="box">
      <div class="color-main fs-14">店铺信息（需有实体店铺/公司才能开通）</div>
      <div class="flex _input-warpper">
        <input type="text" class="input-text" placeholder="店铺名称*"
               v-model.trim="Reseller.name" maxlength="50"/>
      </div>
      <div class="flex _input-warpper">
        <offpay-select class="input-text" :value="Reseller.store_type" :list="storeTypeList"
                       value-key="value" label-key="label" placeholder="店铺经营类型"
                       @change="setObject(Reseller, 'store_type', $event)"
        >
        </offpay-select>
      </div>

      <div class="fs-14" style="margin-left:12px;margin:7.5px 0;">店铺地址</div>
      <div class="flex _input-warpper">
        <picker mode="region" :value="regionList" @change="CityChange" class="input-text">
          <div class="flex" style="height:48px;padding-right:10px;">
            <p>{{ Reseller.area || '省 市 区' }}</p>
            <div class="arrow-right"></div>
          </div>
        </picker>
      </div>
      <div class="flex _input-warpper">
        <input type="text" class="input-text" placeholder="详细地址"
               v-model.trim="Reseller.address" maxlength="80"/>
        <button class="btn btn-main btn-normal _btn-right-s" @click="chooseLoc">选择地址</button>
      </div>
    </div>

    <offpay-picture class="box" v-model="logo" title="商标" :canvas_id="'watermark'"></offpay-picture>

    <div v-if="!isCreate" class="color-main fs-14">如需修改银行账户信息，请联系免单君客户支持！</div>
    <button :disabled="disable" form-type="submit" class="btn btn-main btn-full btn-radius-6">
      提交
    </button>
  </form>
</template>

<script>
import OffpaySelect from '@/components/apply/select';
import OffpayPhone from '@/components/apply/phone';
import OffpayPicture from '@/components/apply/picture';
import {
  isChinese,
  isIdcard,
  isPhone,
  // isUrl,
  isEmpty,
  isSmscode,
  trim_nulls as trimNulls,
} from '@/utils/index';
import { httpRequest, navigateTo, getQuery } from '@/utils/adapter';
import UUID from 'uuid-js';
import config from '@/utils/config.json';
import { storeTypeList } from '../sicpay/options';
import { geoMixin, formMixin, pictureMixin } from '../mixins';

const QQMapWX = require('../../../static/sdk/qqmap-wx-jssdk.min.js');

let qqmapsdk;

export default {
  components: {
    OffpaySelect,
    OffpayPhone,
    OffpayPicture,
  },
  mixins: [geoMixin, formMixin, pictureMixin],
  data() {
    return {
      Reseller: {},

      phone: '',
      code: '',
      regionList: [],
      // 商标图片
      logo: '',

      query: {},
      disable: false,
      storeTypeList,
    };
  },
  computed: {
    uuid() {
      return this.$store.state.uuid;
    },
    isCreateFailed() {
      return this.$store.state.isCreateFailed;
    },
    isCreate() {
      // 当首次进入此页面，或是之前创建失败时，都要用post接口
      return !this.Reseller.uuid || this.isCreateFailed;
    },
  },
  watch: {
    Reseller() {
      // shallow watch!
      this.syncReseller();
    },
  },
  mounted() {
    if (this.$store.state.reseller) {
      this.Reseller = this.$store.state.reseller;
    }
    this.syncReseller();
  },
  methods: {
    setObject(type, key, pic) {
      this.$set(type, key, pic);
    },
    CityChange(e) {
      console.log('选中的城市: ', e.mp.detail.value);
      this.regionList = e.mp.detail.value;
      this.Reseller.area = this.regionList.join(' ');
    },
    syncReseller() {
      const reseller = this.Reseller;
      if (!reseller.area) {
        reseller.area = '';
      }
      if (typeof reseller.area === 'string') {
        this.regionList = reseller.area.split(' ');
      } else if (Array.isArray(this.regionList)) {
        reseller.area = this.regionList.join(' ');
      }
      if (reseller.phone) {
        this.phone = reseller.phone;
      }
      this.logo = reseller.logo;
    },
    checkUserValid() {
      if (
        !isChinese(this.Reseller.username)
      || !isIdcard(this.Reseller.idcard)
      || !isPhone(this.phone)
      || !isSmscode(this.code)
      || !isEmpty('店铺名称', this.Reseller.name)
      || !isEmpty('区域', this.Reseller.area)
      || !isEmpty('地址', this.Reseller.address)
      ) {
        return false;
      }
      return true;
    },
    submitForm(e) {
      this.$store.dispatch('addFormId', e.target.formId);
      if (this.disable) {
        return;
      }
      this.disable = true;
      if (!this.checkUserValid()) {
        this.disable = false;
        return;
      }
      const uuid = this.Reseller.uuid || UUID.create(1).hex;
      const uploaded = this.uploadPics({ logo: this.logo }, uuid);
      qqmapsdk.geocoder({
        // 获取表单传入地址
        address: this.Reseller.address, // 地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
        success: (res) => { // 成功后的回调
          console.log(res);
          // eslint-disable-next-line
          var res = res.result;
          const latitude = res.location.lat;
          const longitude = res.location.lng;
          this.upload(latitude, longitude, uuid, uploaded);
        },
        fail: (err) => {
          console.error(err);
          this.upload(this.latitude, this.longitude, uuid, uploaded);
        },
      });
    },
    upload(latitude, longitude, uuid, pictures) {
      const params = {
        uuid,
        ...this.Reseller,
        phone: this.phone,
        code: this.code,
        // type的优先级： this.query.type > this.Reseller.type > 缺省值'ONLINE'
        type: this.query.type || this.Reseller.type || 'OFFLINE',
        latitude,
        longitude,
        ...pictures,
      };

      // update
      if (this.isCreate) {
        httpRequest({
          url: 'reseller/',
          method: 'POST',
          data: trimNulls(params),
          success: (res) => {
            this.disable = false;
            if (res.statusCode > 199 && res.statusCode < 300) {
              this.$store.commit('SET_RESELLER', res.data);
              navigateTo({ url: '/pages/apply/sicpay/main' });
              this.$store.commit('SET_CREATE_FAILED', false);
            } else {
              this.$store.commit('SET_CREATE_FAILED', true);
            }
          },
        });
      } else {
        httpRequest({
          url: `reseller/${this.Reseller.uuid}/`,
          method: 'PUT',
          data: trimNulls(params),
          success: (res) => {
            this.disable = false;
            if (res.statusCode > 199 && res.statusCode < 300) {
              navigateTo({ url: '/pages/hint/word/main?num=0' });
            }
          },
        });
      }
    },
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  onShow() {
    if (!qqmapsdk) {
      qqmapsdk = new QQMapWX({ key: config.mapKey });
    }
    const that = this;
    this.query = getQuery(this);
    wx.getSetting({
      success: (res) => {
        // 如果未授权，需要用户手动点击授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              that.getLoc();
            },
          });
        } else {
          that.getLoc();
        }
      },
    });
  },
};
</script>

<style scoped>
.input-text{
  font-size: 14px;
  padding-left:12px;
  width: calc(100vw - 24px);
  height: 44px;
  background-color: #fff;
  border: solid 1px #d8d8d8;
}
.input-textarea{
  font-size: 14px;
  padding: 12px;
  width: calc(100vw - 24px);
  height: 44px;
  background-color: #fff;
  border: solid 1px #d8d8d8;
  overflow-wrap: break-word;
}
._input-warpper{
  width: calc(100vw - 30px);
  margin: 15px 0;
}
._btn-right-s{
  max-width: 88px;
  padding: 0 6px;
  margin: 0 6px;
  border-radius:6px;
}
.radio-group {
  padding: 10px 0;
}
.radio {
  padding-right: 10px;
}
</style>
