<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-select v-model="pageQuery.type" class="filter-item" placeholder="请选择类别" filterable clearable>
        <el-option v-for="item in typeArr" :key="item" :value="item" :label="item" />
      </el-select>
      <el-input v-model="pageQuery.name" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-select v-model="pageQuery.enable" class="filter-item" placeholder="启用/禁用" clearable>
        <el-option key="1" :value="1" label="启用" />
        <el-option key="0" :value="0" label="禁用" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" @click="excelExport">导出</el-button>
    </div>

    <div class="progress-data">
      <el-progress type="circle" percentage="0"></el-progress>
      <el-progress type="circle" percentage="10"></el-progress>
      <el-progress type="circle" stroke-width="12" percentage="30"></el-progress>
      <el-progress type="circle" status="warning" percentage="50"></el-progress>
      <el-progress type="circle" color="pink" percentage="75"></el-progress>
      <el-progress type="circle" width="200" percentage="99"></el-progress>
      <el-progress type="circle" stroke-linecap="round" percentage="100"></el-progress>
      <el-progress type="circle" stroke-linecap="butt" percentage="100"></el-progress>
      <el-progress type="circle" stroke-linecap="square" percentage="100"></el-progress>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      style="margin-top: 20px"
      element-loading-text="Loading"
      fit
      highlight-current-row
      hidden
    >
      <el-table-column align="center" label="序号" min-width="5%">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="密码" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.password }}
          <a :href="scope.row.url" class="el-icon-share" target="_blank" style="color: #409EFF">link</a>
        </template>
      </el-table-column>
      <el-table-column label="重要性" min-width="5%">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.importance" disabled />
        </template>
      </el-table-column>
      <el-table-column label="是否启用" min-width="5%" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeEnable(row)"
          />
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
      hidden
    />
    <Info ref="InfoDialog" @close="fetchData" />
  </div>
</template>

<script>
import Info from './info'
import { Message } from 'element-ui'
import { getPage, del, update, getTypeList, excelExport } from '@/api/day/progress'

export default {
  components: { Info },
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
      this.$refs['InfoDialog'].initInfoDialog(true, row.id, 0)
    },
    handleAdd() {
      this.$refs['InfoDialog'].initInfoDialog(true, 0, 1)
    },
    handleEdit(row) {
      this.$refs['InfoDialog'].initInfoDialog(true, row.id, 2)
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
