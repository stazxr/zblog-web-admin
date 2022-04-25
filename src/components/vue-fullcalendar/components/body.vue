<template>
  <div class="full-calendar-body">
    <div class="weeks">
      <strong class="week" v-for="(week, index) in weekNames" :key="index">{{week}}</strong>
    </div>
    <div class="dates" ref="dates">
      <div class="dates-events">
        <!-- 遍历当天月获取每一周 -->
        <div class="events-week" v-for="(week, index) in currentDates" :key="index">
          <!-- 遍历每一周获取每一日 -->
          <div class="events-day" v-for="(day, index) in week"
              :key="index" track-by="$index"
              :class="{
                'today': day.isToday,
                'not-cur-month': !day.isCurMonth,
                'eventBg': day.events.length > 0,
                'clickDay': day.date === selectedDay
              }"
              @click.stop="eventClick(day.date, day.events, $event)"
          >

            <div class="event-box">
              <p class="event-item" v-for="(event, index) in day.events" :key="index" v-show="event.cellIndex <= eventLimit"
                  :class="[ classNames(event['cssClass']), {
                    'is-start': isStart(event.start, day.date),
                    'is-end': isEnd(event.end, day.date),
                    'is-opacity': !event.isShow,
                    'is-work': event.type === '1'
                  },
                ]"
              >
                {{ isBegin(event, day.date, day.weekDay) }}
                <span v-if="event.remark">{{event.remark ? event.remark : ''}}</span>
              </p>
            </div>
            <p class="day-number" :class="{ eventDay: day.events.length > 0, 'iswork' : day.events.length > 0 && day.events[0].type === '1' }" >
              {{ day.monthDay }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
import dateFunc from "./dateFunc";
export default {
  props: ["currentDate", "holidayList", "weekNames", "monthNames", "firstDay"],
  data() {
    return {
      weekMask: [1, 2, 3, 4, 5, 6, 7],
      eventLimit: 1,
      showMore: true,
      morePos: {
        top: 0,
        left: 0,
      },
      selectDay: {},
      selectedDay: "",
    };
  },
  created() {
    this.handleHolidayList();
  },
  watch: {
    holidayList(newVal, oldVal) {
      if (newVal.length > 0) {
        this.handleHolidayList()
      }
    },
  },
  computed: {
    // 计算当前月所有的天数
    currentDates() {
      return this.getCalendar();
    },
  },
  methods: {
    // 处理日期
    handleHolidayList() {
      this.holidayList.forEach((item) => {
        item._id = item.id;
        item.start = item.date + ' 00:00:00';
        item.end = item.date + ' 23:59:59';
      });
    },
    // 获取当前月的日期列表
    getCalendar() {
      let now = new Date();
      let current = new Date(this.currentDate);
      let startDate = dateFunc.getStartDate(current);
      let curWeekDay = startDate.getDay();
      let diff = parseInt(this.firstDay) - curWeekDay;
      diff = diff > 0 ? diff - 7 : diff;
      startDate.setDate(startDate.getDate() + diff);
      let calendar = []; // save month
      for (let perWeek = 0; perWeek < 6; perWeek++) {
        let week = [];  // save week
        for (let perDay = 0; perDay < 7; perDay++) {
          let event = this.slotEvents(startDate);
          let weekend = perDay === 5 || perDay === 6;
          if (event.length === 0) {
            if (weekend) {
              let today = dateFunc.format(startDate, 'yyyy-MM-dd')
              event.push({
                cellIndex: 1,
                isShow: true,
                type: "0",
                remark: "周末",
                date: today,
                start: today + " 00:00:00",
                end: today + " 23:59:59",
                default: true
              })
            }
          }

          let day = {
            monthDay: startDate.getDate(),
            isToday: now.toDateString() === startDate.toDateString(),
            isCurMonth: startDate.getMonth() === current.getMonth(),
            weekDay: perDay,
            weekend: perDay === 5 || perDay === 6,
            date: new Date(startDate),
            events: event,
          }

          week.push(day);
          startDate.setDate(startDate.getDate() + 1);
        }
        calendar.push(week);
      }
      return calendar;
    },
    // 获取当天的事件
    slotEvents(date) {
      let thisDayEvents = this.holidayList.filter((day) => {
        let st = new Date(day.start);
        let ed = new Date(day.end);
        return date >= st && date <= ed;
      });
      if (thisDayEvents.length === 0) {
        return [];
      }

      let dayEvents = [];
      let dayEvent = thisDayEvents[0];
      dayEvent.cellIndex = dayEvent.cellIndex || 1;
      dayEvent.isShow = true;
      dayEvent.default = false;
      dayEvents.push(dayEvent)
      return dayEvents;
    },
    // 设置事件的样式
    classNames(cssClass) {
      if (!cssClass) return "";
      if (typeof cssClass == "string") return cssClass;
      if (Array.isArray(cssClass)) return cssClass.join(" ");
      return "";
    },
    isStart(eventDate, date) {
      let st = new Date(eventDate);
      return st.toDateString() === date.toDateString();
    },
    isBegin(event, date, index) {
      let startDate = new Date(event.start);
      if (index === 0 || startDate.toDateString() === date.toDateString()) {
        if (event.type === '0') {
          if (event.default) {
            return '末';
          } else {
            return '休'
          }
        } else if (event.type === '1') {
          return "班"
        }
      }
      return "";
    },
    isEnd(eventDate, date) {
      let ed = new Date(eventDate);
      return ed.toDateString() === date.toDateString();
    },
    selectThisDay(day, jsEvent) {
      this.selectDay = day;
      this.showMore = true;
      this.morePos = this.computePos(jsEvent.target);
      this.morePos.top -= 100;
      let events = day.events.filter((item) => {
        return item.isShow === true;
      });
      this.$emit("moreClick", day.date, events, jsEvent);
    },
    dayClick(day, event) {
      this.$emit("dayClick", day, event);
    },
    eventClick(date, event, jsEvent) {
      this.selectedDay = date;
      jsEvent.stopPropagation();
      let pos = this.computePos(jsEvent.target);
      this.$emit("eventClick", date, event, jsEvent, pos);
    },
    computePos(target) {
      let eventRect = target.getBoundingClientRect();
      let pageRect = this.$refs.dates.getBoundingClientRect();
      return {
        left: eventRect.left - pageRect.left,
        top: eventRect.top + eventRect.height - pageRect.top,
      };
    }
  },
};
</script>
<style lang="scss">
.full-calendar-body {
  margin-top: 20px;
  .weeks {
    height: 30px;
    line-height: 30px;
    display: flex;
    border-top: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
    .week {
      flex: 1;
      text-align: center;
      border-right: 1px solid #dfe6ec;
    }
  }
  .dates {
    position: relative;
    .week-row {
      // width: 100%;
      // position:absolute;
      border-left: 1px solid #dfe6ec;
      display: flex;
      .day-cell {
        flex: 1;
        min-height: 90px;
        padding: 4px;
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        .day-number {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &.today {
          background-color: #fcf8e3;
        }
        &.not-cur-month {
          .day-number {
            color: rgba(0, 0, 0, 0.24);
          }
        }
      }
    }
    .dates-events {
      // position:absolute;
      position: relative;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      border-left: 1px solid #dfe6ec;
      .events-week {
        display: flex;
        border-bottom: 1px solid #dfe6ec;
        .events-day:hover {
          background-color: rgba(102, 153, 255, 0.1);
        }
        .events-day {
          cursor: pointer;
          flex: 1;
          min-height: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          border-right: 1px solid #dfe6ec;
          position: relative;
          &.eventBg {
            background-color: #f5f5f5;
          }
          &.clickDay {
            background-color: rgba(102, 153, 255, 0.2);
          }
          .day-number {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            height: 100%;
            margin-top: -30px;
            display: flex;
            justify-content: center;
            align-items: center;

            &.eventDay {
              color:#e02d2d;
            }
            &.iswork{
              color:#000;
            }
          }
          &.today {
            background-color: #fcf8e3;
          }
          &.not-cur-month {
            pointer-events: none;
            .day-number {
              color: rgba(0, 0, 0, 0.24);
            }
          }
          .event-box {
            height: 30px;

            .event-item {
              cursor: pointer;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              background-color: orangered;
              margin-bottom: 2px;
              margin-top: 2px;
              color: #fff;
              height: 100%;
              line-height: 30px;
              width:30px;

              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              &.is-start {
                margin-left: 4px;
                border-top-left-radius:4px;
                border-bottom-left-radius:4px;
              }
              &.is-end {
                margin-right: 4px;
                border-top-right-radius:4px;
                border-bottom-right-radius:4px;
              }
              &.is-opacity {
                opacity: 0;
              }
              &.is-work{
                background-color: #969799;
                span{
                  color:#999;
                }
              }
              span{
                position: absolute;
                bottom: 5px;
                left: 0;
                right: 0;
                margin: auto;
                color:#e02d2d;
                font-size: 14px;
              }
            }
            .more-link {
              cursor: pointer;
              // text-align: right;
              padding-left: 8px;
              padding-right: 2px;
              color: rgba(0, 0, 0, 0.38);
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
