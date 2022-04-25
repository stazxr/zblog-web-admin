<template>
  <div class="container">
    <div class="buttons">
      <el-button class="holidayButton" plain size="medium" type="primary" :disabled="selectedDay === ''" @click="submitHoliday">设置节假日</el-button>
      <el-button class="holidayButton" plain size="medium" type="primary" :disabled="selectedDay === ''" @click="submitWorkday">设置工作日</el-button>
      <el-button class="holidayButton" plain size="medium" type="primary" :disabled="selectedDay === ''" @click="deleteDaySet">删除</el-button>
      <el-button class="holidayButton" plain size="medium" type="primary" @click="importData">导入</el-button>
      <el-button class="holidayButton" plain size="medium" type="primary" @click="exportData">导出</el-button>
    </div>
    <full-calendar firstDay="1" lang="zh" :holidayList="holidayList" @eventClick="eventClick" @changeMonth="changeDate"></full-calendar>
  </div>
</template>

<script>
import FullCalendar from "@/components/vue-fullcalendar/fullCalendar";
import { parseTime } from "@/utils/parseTime";
import { download } from "@/utils/export";
export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      holidayList: [],
      selectedDay: "",
      selectedYear: new Date().getFullYear(),
    };
  },
  watch: {
    selectedYear: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getList(newVal);
      }
    },
  },
  methods: {
    getList(year) {
      this.$mapi.calendar.listCalendarSet({
        year: year
      }).then(res => {
        if (res && res.code === 200) {
          this.holidayList = res.data;
        }
      }).catch(_ => {
        this.$message({ message: "获取节假日列表失败！系统发生了未知异常~", type: "error" });
      })
    },
    eventClick(date, event, jsEvent, pos) {
      this.selectedDay = parseTime(date, "{y}-{m}-{d}");
    },
    changeDate(start, end, currentStart, currentDate) {
      this.selectedYear = parseTime(currentDate, "{y}");
    },
    submitHoliday() {
      if (this.selectedDay === "") {
        this.$message({ message: "请选择日期", type: "warning" });
        return;
      }

      this.$prompt("请输入备注（最大支持10个字符）", "确定设置" + this.selectedDay + "为节假日吗？", {
        confirmButtonText: "确定", cancelButtonText: "取消",
      }).then(value => {
        let remark = value.value == null ? "" : value.value;
        if (remark.length > 10) {
          this.$message({ message: "备注最大支持10个字符", type: "warning" });
          return;
        }

        this.$mapi.calendar.calendarSet({
          date: this.selectedDay, remark: remark, type: '0'
        }).then(res => {
          if (res && res.code === 200) {
            this.$message({ message: res.message, type: "success" });
            this.selectedDay = '';
            this.getList(this.selectedYear);
          } else {
            this.$message({ message: res.message, type: "error" });
          }
        }).catch(_ => {
          this.$message({ message: "设置节假日失败！系统发生了未知异常~", type: "error" });
        })
      }).catch(() => { });
    },
    submitWorkday() {
      if (this.selectedDay === "") {
        this.$message({ message: "请选择日期", type: "warning" });
        return;
      }

      this.$prompt("请输入备注（最大支持10个字符）", "确定设置" + this.selectedDay + "为工作日吗？", {
        confirmButtonText: "确定", cancelButtonText: "取消",
      }).then(value => {
        let remark = value.value == null ? "" : value.value;
        if (remark.length > 10) {
          this.$message({ message: "备注最大支持10个字符", type: "warning" });
          return;
        }

        this.$mapi.calendar.calendarSet({
          date: this.selectedDay, remark: remark, type: '1'
        }).then(res => {
          if (res && res.code === 200) {
            this.$message({ message: res.message, type: "success" });
            this.selectedDay = '';
            this.getList(this.selectedYear);
          } else {
            this.$message({ message: res.message, type: "error" });
          }
        }).catch(_ => {
          this.$message({ message: "设置工作日失败！系统发生了未知异常~", type: "error" });
        })
      }).catch(() => { });
    },
    deleteDaySet() {
      if (this.selectedDay === "") {
        this.$message({ message: "请选择日期", type: "warning" });
        return;
      }

      this.$confirm("确定删除" + this.selectedDay + "的节假日或工作日配置吗?", "提示", {
        confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"
      }).then(_ => {
        this.$mapi.calendar.cancelCalendarSet({
          date: this.selectedDay
        }).then(res => {
          if (res && res.code === 200) {
            this.$message({ message: res.message, type: "success" });
            this.selectedDay = '';
            this.getList(this.selectedYear);
          } else {
            this.$message({ message: res.message, type: "error" });
          }
        }).catch(_ => {
          this.$message({ message: "删除节假日或工作日配置失败！系统发生了未知异常~", type: "error" });
        })
      }).catch(_ => { })
    },
    importData() {

    },
    exportData() {
      this.$confirm('此操作将导出今年的节假日列表, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'primary'
      }).then(() => {
        this.$mapi.calendar.exportCalendarSet().then(res => {
          console.log("res", res);
          console.log("res", res.headers['content-disposition']);
          // download(data, "节假日列表.xls");
          // this.$message.success("导出成功！");
        }).catch(_ => {
          console.log("eor info", _)
          this.$message({ message: "导出失败，系统发生了未知的错误~", type: "error" });
        });
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 30px;
  margin: 0 auto;
  background: #fff;
  .buttons {
    margin-left: 50px;
  }
}
</style>
