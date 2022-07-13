<template>
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
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="pageQuery = {pageNum: 1,pageSize: 10}">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" @click="excelExport">导出</el-button>
    </div>

    <el-row :gutter="100" style="margin-top: 20px">
      <el-col v-for="item in list" :key="item.id" :span="4.8" :offset="0">
        <el-card class="box-card-bookmark">
          <div slot="header" class="clearfix">
            <span>{{ item.name }}</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div class="text item" style="color: red">
            用户名：{{ item.username }}
          </div>
          <div class="text item">
            密码：{{ item.password }}
          </div>
          <div class="text item">
            助记词： {{ item.mnemonics }}
          </div>
          <div class="text item">
            手机号：{{ item.telephone }}
          </div>
          <div class="text item">
            邮箱：{{ item.email }}
          </div>
          <div style="margin-top: 20px">
            <a :href="item.address" class="el-icon-share" target="_blank" style="color: #409EFF">{{ item.address }}</a>
          </div>
          <div style="margin-top: 20px">
            <el-rate v-model="item.importance" disabled />
          </div>
          <div style="margin-top: 20px">
            <el-button type="info" size="mini" @click="handleDetail(item)">详情</el-button>
            <el-button type="primary" size="mini" @click="handleEdit(item)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(item)">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- <el-table
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
      <el-table-column label="名称" min-width="6%">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号码" min-width="6%">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="9%">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="密码" min-width="12%">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title=""
            width="300"
            trigger="click"
            :content="scope.row.password"
          >
            <el-button slot="reference" type="primary" size="mini">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="助记词" min-width="15%">
        <template slot-scope="scope">
          {{ scope.row.mnemonics }}
        </template>
      </el-table-column>
      <el-table-column label="网站地址" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.address }}
          <a :href="scope.row.address" class="el-icon-share" target="_blank" style="color: #409EFF">link</a>
        </template>
      </el-table-column>
      <el-table-column label="重要性" min-width="6%">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.importance" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="10%">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" @click="handleDetail(row)">详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageQuery.pageSize"
      :current-page.sync="pageQuery.pageNum"
      @current-change="fetchData"
    />
    <AccountPassInfo ref="InfoDialog" @close="fetchData" />
  </div>
</template>

<script>
import AccountPassInfo from './accountPassInfo'
import { Message } from 'element-ui'
import { getPage, del, update, getTypeList, excelExport } from '@/api/accountPass'

export default {
  components: { AccountPassInfo },
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
      passwordVisiable: false,
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
      getPage(this.pageQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        this.list.forEach(element => {
          element.password = this.decrypt(element.password)
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

<style>
    .box-card-bookmark {
      margin-left: 10px;
      margin-bottom: 20px;
      width: 300px;
      height: 380px;
      background: linear-gradient(45deg, rgb(220, 208, 160), #dfc7d3, hwb(290 51% 27%));
      /* animation: hueRotate 10s infinite alternate; */
    }
</style>
