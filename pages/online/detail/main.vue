<template>
  <div>
    <div class="background" />
    <navBar
      :navs="navs"
      :active-index="activeIndex"
      @indexChanged="navCallback"
    ></navBar>
    <div v-show="activeIndex === 0">
      <van-cell-group>
        <van-cell
          title="滚动一年收益"
          :value="Math.floor(model.three_year_profit * 100) / 100 + '%'"
          size="large"
        />
        <van-cell title="夏普比率" :value="model.sharpe_ratio" size="large" />
        <van-cell
          title="YTD"
          :value="Math.floor(model.ytd * 100) / 100 + '%'"
          size="large"
        />
        <van-cell
          title="近三年收益率"
          :value="Math.floor(model.ytd * 100) / 100 + '%'"
          size="large"
        />
        <van-cell title="最大回撤" :value="model.max_fallback" size="large" />
        <van-cell
          title="最大回撤月份"
          :value="model.max_fallback_created_at"
          size="large"
        />
      </van-cell-group>
    </div>
    <div v-show="activeIndex === 1">
      <van-cell-group>
        <van-cell title="基金名称" :value="model.name" size="large" />
        <van-cell title="基金经理" :value="model.manager" size="large" />
        <van-cell
          title="基金类别"
          :value="model.type === 'MANAGER' ? '经理基金' : '指数基金'"
          size="large"
        />
        <van-cell
          title="基金策略"
          :value="fund_strategy_name[model.strategy]"
          size="large"
        />
      </van-cell-group>

      <div style="margin-top: 60upx;">
        <van-tabs type="card" color="#a5323a" animated="true">
          <van-tab title="概述">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in model.general_infomation"
                :key="index"
                :title="item.key"
                :value="item.value"
                size="large"
              />
            </van-cell-group>
          </van-tab>
          <van-tab title="运营">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in model.operation"
                :key="index"
                :title="item.key"
                :value="item.value"
                size="large"
              />
            </van-cell-group>
          </van-tab>
          <van-tab title="条款">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in model.article"
                :key="index"
                :title="item.key"
                :value="item.value"
                size="large"
              />
            </van-cell-group>
          </van-tab>
          <van-tab title="组合特征">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in model.combination"
                :key="index"
                :title="item.key"
                :value="item.value"
                size="large"
              />
            </van-cell-group>
          </van-tab>
          <van-tab title="多头">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in model.long_positions"
                :key="index"
                :title="item.key"
                :value="item.value"
                size="large"
              />
            </van-cell-group>
          </van-tab>
          <van-tab title="空头">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in model.short_positions"
                :key="index"
                :title="item.key"
                :value="item.value"
                size="large"
              />
            </van-cell-group>
          </van-tab>
          <van-tab title="总体仓位">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in model.designed_exposure"
                :key="index"
                :title="item.key"
                :value="item.value"
                size="large"
              />
            </van-cell-group>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/navBar.vue";

export default {
  components: {
    navBar
  },
  data() {
    return {
      activeIndex: 0,
      navs: [{ title: "业绩信息" }, { title: "基金档案" }],
      model: {},
      fund_strategy_name: {
        quantification: "量化",
        fixed__income: "固收",
        macro__hedging: "宏观对冲",
        pure__bull: "纯多头",
        long__short: "多空",
        combination: "复合",
        other: "其他"
      }
    };
  },
  methods: {
    getData(id) {
      this.$request({
        method: "GET",
        url: `fund_archive/${id}/`
      }).then(([_, res]) => {
        this.model = res.data;
      });
    },
    navCallback(e) {
      console.log(e);
      this.activeIndex = e;
    }
  },
  onLoad(option) {
    this.getData(option.id);
  }
};
</script>

<style lang="scss" scoped>
.test {
  width: 100% !important;
}
</style>
