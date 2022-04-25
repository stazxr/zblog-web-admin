<template>
  <div class="full-calendar-header">
    <div class="header-left">
      <slot name="header-left"></slot>
    </div>
    <div class="header-center">
      <!-- <span class="prev-month" @click.stop="goPrev">{{leftArrow}}</span>
      <span class="title">{{title}}</span>
      <span class="next-month" @click.stop="goNext">{{rightArrow}}</span> -->
      <el-date-picker v-model="nowMonth" type="month" placeholder="选择月" value-format="yyyy-MM" :clearable = "false" @change="changeMonthDay"
          style="font-size: 16px;font-weight: bold;">
      </el-date-picker>
      <el-button class="to-today" type="primary" plain size="medium" @click="toDate">本月</el-button>
    </div>
    <div class="header-right">
      <slot name="header-right"></slot>
    </div>
  </div>
</template>

<script type="text/babel">
import dateFunc from './dateFunc'
export default {
  props: ["currentDate", "titleFormat", "firstDay", "monthNames"],
  data () {
    return {
      title: '',
      leftArrow: '<',
      rightArrow: '>',
      headDate: new Date(),
      nowMonth: dateFunc.format(new Date(), 'yyyy-MM')
    }
  },
  watch : {
    currentDate (val) {
      if (!val) return
      this.headDate = val
    }
  },
  created () {
    this.dispatchEvent()
  },
  methods : {
    toDate() {
      this.headDate = new Date()
      this.nowMonth = dateFunc.format(new Date(), 'yyyy-MM')
      this.dispatchEvent()
    },
    dispatchEvent() {
      this.title = dateFunc.format(this.headDate, this.titleFormat, this.monthNames)
      let startDate = dateFunc.getStartDate(this.headDate)
      let curWeekDay = startDate.getDay()

      // 1st day of this monthView
      let diff = parseInt(this.firstDay) - curWeekDay
      if (diff) diff -= 7
      startDate.setDate(startDate.getDate() + diff)

      // the month view is 6*7
      let endDate = dateFunc.changeDay(startDate, 41)

      // 1st day of current month
      let currentDate = dateFunc.getStartDate(this.headDate)

      this.$emit('change',
          dateFunc.format(startDate, 'yyyy-MM-dd'),
          dateFunc.format(endDate, 'yyyy-MM-dd'),
          dateFunc.format(currentDate,'yyyy-MM-dd'),
          this.headDate
      )
    },
    changeMonthDay(value) {
      this.headDate = new Date(value);
      this.dispatchEvent()
    },
    goPrev () {
      this.headDate = this.changeMonth(this.headDate, -1)
      this.dispatchEvent()
    },
    goNext () {
      this.headDate = this.changeMonth(this.headDate, 1)
      this.dispatchEvent()
    },
    changeMonth (date, num) {
      let dt = new Date(date)
      return new Date(dt.setMonth(dt.getMonth() + num))
    }
  }
}
</script>

<style lang="scss">
.full-calendar-header {
  display: flex;
  align-items: center;
  .header-left, .header-right {
    flex:1;
  }
  .header-center {
    flex:3;
    text-align:center;
    font-size:18px;
    .to-today {
      margin-left: 30px;
    }
    .title {
      margin: 0 10px;
    }
    .prev-month, .next-month {
      cursor: pointer;
    }
  }
}
</style>

