<template>
  <form class="container page-padding" report-submit="true" @submit="submitForm">
    <!-- 基本信息 -->
    <div class="box page-padding">
      <div class="color-main fs-14">入驻类型</div>
      <offpay-radio :value="Reseller.sicpay_type" :list="sicpayTypeList"
                    value-key="value" label-key="label"
                    @change="setObject(Reseller, 'sicpay_type', $event)">
      </offpay-radio>
      <div class="color-main fs-14">提现方式</div>
      <offpay-radio :value="Reseller.payment_type" :list="paymentTypeList"
                    value-key="value" label-key="label"
                    @change="setObject(Reseller, 'payment_type', $event)">
      </offpay-radio>
      <!-- 申请人信息 -->
      <div class="color-main fs-14">申请人信息</div>
      <div class="flex _input-warpper">
        <input type="email" class="input-text" placeholder="邮件"
               v-model.trim="Reseller.email" maxlength="32"/>
      </div>
      <div class="flex _input-warpper">
        <offpay-select class="input-text" :value="Reseller.contact_type" :list="contactTypeList"
                       value-key="value" label-key="label" placeholder="联系人类型"
                       @change="setObject(Reseller, 'contact_type', $event)"
        >
        </offpay-select>
      </div>
    </div>

    <!-- 店铺信息 -->
    <div class="box page-padding" v-if="Reseller.sicpay_type === 'PUBLIC'">
      <div class="color-main fs-14">店铺信息</div>
      <div class="flex _input-warpper">
        <input type="text" class="input-text" placeholder="工商营业执照号（个体户营业执照）"
               v-model.trim="Reseller.license" maxlength="18"/>
      </div>
      <div class="flex _input-warpper">
        <offpay-select class="input-text" :value="Reseller.license_type" :list="licenseTypeList"
                       value-key="value" label-key="label" placeholder="营业执照类型"
                       @change="setObject(Reseller, 'license_type', $event)"
        >
        </offpay-select>
      </div>
      <div class="flex _input-warpper">
        <picker mode="date" :value="licenseBeginDate"
                @change="changeSelect($event, 'licenseBeginDate')" class="input-text">
          <div class="flex" style="height:48px;padding-right:10px;">
            <p>{{ licenseBeginDate || '营业执照开始日期' }}</p>
            <div class="arrow-right"></div>
          </div>
        </picker>
      </div>
      <div class="flex _input-warpper">
        <picker mode="date" :value="licenseEndDate"
                @change="changeSelect($event, 'licenseEndDate')" class="input-text">
          <div class="flex" style="height:48px;padding-right:10px;">
            <p>{{ licenseEndDate || '营业执照结束日期' }}</p>
            <div class="arrow-right"></div>
          </div>
        </picker>
      </div>
      <div class="flex _input-warpper">
        <textarea class="input-textarea" auto-height placeholder="营业执照经营范围"
                  v-model.trim="Reseller.license_range" maxlength="256"/>
      </div>
    </div>

    <!-- 店铺地址 -->
    <div class="box page-padding">
      <div class="fs-14" style="margin-left:12px;margin:7.5px 0;">店铺地址</div>
      <div class="flex _input-warpper">
        <picker mode="region" :value="regionList" @change="changeCity" class="input-text">
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
      <div class="flex _input-warpper">
        <offpay-select class="input-text" :value="Reseller.address_type" :list="addrTypeList"
                       value-key="value" label-key="label" placeholder="地址类型"
                       @change="setObject(Reseller, 'address_type', $event)"
        >
        </offpay-select>
      </div>
    </div>

    <!-- 银行卡信息 -->
    <div class="box page-padding">
      <div class="color-main fs-14">默认提现银行卡信息</div>
      <div class="flex _input-warpper">
        <offpay-select-object class="input-text" v-model="bank_type" :list="bankTypeList"
                              label-key="name" placeholder="银行名"
        >
        </offpay-select-object>
      </div>
      <div class="flex _input-warpper">
        <input type="text" class="input-text" placeholder="银行卡号"
               v-model.trim="Reseller.default_card_no" maxlength="24"/>
      </div>
      <div class="flex _input-warpper">
        <input type="text" class="input-text" placeholder="开户人"
               v-model.trim="Reseller.default_card_name" maxlength="24"/>
      </div>
      <div class="flex _input-warpper color-main fs-12" v-if="Reseller.sicpay_type === 'PRIVATE'">
        * 对私需与申请人姓名相同
      </div>
    </div>

    <!-- 图片 -->
    <div v-for="(value, key) in pictureCaptions.shared" :key="key">
      <offpay-picture :value="sharedPics[key]" :title="value"
                      :canvas_id="key"
                      @change="setObject(sharedPics, key, $event)">
      </offpay-picture>
    </div>
    <template v-if="Reseller.sicpay_type === 'PUBLIC'">
      <div v-for="(value, key) in pictureCaptions.public" :key="key">
        <offpay-picture :value="publicPics[key]" :title="value"
                        :canvas_id="key"
                        @change="setObject(publicPics, key, $event)">
        </offpay-picture>
      </div>
    </template>
    <template v-if="Reseller.sicpay_type === 'PRIVATE'">
      <div v-for="(value, key) in pictureCaptions.private" :key="key">
        <offpay-picture :value="privatePics[key]" :title="value"
                        :canvas_id="key"
                        @change="setObject(privatePics, key, $event)">
        </offpay-picture>
      </div>
    </template>

    <button :disabled="disable" form-type="submit" class="btn btn-main btn-full btn-radius-6">
      提交
    </button>
    <button v-if="query.type !== 'EDIT'" :disabled="disable" @click="skip"
            class="btn btn-main btn-full btn-radius-6">
      跳过
    </button>
  </form>
</template>

<script>
import OffpaySelect from '@/components/apply/select';
import OffpaySelectObject from '@/components/apply/selectObject';
import OffpayPicture from '@/components/apply/picture';
import OffpayRadio from '@/components/apply/radio';
import { bankCode } from '@/utils/bankcode';
import { isEmpty, isEmail, trim_nulls as trimNulls } from '@/utils/index';
import { regionNameToAreaCode } from '@/utils/geocode';
import { showToast, httpRequest, navigateTo, redirectTo, getQuery } from '@/utils/adapter';
import { addrTypeList, contactTypeList, sicpayTypeList, paymentTypeList, licenseTypeList, pictureCaptions } from './options';
import { sicpayDateMixin, geoMixin, formMixin, pictureMixin } from '../mixins';

export default {
  components: {
    OffpaySelect,
    OffpaySelectObject,
    OffpayPicture,
    OffpayRadio,
  },
  mixins: [sicpayDateMixin, formMixin, pictureMixin, geoMixin],
  data() {
    return {
      query: {},
      disable: false,
      // 必填项
      Reseller: {
        sicpay_type: '',
        payment_type: '',
        contact_type: '',
        email: '',
        area: '',
        address: '',
        area_code: '',
        address_type: '',
        default_card_bank: '',
        default_card_bank_code: '',
        default_card_no: '',
        default_card_name: '',
      },
      regionList: [],

      bank_type: {},
      licenseBeginDate: 0,
      licenseEndDate: 0,

      sharedPics: {
        idcard_front: '',
        idcard_back: '',
      },
      publicPics: {
        // 对公
        license_picture: '',
        account_picture: '',
        store_picture: '',
        facade_picture: '',
        cashier_picture: '',
      },
      privatePics: {
        // 对私
        default_card_picture: '',
      },
      // 新增select字段
      addrTypeList,
      contactTypeList,
      sicpayTypeList,
      paymentTypeList,
      licenseTypeList,
      bankTypeList: bankCode,
      pictureCaptions,
    };
  },
  computed: {
    isCreateFailed() {
      return this.$store.state.isCreateFailed;
    },
    storeReseller() {
      return this.$store.state.reseller;
    },
  },
  watch: {
    storeReseller(val) {
      // shallow watch!
      if (JSON.stringify(val) !== '{}' && !val.uuid) {
        redirectTo({ url: '/pages/welcome/main' });
      }
      this.Reseller = this.$store.state.reseller;
      this.syncReseller();
    },
    bank_type(val) {
      if (val) {
        this.Reseller.default_card_bank = val.name;
        this.Reseller.default_card_bank_code = val.code;
      }
    },
  },
  mounted() {
    this.query = getQuery(this);
    if (this.$store.state.reseller) {
      this.Reseller = this.$store.state.reseller;
      if (!this.Reseller.uuid) {
        redirectTo({ url: '/pages/welcome/main' });
      }
    }
    this.syncReseller();
  },
  methods: {
    changeCity(e) {
      console.log('选中的城市: ', e.mp.detail.value);
      this.regionList = e.mp.detail.value;
      this.Reseller.area = this.regionList.join(' ');
      const areaCode = regionNameToAreaCode(this.Reseller.area);
      if (areaCode) {
        this.Reseller.area_code = areaCode;
      }
      console.log(this.Reseller);
    },
    changeSelect(e, list) {
      console.log('Select:', list, e.mp.detail.value);
      switch (list) {
        case 'licenseBeginDate':
          this.licenseBeginDate = e.mp.detail.value;
          this.Reseller.license_begin = this.licenseBeginDate.split('-').join('');
          break;
        case 'licenseEndDate':
          this.licenseEndDate = e.mp.detail.value;
          this.Reseller.license_end = this.licenseBeginDate.split('-').join('');
          break;
        default:
          break;
      }
    },
    syncReseller() {
      const reseller = this.Reseller;
      //  图片
      ['shared', 'public', 'private'].forEach((type) => {
        Object.keys(this.pictureCaptions[type]).forEach((pic) => {
          if (reseller[pic]) {
            this.$set(this[`${type}Pics`], pic, reseller[pic]);
          }
        });
      });
      this.bank_type = this.bankTypeList.find(item => item.name === reseller.default_card_bank);
      this.licenseBeginDate = this.sicpayDateToLabel(reseller.license_begin);
      this.licenseEndDate = this.sicpayDateToLabel(reseller.license_end);
      reseller.area = reseller.area || '';
      if (reseller.area && typeof reseller.area === 'string') {
        this.regionList = reseller.area.split(' ');
      }
      if (Array.isArray(this.regionList)) {
        reseller.area = this.regionList.join(' ');
      }
      const areaCode = regionNameToAreaCode(reseller.area);
      if (areaCode) {
        this.Reseller.area_code = areaCode;
      }
      console.log(this.sharedPics, this.licenseBeginDate);
    },
    checkValid() {
      if (!isEmail(this.Reseller.email)) {
        return false;
      }
      const invalid = Object.entries(this.Reseller)
      // eslint-disable-next-line no-unused-vars
        .filter(([key, value]) => value == null || !value.toString().trim());
      if (invalid.length) {
        // eslint-disable-next-line no-unused-vars
        showToast({ title: `请完整填写信息！缺省字段：${invalid.map(([key, value]) => key).toString()}`, icon: 'none' });
        return false;
      }
      // 图片都需要传
      const validatePictures = (type) => {
        let pictureValid = true;
        const unrequired = ['logo'];
        Object.entries(this[`${type}Pics`]).forEach(([key, val]) => {
          if (!unrequired.includes(key) && !isEmpty(this.pictureCaptions[type][key], val)) {
            pictureValid = false;
          }
        });
        return pictureValid;
      };
      if (!validatePictures('shared')) {
        return false;
      }
      if (this.Reseller.sicpay_type === 'PRIVATE' && !validatePictures('private')) {
        return false;
      }
      if (this.Reseller.sicpay_type === 'PUBLIC' && !validatePictures('public')) {
        return false;
      }
      return true;
    },
    trimReseller() {
      const privateUnrequired = {
        license: '',
        license_type: '',
        license_begin: '',
        license_end: '',
        license_range: '',
        license_picture: '',
        account_picture: '',
        store_picture: '',
        facade_picture: '',
        cashier_picture: '',
      };
      const publicUnrequired = {
        default_card_picture: '',
      };
      const params = {
        ...this.Reseller,
        ...this.sharedPics,
      };
      if (this.Reseller.sicpay_type === 'PRIVATE') {
        Object.assign(params, privateUnrequired);
      }
      if (this.Reseller.sicpay_type === 'PUBLIC') {
        Object.assign(params, publicUnrequired);
      }
      this.Reseller = trimNulls(params);
    },
    submitForm(e) {
      this.$store.dispatch('addFormId', e.target.formId);
      this.trimReseller();
      if (this.disable || !this.checkValid()) return;
      this.disable = true;
      const pics = { ...this.sharedPics };
      if (this.Reseller.sicpay_type === 'PRIVATE') {
        Object.assign(pics, this.privatePics);
      } else {
        Object.assign(pics, this.publicPics);
      }
      const uploaded = this.uploadPics(pics);
      httpRequest({
        url: `reseller/${this.Reseller.uuid}/payment/`,
        method: 'POST',
        data: trimNulls({
          ...this.Reseller,
          ...uploaded,
        }),
        success: (res) => {
          this.disable = false;
          if (res.statusCode > 199 && res.statusCode < 300) {
            navigateTo({ url: '/pages/hint/word/main?num=0' });
            this.$store.commit('SET_CREATE_FAILED', false);
          } else {
            this.$store.commit('SET_CREATE_FAILED', true);
          }
        },
      });
    },
    skip() {
      navigateTo({ url: '/pages/hint/word/main?num=0' });
    },
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
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
</style>
