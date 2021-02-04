<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(obj) {
      const dateList = obj[0]
      const duration = obj[1]
      const dataList = []
      // 处理 duration 数据
      duration.forEach(item => {
        let obj = {}
        if (parseInt(item) > 9) {
          obj = {
            value: item,
            itemStyle: {
              color: '#228B22'
            }
          }
        } else if (item > 7.5) {
          obj = {
            value: item,
            itemStyle: {
              color: '#90EE90'
            }
          }
        } else if (item > 6) {
          obj = {
            value: item,
            itemStyle: {
              color: '#F0E68C'
            }
          }
        } else {
          obj = {
            value: item,
            itemStyle: {
              color: '#FF4500'
            }
          }
        }
        console.log('obj', obj)
        dataList.push(obj)
      })
      console.log('dura-data', dataList)
      this.chart.setOption({
        title: {
          text: '睡眠时长统计',
          subtext: '最近十五天',
          show: false
        },
        xAxis: {
          data: dateList,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['时长']
        },
        series: [{
          name: '睡眠时长',
          smooth: true,
          type: 'bar',
          data: dataList,
          barWidth: '30%',
          animationDuration: 3000,
          animationEasing: 'cubicInOut'
        }
        ]
      })
    }
  }
}
</script>
