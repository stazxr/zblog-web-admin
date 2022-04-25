<template>
  <div class="comp-full-calendar">
    <!-- header -->
    <fc-header :first-day="firstDay" :current-date="currentDate" :title-format="titleFormat" :month-names="monthNames" @change="emitChangeMonth">
      <div slot="header-left">
        <slot name="fc-header-left"></slot>
      </div>
      <div slot="header-right">
        <slot name="fc-header-right"></slot>
      </div>
    </fc-header>

    <!-- body -->
    <fc-body :current-date="currentDate" :holidayList="holidayList"
        :month-names="monthNames" :week-names="weekNames" :first-day="firstDay"
        @eventClick="emitEventClick" @dayClick="emitDayClick" @moreClick="emitMoreClick">
      <div slot="body-card">
        <slot name="fc-body-card"></slot>
      </div>
    </fc-body>
  </div>
</template>

<script type="text/babel">
import langSets from './dataMap/langSets'
import header from './components/header'
import body from './components/body'
export default {
  components : {'fc-body': body, 'fc-header': header},
  props: ["firstDay", "lang", "holidayList"],
  data () {
    return {
      currentDate: new Date()
    }
  },
  computed: {
    titleFormat: function () {
      return langSets[this.lang].titleFormat;
    },
    monthNames: function () {
      return langSets[this.lang].monthNames;
    },
    weekNames: function () {
      let arr = langSets[this.lang].weekNames;
      return arr.slice(this.firstDay).concat(arr.slice(0, this.firstDay));
    }
  },
  methods : {
    emitChangeMonth (start, end, currentStart, current) {
      this.currentDate = current
      this.$emit('changeMonth', start, end, currentStart, current)
    },
    emitEventClick (date, event, jsEvent, pos) {
      this.$emit('eventClick', date, event, jsEvent, pos)
    },
    emitDayClick (day, jsEvent) {
      this.$emit('dayClick', day, jsEvent)
    },
    emitMoreClick (day, events, jsEvent) {
      this.$emit('moreClick', day, events, jsEvent)
    }
  }
}
</script>

<style lang="scss">
.comp-full-calendar {
  background: #fff;
  width: 100%;
  ul, p {
    margin: 0;
    padding: 0;
    font-size: 14px;
  }
}
</style>
