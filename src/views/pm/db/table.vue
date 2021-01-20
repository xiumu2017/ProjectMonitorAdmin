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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="pageQuery = {pageNum: 1,pageSize: 10}">重置</el-button>
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
      <el-table-column align="center" label="序号" min-width="3%">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="数据库类型" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="数据库版本" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.version }}
        </template>
      </el-table-column>
      <el-table-column label="内网IP" min-width="7%">
        <template slot-scope="scope">
          {{ scope.row.ipAddr }}
        </template>
      </el-table-column>
      <el-table-column label="公网IP" min-width="8%">
        <template slot-scope="scope">
          {{ scope.row.ipAddrPublic }}
        </template>
      </el-table-column>
      <el-table-column label="域名" min-width="8%">
        <template slot-scope="scope">
          {{ scope.row.domainAddr }}
        </template>
      </el-table-column>
      <el-table-column label="端口" min-width="3%">
        <template slot-scope="scope">
          {{ scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="4%">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="密码" min-width="4%">
        <template slot-scope="scope">
          <span :id="'span' + scope.row.id" @click="showPassword(scope.row)"> ****** </span>
        </template>
      </el-table-column>
      <el-table-column label="JDBC_URL" min-width="10%">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title=""
            width="300"
            trigger="click"
            :content="scope.row.url"
          >
            <el-button slot="reference" type="primary" size="small">查看</el-button>
          </el-popover>
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
      <el-table-column label="外网连接" min-width="5%" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isPublic"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeEnable(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="关联服务器" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.serverId }}
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
      @current-change="fetchData"
    />
    <DbInfo ref="DbInfoDialog" @close="fetchData" />
  </div>
</template>

<script>
import DbInfo from './info'
import { Message } from 'element-ui'
import { getPage, del, update, getTypeList, excelExport } from '@/api/pm/db'

export default {
  components: { DbInfo },
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
    getTypeList().then(res => {
      this.typeArr = res.data
    })
    this.fetchData()
  },
  methods: {
    showPassword(row) {
      // this.$ref['span' + row.id].innerHtml = row.password
      const text = document.getElementById('span' + row.id).innerText
      const stars = '******'
      if (text === stars) {
        document.getElementById('span' + row.id).innerHTML = row.password
      } else {
        document.getElementById('span' + row.id).innerHTML = stars
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
      console.info('handleDetail', row)
      this.$refs['DbInfoDialog'].initDbInfoDialog(true, row.id, 0)
    },
    handleAdd() {
      console.info('tag', 'handleAdd')
      this.$refs['DbInfoDialog'].initDbInfoDialog(true, 0, 1)
    },
    handleEdit(row) {
      console.info('handleEdit', row)
      this.$refs['DbInfoDialog'].initDbInfoDialog(true, row.id, 2)
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
