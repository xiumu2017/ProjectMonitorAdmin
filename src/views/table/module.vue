<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container">
      <el-select v-model="listQuery.city" class="filter-item" placeholder="请选择城市" filterable clearable>
        <el-option v-for="item in cityArr" :key="item" :value="item" :label="item" />
      </el-select>
      <el-select v-model="listQuery.type" class="filter-item" placeholder="请选择类别" filterable clearable>
        <el-option v-for="item in typeArr" :key="item.code" :value="item.code" :label="item.name" />
      </el-select>
      <el-input v-model="listQuery.name" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="listQuery = {}">重置</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      style="margin-top: 20px"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="项目类型" width="100" prop="typeName">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
        </template>
      </el-table-column>
      <el-table-column label="城市" width="60">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" width="400">
        <template slot-scope="scope">
          {{ scope.row.name }}
          <a :href="scope.row.url" class="el-icon-share" target="_blank" style="color: #409EFF">link</a>
        </template>
      </el-table-column>
      <el-table-column label="重要性" width="100">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.importance" :max="3" disabled/>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="90" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="changeEnable(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="Mas类型" width="180" prop="masTypeName">
        <template slot-scope="scope">
          {{ scope.row.masTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="监控方式" width="80" prop="monitorType">
        <template slot-scope="scope">
          {{ scope.row.monitorType }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">项目信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  edit dialog  -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" title="项目信息维护">
      <el-form ref="dataForm" :rules="rules" :model="projectData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;" size="medium">
        <el-form-item label="城市" prop="city">
          <el-select v-model="projectData.city" class="filter-item" placeholder="Please select" filterable clearable>
            <el-option v-for="item in cityArr" :key="item" :value="item" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目类别" prop="type">
          <el-select v-model="projectData.type" class="filter-item" placeholder="Please select" filterable clearable>
            <el-option v-for="item in typeArr" :key="item.code" :value="item.code" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectData.name" />
        </el-form-item>
        <el-form-item label="访问地址" prop="url">
          <el-input v-model="projectData.url" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="projectData.userName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="projectData.password" />
        </el-form-item>
        <el-form-item label="MAS类型">
          <el-select v-model="projectData.masType" class="filter-item" placeholder="Please select">
            <el-option v-for="(item) in masTypeArr" :key="item.code" :value="item.code" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="监控方式">
          <el-select v-model="projectData.monitorType" class="filter-item" placeholder="Please select">
            <el-option key="1" value="DB" label="数据库直连" />
            <el-option key="2" value="WEB" label="Web接口调用" />
            <el-option key="3" value="OTHER" label="其它" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-rate v-model="projectData.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="projectData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getList, getMasTypeList, saveProject, changeEnable, getServer, getProjectTypeList, webLoginCheck } from '@/api/project'

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
      masTypeArr: [],
      typeArr: [],
      cityArr: ['合肥', '宿州', '阜阳', '马鞍山', '宣城', '池州', '安庆', '六安', '滁州', '铜陵', '亳州', '淮南', '淮北', '黄山'],
      list: null,
      listLoading: true,
      listQuery: {},
      dialogFormVisible: false,
      projectData: {},
      checkResultData: {},
      currentId: null,
      currentRow: null,
      loading: null
    }
  },
  created() {
    getMasTypeList().then(response => {
      this.masTypeArr = response.data
      this.fetchData()
    })
    getProjectTypeList().then(res => {
      this.typeArr = res.data
    })
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
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.list.forEach(item => {
          this.masTypeArr.forEach(masType => {
            if (masType && masType.code === item.masType) {
              item.masTypeName = masType.name
            }
          })
          this.typeArr.forEach(type => {
            if (type && type.code === item.type) {
              item.typeName = type.name
            }
          })
        })
        this.listLoading = false
      })
    },
    handleEdit(row) {
      this.projectData = Object.assign({}, row)
      this.currentRow = row
      this.dialogFormVisible = true
      console.log(this.currentRow)
    },
    handleServerEdit() {
      this.serverFormData = {}
      this.currentId = this.currentRow.id
      this.serverDialogVisible = true
      console.log(this.currentRow.serverId)
      if (this.currentRow.serverId) {
        getServer({ 'id': this.currentRow.serverId }).then(res => {
          if (res.code === 200) {
            if (res.data) {
              this.serverFormData = res.data
            }
          }
        })
      }
    },
    submitEdit() {
      const param = Object.assign({}, this.projectData, {})
      saveProject(param).then(response => {
        if (response.code === 200) {
          this.fetchData()
          this.dialogFormVisible = false
          Message({
            message: response.msg,
            type: 'success',
            duration: 5 * 1000
          })
        }
      })
    },
    changeEnable(row) {
      changeEnable({ 'id': row.id, 'enable': row.enable }).then(res => {
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
    projectLoginTest() {
      this.openLoading()
      webLoginCheck(this.projectData).then(res => {
        this.closeLoading()
        if (res.code === 200) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    }
  }
}
</script>
