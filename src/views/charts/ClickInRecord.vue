<template>
  <div :class="className" :style="{height:height,width:width}"/>
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
      // this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(obj) {
      if (!obj.dateList) {
        return
      }
      console.log('click-in-record-tag', obj)
      const dateList = obj.dateList
      const clockIn = obj.clockIn
      const clockOut = obj.clockOut
      const hours = obj.hours
      this.chart.setOption({
        title: {
          text: '考勤统计',
          subtext: '最近一个月',
          show: true
        },
        xAxis: {
          // name: '日期',
          // nameLocation: 'start',
          data: dateList,
          boundaryGap: true,
          // type: 'time',
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 30,
          containLabel: true,
          show: true,
          backgroundColor: '#DDA0DD',
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
        tooltip: {},
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'cross'
        //   },
        //   padding: [5, 10]
        // },
        yAxis: [
          {
            type: 'value',
            name: '时间',
            min: 0,
            max: 1000,
            position: 'left',
            axisLabel: {
              formatter: function(value, index) {
                // 假设value是分钟偏移量的字符串
                const offsetMinutes = parseInt(value)
                const currentDate = new Date()
                currentDate.setHours(7, 0)
                currentDate.setMinutes(currentDate.getMinutes() + offsetMinutes)
                return currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            },
            axisTick: {
              show: false
            }
          },
          {
            type: 'value',
            name: '时长',
            min: 0,
            // max: 24,
            position: 'right',
            axisLabel: {
              formatter: '{value} 小时'
            },
            axisTick: {
              show: false
            }
          }
        ],
        legend: {
          data: ['上班时间', '下班时间', '时长']
        },
        series: [{
          name: '上班时间',
          smooth: false,
          type: 'line',
          data: clockIn,
          yAxisIndex: 0,
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
          },
          // 不知道为什么，这里的tooltip不起作用，只能在tooltip里面设置
          // 还是需要统一配置下
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10],
            formatter: (params) => {
              console.log('params', params)
              const value = params.value
              const offsetMinutes = parseInt(value)
              const currentDate = new Date()
              currentDate.setHours(7, 0)
              currentDate.setMinutes(currentDate.getMinutes() + offsetMinutes)
              return '' + currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ''
            },
            valueFormatter: (value) => {
              // 假设value是分钟偏移量的字符串
              const offsetMinutes = parseInt(value)
              const currentDate = new Date()
              currentDate.setHours(7, 0)
              currentDate.setMinutes(currentDate.getMinutes() + offsetMinutes)
              return currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          }
        },
        {
          name: '下班时间',
          smooth: false,
          type: 'line',
          data: clockOut,
          yAxisIndex: 0,
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
          name: '时长',
          smooth: true,
          type: 'bar',
          data: hours,
          yAxisIndex: 1,
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
              color: '#3f51b5',
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
