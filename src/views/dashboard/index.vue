<template>
  <div class="dashboard-editor-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" :gutter="10">
      <span>入睡时间分布图：</span>
      <el-button type="primary" size="mini" @click="getSleepPieData">刷新</el-button>
      <el-select v-model="sleepPieType" size="mini" placeholder="请选择">
        <el-option
          v-for="item in sleepPieTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          @change="getSleepPieData"
        />
      </el-select>
      <el-col :span="6">
        <el-table
          :data="sleepPieData"
          border
          style="width: 60%;margin: 10px"
        >
          <el-table-column
            prop="name"
            label="时间段"
            width="180"
          />
          <el-table-column
            prop="value"
            sortable
            label="Times"
          />
        </el-table>
      </el-col>
      <el-col :span="18">
        <sleep-pie :chart-data="sleepPieData" width="100%" />
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span>睡眠时长统计图：</span>
      <el-button type="primary" size="mini" @click="getSleepData">刷新</el-button>
      <sleep-chart :chart-data="sleepChartData" />
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span>吃饭开销统计图：</span>
      <el-button type="primary" size="mini" @click="getMealStatisticsData">刷新</el-button>
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span>饮食开销按月汇总：</span>
      <el-button type="primary" size="mini" @click="getMealStatisticsMonthData">刷新</el-button>
      <el-table
        :data="mealMonthTableData"
        border
        show-summary
        style="width: 60%;margin: 10px"
      >
        <el-table-column
          prop="month"
          label="月度"
          width="180"
        />
        <el-table-column
          prop="total"
          sortable
          label="合计"
        />
        <el-table-column
          prop="breakfast"
          label="早饭"
        />
        <el-table-column
          prop="lunch"
          label="午饭"
        />
        <el-table-column
          prop="dinner"
          label="晚饭"
        />
        <el-table-column
          prop="supper"
          label="夜宵"
        />
        <el-table-column
          prop="snacks"
          label="零食"
        />
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from '../charts/LineChart'
import SleepChart from '../charts/sleepChart'
import { statistics, statisticsMonth } from '@/api/day/meal'
import { sleepStatistics, sleepStatisticsPie } from '@/api/day/sleep'
import SleepPie from '../charts/sleepPie'

export default {
  name: 'Dashboard',
  components: {
    LineChart, SleepChart, SleepPie
  },
  data() {
    return {
      lineChartData: {},
      mealMonthTableData: [],
      sleepChartData: [],
      sleepPieData: [],
      sleepPieTypes: [
        { name: '全部', value: 'ALL' },
        { name: '当前年度', value: 'YEAR' },
        { name: '当前月度', value: 'MONTH' },
        { name: '最近30天', value: 'LAST_30_DAY' }
      ],
      sleepPieType: 'LAST_30_DAY'
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
    this.getSleepPieData()
    this.getMealStatisticsMonthData()
  },
  methods: {
    getMealStatisticsData() {
      statistics().then(res => {
        this.lineChartData = res.data
      })
    },
    getMealStatisticsMonthData() {
      statisticsMonth().then(res => {
        this.mealMonthTableData = res.data
        this.mealMonthTableData.forEach(item => {
          item.breakfast = item.breakfast / 100
          item.lunch = item.lunch / 100
          item.dinner = item.dinner / 100
          item.supper = item.supper / 100
          item.snacks = item.snacks / 100
          item.total = (item.breakfast + item.lunch + item.dinner + item.supper + item.snacks).toFixed(2)
        })
      })
    },
    getSleepData() {
      sleepStatistics().then(res => {
        this.sleepChartData = res.data
      })
    },
    getSleepPieData() {
      sleepStatisticsPie({ 'type': this.sleepPieType }).then(res => {
        this.sleepPieData = res.data
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
