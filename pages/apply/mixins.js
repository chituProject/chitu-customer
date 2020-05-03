import { showToast } from '@/utils/adapter';
import config from '@/utils/config.json';

const dao = require('../../static/sdk/cos-sdk.js');

export const sicpayDateMixin = {
  methods: {
    sicpayDateToLabel(date) {
      if (date) {
        const yyyy = date.slice(0, 4);
        const mm = date.slice(4, 6);
        const dd = date.slice(6, 8);
        return `${yyyy}-${mm}-${dd}`;
      }
      return '';
    },
  },
};

export const formMixin = {
  methods: {
    setObject(type, key, pic) {
      this.$set(type, key, pic);
    },
  },
};

export const pictureMixin = {
  methods: {
    uploadPics(pictures, uuid) {
      const uploadedPics = {};
      const prefix = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/`;
      Object.entries(pictures).forEach(([name, pic]) => {
        if (pic && pic.indexOf('tmp') !== -1) {
          showToast({ title: '图片上传中' });
          const url = `reseller/${this.Reseller.uuid || uuid}/${name}.png`;
          dao.postObject(pic, url);
          uploadedPics[name] = prefix + url;
        }
      });
      return uploadedPics;
    },
  },
};

export const geoMixin = {
  data() {
    return {
      Reseller: {},
      longitude: 116.23,
      latitude: 39.54,
    };
  },
  methods: {
    chooseLoc() {
      wx.chooseLocation({
        success: (res) => {
          console.log(res);
          this.Reseller.address = res.address;
          this.longitude = res.longitude;
          this.latitude = res.latitude;
        },
        fail: (err) => {
          console.error(err);
        },
      });
    },
    getLoc() {
      wx.getLocation({
        // type: 'wgs84',
        success: (res) => {
          this.longitude = res.longitude;
          this.latitude = res.latitude;
        },
      });
    },
  },
};
