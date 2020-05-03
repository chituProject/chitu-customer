<template>
  <radio-group class="flex flex-justify_start radio-group" @change="change">
    <div v-for="item in list" :key="item[valueKey]" style="margin-right:12px;">
      <radio :value="item[valueKey]" class="radio" color="rgba(245, 98, 80, 1)"
             :checked="item[valueKey] === value" />
      <label>{{item[labelKey]}}</label>
    </div>
  </radio-group>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number, Boolean],
      required: false,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    valueKey: {
      type: String,
      required: true,
    },
    labelKey: {
      type: String,
      required: true,
    },
  },
  methods: {
    change(e) {
      this.$emit('input', e.target.value);
      this.$emit('change', e.target.value);
    },
  },
};
</script>

<style scoped>
.radio-group {
  padding: 10px 0;
}
.radio {
  padding-right: 10px;
}
</style>
