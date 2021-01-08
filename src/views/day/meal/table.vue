<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-select v-model="pageQuery.type" class="filter-item" placeholder="请选择类别" filterable clearable>
        <el-option v-for="item in typeArr" :key="item" :value="item" :label="item" />
      </el-select>
      <el-input v-model="pageQuery.name" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-select v-model="pageQuery.enable" class="filter-item" placeholder="启用/禁用" clearable>
        <el-option key="1" value="1" label="启用" />
        <el-option key="0" value="0" label="禁用" />
      </el-select>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="pageQuery = {pageNum: 1,pageSize: 10}">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" @click="excelExport">导出</el-button>
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
      <el-table-column label="日期" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="吃什么" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.what }}
        </template>
      </el-table-column>
      <el-table-column label="在哪儿吃" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.place }}
        </template>
      </el-table-column>
      <el-table-column label="花了多少" min-width="5%">
        <template slot-scope="scope">
          {{ '￥' + scope.row.cost }}
        </template>
      </el-table-column>
      <el-table-column label="支付方式" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.payType }}
        </template>
      </el-table-column>
      <el-table-column label="备注信息" min-width="15%">
        <template slot-scope="scope">
          {{ scope.row.remark }}
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
      :current-page="pageQuery.pageNum"
    />
    <MealInfo ref="infoDialog" @close="fetchData" />
  </div>
</template>

<script>
import MealInfo from './info'
import { Message } from 'element-ui'
import { getPage, del, update, types, payTypes, excelExport } from '@/api/day/meal'
import { formatDate } from '@/utils/dateUtils'

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
      typeArr: [],
      payTypeArr: [],
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
    // 初始化查询
    types().then(res => {
      this.typeArr = res.data
    })
    payTypes().then(res => {
      this.payTypeArr = res.data
    })
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
        this.list.forEach(item => {
          item.type = this.typeArr[item.type]
          item.payType = this.payTypeArr[item.payType]
          item.cost = item.cost / 100
          item.date = formatDate(item.date)
        })
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
