<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-select v-model="pageQuery.direction" class="filter-item" placeholder="请选择类别" filterable clearable>
        <el-option :key="1" value="支出" label="支出" />
        <el-option :key="2" value="收入" label="收入" />
      </el-select>
      <el-input v-model="pageQuery.productName" placeholder="请输入名称" style="width: 200px;" class="filter-item" />

      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" @click="excelExport">导出</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      style="margin-top: 20px"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50px">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="时间" width="150px">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="收/支" width="100px">
        <template slot-scope="scope">
          {{ scope.row.direction }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="500px">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="" min-width="5%" /> -->
      <el-table-column label="交易对方" width="300px">
        <template slot-scope="scope">
          {{ scope.row.txTarget }}
        </template>
      </el-table-column>
      <el-table-column label="金额" width="100px">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="备注" width="100px">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="交易来源" width="250px">
        <template slot-scope="scope">
          {{ scope.row.source }}
        </template>
      </el-table-column>
      <el-table-column label="交易号" width="200px">
        <template slot-scope="scope">
          {{ scope.row.orderSn }}
        </template>
      </el-table-column>
      <el-table-column label="商家订单号" width="300">
        <template slot-scope="scope">
          {{ scope.row.outTradeNo }}
        </template>
      </el-table-column>
      <el-table-column label="交易状态" width="80px">
        <template slot-scope="scope">
          {{ scope.row.status }}
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
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getPage, del, excelExport } from '@/api/finance/alipay'

export default {
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
    reset() {
      this.pageQuery = {
        pageNum: 1,
        pageSize: 10
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
      })
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
