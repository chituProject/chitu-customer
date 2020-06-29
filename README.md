# offpay-customer

> offpay frontend for customer, based on [uni-app](https://uniapp.dcloud.io/) and [mpvue](http://mpvue.com/)

- [产品原型](https://modao.cc/)
- [产品UI](http://www.fancynode.com.cn/pxcook)
- [git仓库](http://gogs.offpay.cn/)
- [后端接口swagger](http://dev.offpay.cn/docs/)

## Build Setup

``` bash
# first add your ssh-key to gogs, then clone this repo recursively(raven is added to submodule)

git clone --recursive gogs@gogs.offpay.cn:wangyao/offpay-customer.git

# install dependencies
# 可能需要cnpm才能安装成功
npm i

# 在测试服开发，将"@/utils/config-dev.json"复制为"@/utils/config.json"
npm run dev

# 上线到正式服，将"@/utils/config-prod.json"复制为"@/utils/config.json"
npm run build
```
请使用HBuilderX工具的运行到微信开发者工具进行热调试，以及打包、发布。

## SDK列表

- 流量分析: [阿拉丁统计平台](https://aldwx.com)
- 前端日志: [sentry](http://sentry.offpay.cn)
- 组件UI: [mpvue-weui](https://github.com/KuangPF/mpvue-weui)
- 组件UI: [weapp-vant](https://youzan.github.io/vant-weapp/#/intro)
- 图标字体: [fontawesome](https://www.iconfont.cn/)

## 开发日志

### 2.5 版本
1. 锦鲤礼包功能完成
    - 增添定时开奖逻辑
    - 增添锦礼礼包逻辑
    - 分享图、抽奖页面UI更新
    - 增添往期中奖者名单
    - 增添重新开奖逻辑
2. 高汇通支付接口调通
    - 从ping++到高汇通接口的转换
3. C端mpvue转uni-app完成
4. store逻辑重构
    - 使用了mapGetter获取，优化逻辑
5. 免单生活话费、油卡、互娱、礼品卡接入完成
    - 完成正式接口的测试（在58chong后台看到了充值成功的订单）
    - 在测试接口下完成了所有58chong接口的开发
    - admin端配置免单生活的商品，c端动态获取（根据商品SPU、SKU组织）
    - 将正式服、测试服差异化的配置抽取到config中，保证业务的一致性
6. 用户登录逻辑
    - 更新新用户的注册、授权逻辑
    - 增添用户手机号的授权获取逻辑，在必要时调用
    - 修复重复调用wx.login造成session频繁更新，造成登录失效的问题


### 2.6 版本
1. 在附近功能完成
    - 添加线下商户展示页面
    - 添加线下商户类目
    - 修复经纬度换算公式
2. 商品详情更新
    - 下架商品的正常获取，不可下单处理
    - 默认选中第一个SKU
    - 占位图延时修复
3. 怡亚通相关逻辑
    - 怡亚通商品相关字段对应
    - 订单流程更新
    - 售后流程更新
4. 首页改版
    - UI(手风琴文案)
    - 抢购
    - 好物评价
5. 推荐瀑布流
6. 免单生活
    - 条件编译，在微信小程序端下架礼品卡、虚拟充值服务
7. 锦礼君C端入口隐藏
    - 在admin做配置，只有用户tag包含“免单君”的C端用户才能看到入口
8. 打包到H5初步完成
    - 注册登录
    - 基本CSS修复

### 扫码相关逻辑备忘（已废弃，需要重做）
- 首次通过扫码进入线下扫码页时，调用/log/scan；
- 首次点击任意商品，调用/log/click；
- 首次在任意商品详情停留5s（不累积），调用/log/fivesecs；
- 每次隐藏瀑布流，判断新曝光的商品，调用/log/browse；
