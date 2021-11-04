<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-date-picker v-model="pageQuery.date" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="pageQuery = {pageNum: 1,pageSize: 10}">重置</el-button>
    </div>

    <!-- table
      @row-dblclick="handleEdit"
      @row-contextmenu="deleteProject" -->

    <el-table
      v-loading="listLoading"
      :data="list"
      style="margin-top: 20px"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" min-width="5%">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="20%">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="作者" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.author }}
        </template>
      </el-table-column>
      <el-table-column label="朝代" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.dynasty }}
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="50%">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="10%">
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
    <MealInfo ref="infoDialog" @close="fetchData" />
  </div>
</template>

<script>
import MealInfo from './info'
import { Message } from 'element-ui'
import { getPage, del, update } from '@/api/day/poem'
// import { formatDate } from '@/utils/dateUtils'

export default {
  components: { MealInfo },
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
      })
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
      this.$refs['infoDialog'].initDialog(true, 0, 1)
    },
    handleEdit(row) {
      console.info('handleEdit', row)
      this.$refs['infoDialog'].initDialog(true, row.id, 2)
    },
    handleDetail(row) {
      console.info('handleDetail', row)
      this.$refs['infoDialog'].initDialog(true, row.id, 0)
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
