<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    width="75%"
    top="8vh"
    @close="handleClose()"
  >
    <div class="app-container">

      <!-- 查询区域 -->
      <div class="filter-container">
        <el-select v-model="pageQuery.type" class="filter-item" placeholder="请选择类别" filterable clearable>
          <el-option v-for="item in typeArr" :key="item" :value="item" :label="item" />
        </el-select>
        <el-input v-model="pageQuery.name" placeholder="请输入名称" style="width: 200px;" class="filter-item" />
        <el-select v-model="pageQuery.enable" class="filter-item" placeholder="启用/禁用" clearable>
          <el-option key="1" :value="1" label="启用" />
          <el-option key="0" :value="0" label="禁用" />
        </el-select>
        <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="fetchData">查询</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="pageQuery = {pageNum: 1,pageSize: 10}">重置</el-button>
      </div>

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
        <el-table-column label="机器人名称" min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="机器人类型" min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column label="Token" min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.token }}
          </template>
        </el-table-column>
        <el-table-column label="Secret" min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.secret }}
          </template>
        </el-table-column>
        <el-table-column label="WebHook" min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.webHook }}
            <a :href="scope.row.webHook" class="el-icon-share" target="_blank" style="color: #409EFF">link</a>
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
        <el-table-column label="备注" min-width="15%">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.createAt }}
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
      <Info ref="InfoDialog" @close="fetchData" />
    </div>
  </el-dialog>
</template>

<script>
import Info from './robotInfo'
import { Message } from 'element-ui'
import { getPage, del, update, getTypeList } from '@/api/pm/dingTalkRobot'

export default {
  name: 'RobotTable',
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
      title: '机器人🤖',
      dialogVisible: false,
      typeArr: [],
      list: null,
      listLoading: false,
      pageQuery: {
        pageNum: 1,
        pageSize: 10,
        groupId: 0
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
  },
  methods: {
    initTableDialog(visible, infoId) {
      console.log('infoId', infoId)
      this.dialogVisible = true
      this.pageQuery.groupId = infoId
      // 查询详情数据
      if (infoId !== 0) {
        this.fetchData()
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
      this.$refs['InfoDialog'].initInfoDialog(true, row.id, 0)
    },
    handleAdd() {
      console.info('tag', 'handleAdd')
      this.$refs['InfoDialog'].initInfoDialog(true, 0, 1, this.pageQuery.groupId)
    },
    handleEdit(row) {
      console.info('handleEdit', row)
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
    },
    handleClose() {
    }
  }
}
</script>
