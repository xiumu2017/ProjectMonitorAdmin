<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-select v-model="listQuery.type" class="filter-item" placeholder="请选择类别" filterable clearable>
        <el-option v-for="item in typeArr" :key="item.code" :value="item.code" :label="item.name" />
      </el-select>
      <el-select v-model="listQuery.city" class="filter-item" placeholder="请选择城市" filterable clearable>
        <el-option v-for="item in cityArr" :key="item" :value="item" :label="item" />
      </el-select>
      <el-input v-model="listQuery.name" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="listQuery = {}">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="startCheck">手动巡检</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="pushToDing">推送</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/record'

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
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
