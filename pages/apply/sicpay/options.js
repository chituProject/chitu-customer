export const sicpayTypeList = Object.freeze([{
  label: '对私',
  value: 'PRIVATE',
}, {
  label: '对公',
  value: 'PUBLIC',
}]);

export const paymentTypeList = Object.freeze([{
  label: '自动清算',
  value: 'AUTO',
}, {
  label: '手动清算',
  value: 'MANUAL',
}]);

export const addrTypeList = Object.freeze([{
  value: 'REGISTERED_ADDRESS',
  label: '注册地址',
}, {
  value: 'BUSINESS_ADDRESS',
  label: '经营地址',
}]);

export const contactTypeList = Object.freeze([{
  value: 'LEGAL_PERSON',
  label: '法人',
}, {
  value: 'CONTROLLER',
  label: '实际控制人',
}, {
  value: 'AGENT',
  label: '代理人',
}, {
  value: 'OTHER',
  label: '其他',
}]);

export const licenseTypeList = Object.freeze([{
  value: 'NATIONAL_LEGAL',
  label: '营业执照',
}, {
  value: 'NATIONAL_LEGAL_MERGE',
  label: '营业执照（多证合一）',
}, {
  value: 'INST_RGST_CTF',
  label: '事业单位法人证书',
}]);

export const storeTypeList = Object.freeze([{
  value: 'FOOD',
  label: '美食',
}, {
  value: 'GROCERIES',
  label: '零售',
}, {
  value: 'BEAUTY',
  label: '丽人',
}, {
  value: 'PETS',
  label: '宠物',
}, {
  value: 'FUN',
  label: '娱乐',
}, {
  value: 'OTHER',
  label: '其他',
}]);

export const pictureCaptions = Object.freeze({
  shared: {
    idcard_front: '身份证正面*',
    idcard_back: '身份证反面*',
  },
  public: {
  // 对公
    license_picture: '工商营业执照（个体户营业执照）照片*',
    account_picture: '开户许可证*',
    facade_picture: '店铺门头照片*',
    store_picture: '店内照片（线上商户请上传办公背景）*',
    cashier_picture: '收银台照片（线上商户请上传办公背景）*',
  },
  private: {
    // 对私
    default_card_picture: '默认提现银行卡*',
  },
});
