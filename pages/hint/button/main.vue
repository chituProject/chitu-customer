<template>
  <div class="container">
    <div class="background"></div>
    <form style="margin-top:36.67%;text-align:center;" @submit="navBack" report-submit="true">
      <img class="icon-35" src="/static/img/icons/success.svg">
      <div class="fs-13 grey39-color" style="margin-bottom:60px;">
        成功添加{{Query.bank}}{{Query.type}}
      </div>
      <button class="btn btn-main btn-small btn-radius-6" form-type="submit">完成</button>
    </form>
  </div>
</template>

<script>
import { navigateBack, getQuery } from '@/utils/adapter';

export default {
  data() {
    return {
    };
  },
  components: {
  },
  computed: {
    Query() {
      return getQuery(this);
    },
  },
  methods: {
    navBack(e) {
      this.$store.dispatch('addFormId', e.target.formId);
      navigateBack({ delta: 1 });
    },
  },
  mounted() {
  },
};
</script>

<style scoped>
</style>
