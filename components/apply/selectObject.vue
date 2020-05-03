<template>
  <picker mode="selector" :range="list" :range-key="labelKey" :value="pickerValue"
          @change="changeSelect($event)"
  >
    <div class="flex" style="height:48px;padding-right:10px;">
      <p>{{ pickerLabel || placeholder }}</p>
      <div class="arrow-right"></div>
    </div>
  </picker>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: false,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    placeholder: {
      type: String,
      required: false,
    },
    labelKey: {
      type: String,
      required: true,
    },
  },
  computed: {
    pickerLabel() {
      return (this.list.find(item => this.strEquals(item, this.value)) || {})[this.labelKey];
    },
    pickerValue() {
      return this.list.findIndex(item => this.strEquals(item, this.value));
    },
  },
  methods: {
    strEquals(a, b) {
      return a === b || JSON.stringify(a) === JSON.stringify(b);
    },
    changeSelect(e) {
      const selectedValue = this.list[e.mp.detail.value];
      this.$emit('input', selectedValue);
      this.$emit('change', selectedValue);
    },
  },
};
</script>
