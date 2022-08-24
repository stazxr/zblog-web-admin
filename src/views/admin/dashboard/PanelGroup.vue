<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('visits')">
        <div class="card-panel-icon-wrapper icon-visits">
          <svg-icon icon-class="visits" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            访问量
          </div>
          <count-to :start-val="0" :end-val="panelData.visits" :duration="5000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            评论数
          </div>
          <count-to :start-val="0" :end-val="panelData.messages" :duration="5000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('articles')">
        <div class="card-panel-icon-wrapper icon-articles">
          <svg-icon icon-class="education" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            文章数
          </div>
          <count-to :start-val="0" :end-val="panelData.articles" :duration="5000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('warnings')">
        <div class="card-panel-icon-wrapper icon-gongGao">
          <svg-icon icon-class="gong-gao" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            告警
          </div>
          <count-to :start-val="0" :end-val="panelData.warnings" :duration="5000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  name: 'PanelGroup',
  components: {
    CountTo
  },
  data() {
    return {
      panelData: {
        visits: 0,
        messages: 0,
        articles: 0,
        warnings: 0
      }
    }
  },
  activated() {
    this.getPanelData()
  },
  methods: {
    getPanelData() {
      this.$mapi.home.getHomePanelDataCount().then(res => {
        const { visits, messages, articles, warnings } = res.data
        this.panelData.visits = visits || 0
        this.panelData.messages = messages || 0
        this.panelData.articles = articles || 0
        this.panelData.warnings = warnings || 0
      }).catch(() => {
        this.panelData.visits = 0
        this.panelData.messages = 0
        this.panelData.articles = 0
        this.panelData.warnings = 0
      })
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-visits {
        background: #40c9c6;
      }

      .icon-message {
        background: #34bfa3;
      }

      .icon-articles {
        background: #34bfa3;
      }

      .icon-gongGao {
        background: #f4516c
      }
    }

    .icon-visits {
      color: #40c9c6;
    }

    .icon-message {
      color: #34bfa3;
    }

    .icon-articles {
      color: #34bfa3;
    }

    .icon-gongGao {
      color: #f4516c
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px 26px 26px 0;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
