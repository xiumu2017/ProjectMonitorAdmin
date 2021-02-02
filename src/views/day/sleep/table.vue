<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-select v-model="pageQuery.enable" class="filter-item" placeholder="是否熬夜" clearable>
        <el-option key="1" value="1" label="是" />
        <el-option key="0" value="0" label="否" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="pageQuery = {pageNum: 1,pageSize: 10}">重置</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      style="margin-top: 20px"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      element-loading-text="Loading"
      fit
    >
      <el-table-column align="center" label="序号" width="50px" fixed>
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="日期" width="150px" fixed>
        <template slot-scope="scope">
          {{ scope.row.dateStr }}
        </template>
      </el-table-column>
      <el-table-column label="上床时间" width="150px">
        <template slot-scope="scope">
          {{ scope.row.bedTimeStr }}
        </template>
      </el-table-column>
      <el-table-column label="入睡时间" width="150px">
        <template slot-scope="scope">
          {{ scope.row.sleepTimeStr }}
        </template>
      </el-table-column>
      <el-table-column label="醒来时间" width="150px">
        <template slot-scope="scope">
          {{ scope.row.wakeTimeStr }}
        </template>
      </el-table-column>
      <el-table-column label="起床时间" width="150px">
        <template slot-scope="scope">
          {{ scope.row.upTimeStr }}
        </template>
      </el-table-column>
      <el-table-column label="睡眠时长(h)" width="150px">
        <template slot-scope="scope">
          {{ scope.row.durationStr }}
        </template>
      </el-table-column>
      <el-table-column label="睡眠质量" width="200px">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.sleepQuality" disabled />
        </template>
      </el-table-column>
      <el-table-column label="睡前回忆" width="300px">
        <template slot-scope="scope">
          {{ scope.row.memory }}
        </template>
      </el-table-column>
      <el-table-column label="" min-width="5%" />
      <el-table-column label="熬夜原因" width="200px">
        <template slot-scope="scope">
          {{ scope.row.lateReason }}
        </template>
      </el-table-column>
      <el-table-column label="" min-width="5%" />
      <el-table-column label="操作" width="250px" fixed="right">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" @click="handleDetail(row)">详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageQuery.pageSize"
      :current-page.sync="pageQuery.pageNum"
      @current-change="fetchData"
    />
    <SleepRecordInfo ref="SleepRecordInfoDialog" @close="fetchData" />
  </div>
</template>

<script>
import SleepRecordInfo from './info'
import { Message } from 'element-ui'
import { getPage, del, update, excelExport } from '@/api/day/sleep'

export default {
  components: { SleepRecordInfo },
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
      list: null,
      listLoading: false,
      pageQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: null,
      currentId: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    rowStyle({ row, rowIndex }) {
      if (row.date) {
        const d = new Date(row.date)
        if (d.getDay() === 6 || d.getDay() === 0) {
          return {
            'background-color': '#FFF8DC'
          }
        }
        return ''
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        const time = new Date(row.sleepTime)
        if (time.getHours() >= 0 && time.getHours() < 10) {
          return {
            'color': 'red',
            'font-weight': 'bold'
          }
        } else if (time.getHours() >= 21 && time.getHours() <= 22) {
          return {
            'color': '#228B22',
            'font-weight': 'bold'
          }
        } else {
          return {
            'font-weight': 'bold'
          }
        }
      }
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
      this.listLoading = true
      console.info('tag', this.pageQuery)
      getPage(this.pageQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        this.list.forEach(item => {
          item.dateStr = this.formatDate(item.date)
          item.bedTimeStr = this.formateTime(item.bedTime)
          item.sleepTimeStr = this.formateTime(item.sleepTime)
          item.wakeTimeStr = this.formateTime(item.wakeTime)
          item.upTimeStr = this.formateTime(item.upTime)
          item.durationStr = (item.duration / (3600)).toFixed(3)
        })
      })
    },
    formateTime(time) {
      return time.split(' ')[1]
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
    handleAdd() {
      console.info('tag', 'handleAdd')
      this.$refs['SleepRecordInfoDialog'].initServerDialog(true, 0, 1)
    },
    handleEdit(row) {
      console.info('handleEdit', row)
      this.$refs['SleepRecordInfoDialog'].initServerDialog(true, row.id, 2)
    },
    handleDetail(row) {
      console.info('handleDetail', row)
      this.$refs['SleepRecordInfoDialog'].initServerDialog(true, row.id, 0)
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
    },
    deleteProject(row, c, e) {
      event.preventDefault()
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openLoading()
        del({ 'id': row.id }).then(res => {
          this.closeLoading()
          if (res.code === 200) {
            this.fetchData()
            Message({
              message: res.msg,
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
    },
    excelExport() {
      this.openLoading()
      excelExport(this.pageQuery).then(res => {
        this.closeLoading()
      })
    }
  }
}
</script>
