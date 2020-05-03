<template>
  <div class="calendar-container">
    <picker
      class="fs-16"
      mode="date"
      :fields="fields"
      :start="startDate"
      :end="endDate"
      :value="value"
      @change="changeDate"
    >
      <div class="calendar">
        {{ value }}
        <img class="icon-15 calendar-icon" src="/static/img/icons/calendar.png">
      </div>
    </picker>
    <radio-group class="flex flex-justify_start radio-group" @change="changeField">
      <div v-for="item in ['month', 'day']" :key="item" style="margin-right:12px;">
        <radio :value="item" class="radio" color="rgba(245, 98, 80, 1)"
               :checked="item === fields" />
        <label>{{labels[item]}}</label>
      </div>
    </radio-group>
  </div>
</template>


<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fields: 'day',
      labels: {
        day: '按天查找',
        month: '按月查找',
      },
    };
  },
  computed: {
    startDate() {
      return this.getDate('start', 'day');
    },
    endDate() {
      return this.getDate('end', 'day');
    },
  },
  methods: {
    changeDate(e) {
      let date = e;
      if (typeof e === 'object') {
        date = e.target.value;
      }
      this.$emit('change', date);
      this.$emit('input', date);
    },
    changeField() {
      this.fields = this.fields === 'day' ? 'month' : 'day';
      const date = this.getDate(null, this.fields);
      this.changeDate(date);
    },
    getDate(type, fields = 'day') {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === 'start') {
        year -= 60;
      } else if (type === 'end') {
        year += 2;
      }
      month = month > 9 ? month : `0${month}`;
      day = day > 9 ? day : `0${day}`;
      if (fields === 'day') {
        return `${year}-${month}-${day}`;
      }
      if (fields === 'month') {
        return `${year}-${month}`;
      }
      return '';
    },
  },
};
</script>

<style scoped>
.calendar-container {
  width: 100vw;
  padding-left: 24rpx;
  padding-right: 24rpx;
  padding-bottom: 24rpx;
  box-sizing: border-box;
  display:flex;
  justify-content:space-between;
}
.calendar-icon {
  margin-left:5px;
}
</style>
