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
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="pageQuery = {pageNum: 1,pageSize: 10}">重置</el-button>
    </div>

    <div class="block" style="margin-top:75px;margin-left:50px">
      <el-timeline>
        <el-timeline-item
          v-for="(activity) in list"
          :key="activity.id"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.startTime"
        >
          {{ activity.things }}
          <el-button-group style="margin-left: 35px">
            <el-button type="info" size="mini" icon="el-icon-info" circle @click="handleDetail(activity)" />
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEdit(activity)" />
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDel(activity)" />
          </el-button-group>
        </el-timeline-item>
      </el-timeline>
    </div>
    <TimelineInfo ref="infoDialog" @close="fetchData" />
  </div>
</template>

<script>
import TimelineInfo from './info'
import { Message } from 'element-ui'
import { getPage, del, update } from '@/api/day/timeline'

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
      list: null,
      listLoading: false,
      pageQuery: {
      },
      total: 0,
      loading: null,
      currentId: 0,
      activities: [{
        content: '支持使用图标',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-more'
      }, {
        content: '支持自定义颜色',
        timestamp: '2018-04-03 20:46',
        color: '#0bbd87'
      }, {
        content: '支持自定义尺寸',
        timestamp: '2018-04-03 20:46',
        size: 'large'
      }, {
        content: '默认样式的节点',
        timestamp: '2018-04-03 20:46'
      }]
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
        this.list = response.data
        this.total = response.data.total
        this.listLoading = false
        console.log('list', this.list)
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
