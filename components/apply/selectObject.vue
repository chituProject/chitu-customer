<template>
  <picker
    mode="selector"
    :range="list"
    style="padding: 16upx 23upx;width:198upx;background: #fff;border-radius: 30upx 0 0 30upx"
    @change="changeSelect($event)"
  >
    <div class="flex" style="height: 30upx;">
      <p style="line-height: 30upx;color: #9a1f27">
        {{ pickerLabel || placeholder }}
      </p>
      <div class="arrow-down" style="margin-left: 15upx"></div>
    </div>
  </picker>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: false
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    list1: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      index: -1
    };
  },
  computed: {
    pickerLabel() {
      return this.list[this.index];
    }
    // pickerValue() {
    //   return this.list.findIndex(item => item[this.valueKey] === this.value);
    // }
  },
  methods: {
    changeSelect(e) {
      console.log(e);
      this.index = e.mp.detail.value;
      this.$emit("change", this.list[this.index], this.index);
      // const selectedValue = this.list[e.mp.detail.value];
      // if (selectedValue != null) {
      //   this.$emit('input', selectedValue[this.valueKey]);
      //   this.$emit('change', selectedValue[this.valueKey]);
      // } else {
      //   this.$emit('input', null);
      //   this.$emit('change', null);
      // }
    }
  }
};
</script>
