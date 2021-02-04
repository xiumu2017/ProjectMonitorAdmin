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
      type: Object,
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
      console.log('tag', obj)
      const dateList = obj.dateList
      const breakfast = obj.breakfast
      const lunch = obj.lunch
      const dinner = obj.dinner
      const total = obj.total
      this.chart.setOption({
        title: {
          text: '吃饭花销统计',
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
          data: ['早饭', '午饭', '晚饭', '合计']
        },
        series: [{
          name: '早饭',
          smooth: true,
          type: 'line',
          data: breakfast,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          }
        },
        {
          name: '午饭',
          smooth: true,
          type: 'line',
          data: lunch,
          animationDuration: 2800,
          animationEasing: 'quadraticOut',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          }
        },
        {
          name: '晚饭',
          smooth: true,
          type: 'line',
          data: dinner,
          animationDuration: 2800,
          animationEasing: 'quadraticOut',
          itemStyle: {
            normal: {
              color: '#00FFFF',
              lineStyle: {
                color: '#00FFFF',
                width: 2
              }
            }
          }
        },
        {
          name: '合计',
          smooth: true,
          type: 'line',
          data: total,
          markPoint: {
            data: [
              { type: 'max', name: '最大值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          },
          animationDuration: 2800,
          animationEasing: 'linear',
          itemStyle: {
            normal: {
              color: '#000000',
              lineStyle: {
                color: '#000000',
                width: 3
              }
            }
          }
        }
        ]
      })
    }
  }
}
</script>
