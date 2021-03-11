<template>
  <div class="dashboard-editor-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span>吃饭开销统计图：</span>
      <el-button type="primary" size="mini" @click="getMealStatisticsData">刷新</el-button>
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span>睡眠时长统计图：</span>
      <el-button type="primary" size="mini" @click="getSleepData">刷新</el-button>
      <sleep-chart :chart-data="sleepChartData" />
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span>入睡时间分布图：</span>
      <el-button type="primary" size="mini" @click="getSleepData">刷新</el-button>
      <sleep-pie :chart-data="sleepPieData" width="50%" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from '../charts/LineChart'
import SleepChart from '../charts/sleepChart'
import { statistics } from '@/api/day/meal'
import { sleepStatistics } from '@/api/day/sleep'
import SleepPie from '../charts/sleepPie'

export default {
  name: 'Dashboard',
  components: {
    LineChart, SleepChart, SleepPie
  },
  data() {
    return {
      lineChartData: {},
      sleepChartData: [],
      sleepPieData: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // 初始化查询
    this.getMealStatisticsData()
    this.getSleepData()
  },
  methods: {
    getMealStatisticsData() {
      statistics().then(res => {
        this.lineChartData = res.data
      })
    },
    getSleepData() {
      sleepStatistics().then(res => {
        this.sleepChartData = res.data
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
