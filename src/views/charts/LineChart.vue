<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'

export default {
  // mixins: [resize],
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
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(obj) {
      console.log('line-data-tag', obj)
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
          name: '日期',
          nameLocation: 'start',
          data: dateList,
          boundaryGap: true,
          // type: 'time',
          axisTick: {
            show: true
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 30,
          containLabel: true,
          show: true,
          backgroundColor: '#DA70D6',
          borderColor: '#FFD700',
          borderWidth: 3
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
          type: 'bar',
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
          type: 'bar',
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
          type: 'bar',
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
