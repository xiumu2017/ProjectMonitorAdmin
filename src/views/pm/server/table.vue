<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-select v-model="pageQuery.type" class="filter-item" placeholder="请选择类别" filterable clearable>
        <el-option v-for="item in serverTypeArr" :key="item.id" :value="item.id" :label="item.typeName" />
      </el-select>
      <el-select v-model="pageQuery.enable" class="filter-item" placeholder="启用/禁用" clearable>
        <el-option key="1" :value="1" label="启用" />
        <el-option key="0" :value="0" label="禁用" />
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
      stripe
      @row-dblclick="copyInfo"
    >
      <el-table-column align="center" label="序号" min-width="3%">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.serverType }}
        </template>
      </el-table-column>
      <el-table-column label="内网IP" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.ipAddr }}
        </template>
      </el-table-column>
      <el-table-column label="公网IP" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.ipAddrPublic }}
        </template>
      </el-table-column>
      <el-table-column label="域名" min-width="5%">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title=""
            width="200"
            trigger="click"
            :content="scope.row.domainAddr"
          >
            <el-button slot="reference" type="primary" size="small">查看</el-button>
          </el-popover></template>
      </el-table-column>
      <el-table-column label="端口" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.userName }}
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
      <el-table-column label="连接状态" min-width="5%" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.serverStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="配置信息" min-width="5%">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title=""
            width="200"
            trigger="click"
            :content="scope.row.configuration"
          >
            <el-button slot="reference" type="primary" size="small">查看</el-button>
          </el-popover></template>
      </el-table-column>
      <el-table-column label="标签" min-width="10%">
        <template slot-scope="scope">
          <el-tag v-for=" (item,index) in (scope.row.tags.split(/[,，]/g))" :key="index" style="margin-right: 5px"> {{ item }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" min-width="15%">
        <template slot-scope="scope">
          <p style="font-size: 12px"> {{ scope.row.remark }}
          </p></template>
      </el-table-column>
      <el-table-column label="操作" min-width="15%" align="center">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" @click="handleDetail(row)">详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="serverTest(row)">连接</el-button>
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
    <ServerInfo ref="serverInfoDialog" @close="fetchData" />
    <el-dialog
      title="服务器连接信息"
      :visible.sync="serverInfoDialogVisible"
      width="30%"
    >
      <span>{{ serverInfo }}</span>
    </el-dialog>
    <router-view />
  </div>
</template>

<script>
import ServerInfo from './info'
import { Message } from 'element-ui'
import { getPage, del, update, getServerTypeList, connect, excelExport } from '@/api/pm/server'

export default {
  components: { ServerInfo },
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
      serverInfoDialogVisible: false,
      serverInfo: '',
      serverTypeArr: [],
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
    getServerTypeList().then(res => {
      this.serverTypeArr = res.data
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
        this.list.forEach(element => {
          this.serverTypeArr.forEach(item => {
            if (element.serverType === item.id) {
              element.serverType = item.typeName
            }
          })
        })
      })
    },
    changeEnable(row) {
      const param = { 'id': row.id, 'enable': row.enable }
      update(row.id, param).then(res => {
        if (res.code === 200) {
          this.fetchData()
          Message({
            message: res.message,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    changeStatus(row) {
      const param = { 'id': row.id, 'serverStatus': row.enable }
      update(row.id, param).then(res => {
        if (res.code === 200) {
          this.fetchData()
          Message({
            message: res.message,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    serverTest(row) {
      this.openLoading()
      connect(row.id).then(res => {
        this.closeLoading()
        if (res.code === 200) {
          this.$message({
            message: '<h4>' + res.message + '</h4>' + '服务器当前时间：<br>' + res.data,
            type: 'success',
            dangerouslyUseHTMLString: true,
            showClose: true,
            duration: 0
          })
        }
      }, error => {
        this.closeLoading()
        console.error(error)
      })
    },
    handleAdd() {
      console.info('tag', 'handleAdd')
      this.$refs['serverInfoDialog'].initServerDialog(true, 0, 1)
    },
    handleEdit(row) {
      console.info('handleEdit', row)
      this.$refs['serverInfoDialog'].initServerDialog(true, row.id, 2)
    },
    handleDetail(row) {
      console.info('handleDetail', row)
      this.$refs['serverInfoDialog'].initServerDialog(true, row.id, 0)
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
    },
    copyInfo(row, column, event) {
      // const info = {
      //   host: row.ipAddrPublic,
      //   port: row.port,
      //   username: row.userName,
      //   password: row.password
      // }
      const text = `host: ${row.ipAddrPublic}
port: ${row.port}
username: ${row.userName}
password: ${row.password}`
      // 同步文本
      this.serverInfo = text
      this.serverInfoDialogVisible = true
    }
  }
}
</script>
