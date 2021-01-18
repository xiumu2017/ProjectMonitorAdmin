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
      <el-select v-model="listQuery.enable" class="filter-item" placeholder="启用/禁用" clearable>
        <el-option key="1" value="1" label="启用" />
        <el-option key="0" value="0" label="禁用" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" type="warning" size="mini" icon="el-icon-search" @click="handleHideNo">隐藏非巡检</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh" @click="listQuery = {}">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" @click="excelExport">导出</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" @click="startCheck">手动巡检</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" @click="pushToDing">推送</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      style="margin-top: 20px"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @row-dblclick="handleEdit"
      @row-contextmenu="deleteProject"
    >
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
      <el-table-column label="城市" width="80">
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
          <el-rate v-model="scope.row.importance" :max="3" disabled />
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
            @change="changeEnable(row)"
          />
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
      <el-table-column label="状态" width="210">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
    </el-table>

    <!--  edit dialog  -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" title="信息维护" width="45%" top="8vh">
      <div class="dialog-footer" style="margin-bottom: 20px">
        <el-button-group>
          <el-button size="mini" type="danger" @click="handleTransitCheck()">调试查看</el-button>
          <el-button size="mini" type="danger" @click="handleCheck">手动巡检</el-button>
          <el-button size="mini" type="info" @click="$message({message:'1',type:'success'})">客户信息</el-button>
        </el-button-group>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane label="项目信息">
          <el-form ref="dataForm" :rules="rules" :model="projectData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;" size="mini">
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
                <el-option key="0" value="NO" label="不监控" />
              </el-select>
            </el-form-item>
            <el-form-item label="优先级">
              <el-rate v-model="projectData.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="projectData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
            </el-form-item>
          </el-form>
          <div class="dialog-footer" style="margin-left: 30px">
            <el-button size="mini" type="primary" @click="submitEdit()">保存</el-button>
            <el-button size="mini" type="primary" @click="projectLoginTest">登录测试</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="服务器信息">
          <el-form ref="serverForm" :rules="rules" :model="serverFormData" size="mini" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
            <el-form-item label="服务器类型" prop="type">
              <el-select v-model="serverFormData.type">
                <el-option v-for="item in serverTypeArr" :key="item.code" :value="item.code" :label="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="操作系统类型" prop="os">
              <el-select v-model="serverFormData.os">
                <el-option v-for="item in serverOsArr" :key="item.code" :value="item.code" :label="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="OS版本" prop="osVersion">
              <el-input v-model="serverFormData.osVersion" />
            </el-form-item>
            <el-form-item label="内存大小" prop="memory">
              <el-input v-model="serverFormData.memory" />
            </el-form-item>
            <el-form-item label="IP" prop="ip">
              <el-input v-model="serverFormData.ip" />
            </el-form-item>
            <el-form-item label="PORT" prop="port">
              <el-input v-model="serverFormData.port" />
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="serverFormData.userName" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="serverFormData.password" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="serverFormData.status" class="filter-item" placeholder="Please select">
                <el-option key="0" value="0" label="启用" />
                <el-option key="1" value="1" label="停用" />
              </el-select>
            </el-form-item>

            <el-form-item label="备注">
              <el-input v-model="serverFormData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
            </el-form-item>
          </el-form>
          <div class="dialog-footer" style="margin-left: 30px">
            <el-button type="primary" size="mini" @click="submitServerEdit()">保存</el-button>
            <el-button type="primary" size="mini" @click="serverTest">连接测试</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据库信息">
          <el-form ref="dbForm" :rules="rules" :model="dbFormData" size="mini" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
            <el-form-item label="IP">
              <el-input v-model="dbFormData.ip" />
            </el-form-item>
            <el-form-item label="PORT" prop="port">
              <el-input v-model="dbFormData.port" />
            </el-form-item>
            <el-form-item label="URL" prop="url">
              <el-input v-model="dbFormData.url" />
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="dbFormData.userName" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="dbFormData.password" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="dbFormData.status" class="filter-item" placeholder="Please select">
                <el-option key="0" value="0" label="启用" />
                <el-option key="1" value="1" label="停用" />
              </el-select>
            </el-form-item>

            <el-form-item label="备注">
              <el-input v-model="dbFormData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
            </el-form-item>
          </el-form>
          <div class="dialog-footer" style="margin-left: 30px">
            <el-button type="primary" size="mini" @click="submitDbEdit()">保存</el-button>
            <el-button type="primary" size="mini" @click="handleDbTest()">连接测试</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="MAS信息" />
      </el-tabs>
    </el-dialog>

    <!-- server dialog -->
    <el-dialog :visible.sync="serverDialogVisible" title="服务器信息" />
    <!-- db dialog -->
    <el-dialog :visible.sync="dbDialogVisible" title="数据库信息" />
    <!-- 巡检结果form - dialog -->
    <el-dialog :visible.sync="tcDialogVisible" :close-on-click-modal="false" title="Transit - Check - Result">
      <!--      <el-col :span="24" style="font-size: medium">系统配置情况：</el-col>-->
      <el-form ref="form1" :model="checkResultData" disabled size="mini" label-width="100px">
        <el-col :span="8">
          <el-form-item label="标题">
            <el-input v-model="checkResultData.title" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否开启发送">
            <el-input v-model="checkResultData.sendAble" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发送区间">
            <el-tag>{{ checkResultData.startHour }}</el-tag>
            <el-tag>{{ checkResultData.endHour }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="短信长度">
            <el-input v-model="checkResultData.smsLength" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="短信内容">
            <el-input v-model="checkResultData.smsContent" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="sendType">
            <el-input v-model="checkResultData.sendType" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="sendFlag">
            <el-input v-model="checkResultData.sendFlag" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="月发送限额">
            <el-input v-model="checkResultData.sendMonth" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年发送限额">
            <el-input v-model="checkResultData.sendYear" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="当日已发送量">
            <el-input v-model="checkResultData.sendCount" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="当月已发送量">
            <el-input v-model="checkResultData.sendTotalCount" />
          </el-form-item>
        </el-col>
        <el-col :span="12" />
      </el-form>
      <table>
        <thead>
          <tr>
            <td rowspan="2">当日发送情况一览</td>
          </tr>
        </thead>
        <tr>
          <td>最近一次短信发送时间</td>
          <td>{{ checkResultData.lastSendTime }}</td>
        </tr>
        <tr>
          <td>最近一次号码推送时间</td>
          <td>{{ checkResultData.lastPushTime }}</td>
        </tr>
        <tr>
          <td>当天发送成功号码数量</td>
          <td>{{ checkResultData.sendSuccessCount }}</td>
        </tr>
        <tr>
          <td>当天发送失败号码数量</td>
          <td>{{ checkResultData.sendFailCount }}</td>
        </tr>
        <tr>
          <td>当天提交成功号码数量</td>
          <td>{{ checkResultData.submitSuccessCount }}</td>
        </tr>
        <tr>
          <td>当天提交失败号码数量</td>
          <td>{{ checkResultData.submitFailCount }}</td>
        </tr>
        <tr>
          <td>当天超出日发送量数量</td>
          <td>{{ checkResultData.overDayCount }}</td>
        </tr>
        <tr>
          <td>当天超出月发送量数量</td>
          <td>{{ checkResultData.overMonthCount }}</td>
        </tr>
      </table>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getList, saveProject, saveDb, saveServer, getServer, deleteProject, check, excelExport,
  getDb, dbConnectTest, serverConnectTest } from '@/api/project'
import { getServerOsList, getServerTypeList } from '@/api/server'

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
      serverOsArr: [],
      serverTypeArr: [],
      cityArr: ['合肥', '宿州', '阜阳', '马鞍山', '宣城', '池州', '安庆', '六安', '滁州', '铜陵', '亳州', '淮南', '淮北', '黄山'],
      list: null,
      listLoading: true,
      listQuery: { pageNum: 1, pageSize: 10 },
      dialogFormVisible: false,
      serverDialogVisible: false,
      dbDialogVisible: false,
      tcDialogVisible: false,
      serverFormData: {},
      dbFormData: {},
      projectData: {},
      checkResultData: {},
      currentId: null,
      currentRow: null,
      loading: null,
      hiddenNoCheck: false
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
    handleHideNo() {
      this.hiddenNoCheck = !this.hiddenNoCheck
      this.listQuery['hiddenNoCheck'] = this.hiddenNoCheck
      this.fetchData()
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
    handleEdit(row, event) {
      this.projectData = Object.assign({}, row)
      this.currentRow = row
      this.dialogFormVisible = true
      if (this.currentRow.serverId) {
        getServer({ 'id': this.currentRow.serverId }).then(res => {
          if (res.code === 200) {
            if (res.data) {
              this.serverFormData = res.data
            }
          }
        })
      }
      if (this.currentRow.dbId) {
        getDb({ 'id': this.currentRow.dbId }).then(res => {
          if (res.code === 200) {
            this.dbFormData = res.data
          }
        })
      }
    },
    handleServerEdit() {
      this.serverFormData = {}
      this.currentId = this.currentRow.id
      this.serverDialogVisible = true
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
    handleDbEdit() {
      this.dbFormData = {}
      this.currentId = this.currentRow.id
      this.dbDialogVisible = true
      if (this.currentRow.dbId) {
        getDb({ 'id': this.currentRow.dbId }).then(res => {
          if (res.code === 200) {
            this.dbFormData = res.data
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
    handleAdd() {
      this.projectData = {}
      this.dialogFormVisible = true
    },
    changeEnable(row) {
      const param = { 'id': row.id, 'enable': row.enable }
      changeEnable(param).then(res => {
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
    submitDbEdit() {
      saveDb(Object.assign({}, this.dbFormData, { 'projectId': this.currentId })).then(res => {
        if (res.code === 200) {
          this.dbDialogVisible = false
          this.fetchData()
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    submitServerEdit() {
      const param = Object.assign({ 'projectId': this.currentId }, this.serverFormData)
      saveServer(param).then(res => {
        if (res.code === 200) {
          this.serverDialogVisible = false
          this.fetchData()
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    serverTest() {
      this.openLoading()
      serverConnectTest(this.serverFormData).then(res => {
        this.closeLoading()
        if (res.code === 200) {
          Message({
            message: res.msg + res.data,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    handleDbTest() {
      this.openLoading()
      dbConnectTest(this.dbFormData).then(res => {
        this.closeLoading()
        if (res.code === 200) {
          Message({
            message: res.msg + res.data,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    handleTransitCheck() {
      this.checkResultData = {}
      this.openLoading()
      transitCheck({ 'id': this.currentRow.id }).then(res => {
        this.closeLoading()
        this.tcDialogVisible = true
        if (res.code === 200) {
          const data = res.data
          console.log('>>>-')
          console.log(data)
          const config = Object.assign({}, data.config)
          console.log('>>>--')
          console.log(config)
          data.config = {}
          this.checkResultData = Object.assign({}, config, data)
          console.log('>>>---')
          console.log(this.checkResultData)
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
    },
    startCheck() {
      this.openLoading()
      startCheck({ 'token': 'paradise' }).then(res => {
        this.closeLoading()
        if (res.code === 200) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
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
        deleteProject({ 'id': row.id }).then(res => {
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
    pushToDing() {
      this.openLoading()
      pushToDing().then(res => {
        this.closeLoading()
        if (res.code === 200) {
          this.$notify({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    handleCheck() {
      this.openLoading()
      check(this.currentRow).then(res => {
        this.closeLoading()
        if (res.code === 200) {
          this.$notify({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    excelExport() {
      this.openLoading()
      excelExport(this.listQuery).then(res => {
        this.closeLoading()
      })
    }
  }
}
</script>
