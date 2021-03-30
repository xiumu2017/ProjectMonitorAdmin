<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container" style="margin-left: 10px;">
      <el-button class="filter-item" style="margin-left: 10px;" type="info" size="mini" icon="el-icon-left" @click="changeDate(-1)">前一天</el-button>
      <el-date-picker v-model="date" style="margin-left: 10px;" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
      <el-button class="filter-item" style="margin-left: 10px;" type="info" size="mini" icon="el-icon-right" @click="changeDate(1)">后一天</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
    </div>

    <div class="block" style="margin-top:75px;margin-left:50px">
      <el-timeline>
        <el-timeline-item
          v-for="(activity) in list"
          :key="activity.id"
          icon="el-icon-apple"
          :type="activity.type"
          color="#0bbd87"
          size="large"
          placement="top"
          :timestamp="activity.startTime"
          class="infinite-list"
          style="overflow:auto"
        >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ activity.things }}</span>
              <el-button-group style="float: right; padding: 3px 0">
                <el-button type="info" size="mini" icon="el-icon-info" circle @click="handleDetail(activity)" />
                <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEdit(activity)" />
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDel(activity)" />
              </el-button-group>
            </div>
            <div class="text item">
              <span class="text item">开始时间： {{ activity.startTime }} </span><br><br>
              <span class="text item">结束时间： {{ activity.endTime }} </span><br><br>
              <span class="text item">备注： {{ activity.remark }} </span><br><br>
              <span class="text item">位置： {{ activity.location }} </span><br><br><br>
              <el-tag v-for="(label,index) in activity.labels" :key="index" style="margin-right: 10px">{{ label }}</el-tag>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-search" @click="fetchData">加载更多</el-button>
    </div>
    <TimelineInfo ref="infoDialog" @close="fetchData" />
  </div>
</template>

<script>
import TimelineInfo from './info'
import { Message } from 'element-ui'
import { getPage, del, update } from '@/api/day/timeline'
import { formatDateYmd, leftDay, rightDay } from '@/utils/dateUtils'

export default {
  components: { TimelineInfo },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      typeArr: [],
      list: [],
      listLoading: false,
      date: formatDateYmd(new Date()),
      total: 0,
      loading: null,
      currentId: 0,
      pageNum: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.date = formatDateYmd(new Date())
      this.fetchData()
    },
    changeDate(val) {
      if (this.date) {
        if (val && val > 0) {
          this.date = rightDay(this.date)
        } else {
          this.date = leftDay(this.date)
        }
        console.log('this.date', this.date)
      } else {
        this.date = new Date()
      }
      this.fetchData()
    },
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    closeLoading() {
      this.loading.close()
    },
    fetchData() {
      if (this.total === this.list.length) {
        Message({
          message: '没有更多了',
          type: 'warning',
          duration: 3 * 1000
        })
      }
      this.listLoading = true
      // { 'date': this.date }
      getPage({ 'pageNum': this.pageNum, 'pageSize': 10 }).then(response => {
        const listData = response.data.list
        this.total = response.data.total
        this.listLoading = false
        listData.forEach(element => {
          const labels = element.label.split(/[,，]/g)
          element.labels = labels
        })
        this.list = this.list.concat(listData)
      })
      this.pageNum++
    },
    changeEnable(row) {
      const param = { 'id': row.id, 'enable': row.enable }
      update(row.id, param).then(res => {
        if (res.code === 200) {
          this.fetchData()
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    handleDetail(row) {
      console.info('handleDetail', row)
      this.$refs['infoDialog'].initInfoDialog(true, row.id, 0)
    },
    handleAdd() {
      console.info('tag', 'handleAdd')
      this.$refs['infoDialog'].initInfoDialog(true, 0, 1)
    },
    handleEdit(row) {
      console.info('handleEdit', row)
      this.$refs['infoDialog'].initInfoDialog(true, row.id, 2)
    },
    handleDel(row) {
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading()
        del(row.id).then(res => {
          this.closeLoading()
          if (res.code === 200) {
            this.fetchData()
            Message({
              message: res.message,
              type: 'success',
              duration: 3 * 1000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style>
  .text {
    font-size: 15px;
  }

  .box-card {
    width: 500px;
  }
</style>
