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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from '../charts/LineChart'
import SleepChart from '../charts/sleepChart'
import { statistics } from '@/api/day/meal'
import { sleepStatistics } from '@/api/day/sleep'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
    testData: [20, 8, 9, 15, 62, 10, 15],
    totalData: [70, 66, 5, 99, 162, 133, 200]
  },
  mealData: {
    breakfast: [3, 6.4, 7, 9, 5.5, 4.5, 7],
    lunch: [15.5, 19.5, 13.5, 25.5, 20.5, 13.5, 0],
    dinner: [10, 11, 15, 20, 0, 6, 20],
    total: [25, 44, 34, 30, 25, 50, 55, 20]
  },
  sleepData: [
    ['02-01', '02-02', '02-03', '02-04'],
    [7.1, 8.9, 6.33, 9.5]
  ],
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Dashboard',
  components: {
    LineChart, SleepChart
  },
  data() {
    return {
      lineChartData: lineChartData.mealData,
      sleepChartData: lineChartData.sleepData
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
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getMealStatisticsData() {
      statistics().then(res => {
        console.log('meal-stat', res.data)
        this.lineChartData = res.data
      })
    },
    getSleepData() {
      sleepStatistics().then(res => {
        console.log('tag', res)
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
