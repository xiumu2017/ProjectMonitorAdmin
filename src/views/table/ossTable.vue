<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-upload
        class="upload-demo"
        :action="uploadUrl"
        :file-list="fileList"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleAdd"
      >
        <el-button class="filter-item" style="margin-left: 10px;margin-top: 10px;" size="mini" type="primary" icon="el-icon-upload">上传</el-button>
      </el-upload>
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
      <el-table-column label="BucketName" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.bucketName }}
        </template>
      </el-table-column>
      <el-table-column label="Key" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column label="eTag" min-width="15%">
        <template slot-scope="scope">
          {{ scope.row.etag }}
        </template>
      </el-table-column>
      <el-table-column label="Size" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.size }}
        </template>
      </el-table-column>
      <el-table-column label="LastModified" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.lastModified }}
        </template>
      </el-table-column>
      <el-table-column label="StorageClass" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.storageClass }}
        </template>
      </el-table-column>
      <el-table-column label="Url_" min-width="5%">
        <template slot-scope="scope">
          <a :href="scope.row.url" class="el-icon-share" target="_blank" style="color: #409EFF">link</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="10%">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getPage, del, create } from '@/api/oss'

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
      list: null,
      listLoading: false,
      loading: null,
      currentId: 0,
      fileList: [],
      uploadUrl: 'http://localhost:8005/pm/minio/oss/upload'
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
      getPage().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleDetail(row) {
      console.info('handleDetail', row)
    },
    handleAdd(file, fileList) {
      console.info('file', file)
      console.info('files', fileList)
      const formData = new FormData()
      formData.append('file', file.raw)
      create(formData).then(res => {
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
