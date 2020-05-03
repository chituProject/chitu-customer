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
      type: String,
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
    valueKey: {
      type: String,
      required: true,
    },
    labelKey: {
      type: String,
      required: true,
    },
  },
  computed: {
    pickerLabel() {
      return (this.list.find(item => item[this.valueKey] === this.value) || {})[this.labelKey];
    },
    pickerValue() {
      return this.list.findIndex(item => item[this.valueKey] === this.value);
    },
  },
  methods: {
    changeSelect(e) {
      const selectedValue = this.list[e.mp.detail.value];
      if (selectedValue != null) {
        this.$emit('input', selectedValue[this.valueKey]);
        this.$emit('change', selectedValue[this.valueKey]);
      } else {
        this.$emit('input', null);
        this.$emit('change', null);
      }
    },
  },
};
</script>
