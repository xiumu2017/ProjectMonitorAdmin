<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    width="35%"
    top="6vh"
    @close="handleClose()"
  >
    <el-form label-width="120px" size="small" label-position="right" :disabled="disabled">
      <el-form-item label="ID" prop="id" :hidden="hideIdFlag">
        <el-input v-model="formData.id" disabled />
      </el-form-item>
      <el-form-item label="项目类型" prop="type">
        <el-input v-model="formData.type" />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="formData.projectName" />
      </el-form-item>
      <el-form-item label="项目地址" prop="ipAddr">
        <el-input v-model="formData.serviceUrl" />
      </el-form-item>
      <el-form-item label="用户名" prop="ipAddrPublic">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" />
      </el-form-item>
      <el-form-item label="MaxAlert" prop="port">
        <el-input v-model="formData.maxAlert" />
      </el-form-item>
      <el-form-item label="ErrorCount" prop="userName">
        <el-input v-model="formData.errorCount" />
      </el-form-item>
      <el-form-item label="重要性">
        <el-rate v-model="formData.importance" />
      </el-form-item>
      <el-form-item label="项目开始时间" prop="password">
        <el-date-picker v-model="formData.startTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="项目结束时间" prop="userName">
        <el-date-picker v-model="formData.endTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="项目资料链接" prop="os">
        <el-input v-model="formData.projectInfoLink" />
      </el-form-item>
      <el-form-item label="启用状态">
        <el-select
          v-model="formData.status"
          class="filter-item"
          placeholder="Please select"
        >
          <el-option key="0" value="0" label="启用" />
          <el-option key="1" value="1" label="停用" />
        </el-select>
      </el-form-item>
      <el-form-item label="链接状态">
        <el-select
          v-model="formData.statusCode"
          class="filter-item"
          placeholder="Please select"
        >
          <el-option key="0" value="0" label="启用" />
          <el-option key="1" value="1" label="停用" />
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          v-model="formData.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
    </el-form>

    <div v-if="type !== 0" class="dialog-footer" style="margin-left: 30px">
      <el-button type="primary" size="mini" @click="submit()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { create, update, detail } from '@/api/pm/project'
export default {
  name: 'ProjectInfo',
  data() {
    return {
      // 0 详情 1 新增 2 更新
      type: 0,
      title: '新增',
      titleArr: ['详情', '新增', '更新'],
      formData: {},
      typeArr: [],
      id: 0,
      disabled: false,
      dialogVisible: false,
      hideIdFlag: true,
      props: {
        id: {
          type: Number,
          default: 0
        },
        dialogVisible: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  created() {
    // 初始化查询
  },
  methods: {
    initServerDialog(visible, serverId, type) {
      console.log('type', type)
      console.log('serverId', serverId)
      this.type = type
      if (type && type instanceof Number) {
        this.title = this.type[type]
      }
      if (this.type === 0) {
        this.disabled = true
      }
      if (this.type === 1) {
        this.formData = {}
      }
      this.dialogVisible = true
      this.id = serverId
      // 查询详情数据
      if (serverId !== 0) {
        detail(serverId).then(res => {
          this.formData = res.data
        })
      }
    },
    submit() {
      // 更新
      if (this.type === 2) {
        update(this.id, this.formData).then(res => {
          if (res.code === 200) {
            this.dialogVisible = false
            this.$emit('close')
            Message({
              message: res.message,
              type: 'success',
              duration: 3 * 1000
            })
          }
        })
      } else {
        // 新增
        // const data = JSON.stringify(this.formData)
        // console.log('data', data)
        create(this.formData).then(res => {
          if (res.code === 200) {
            Message({
              message: res.message,
              type: 'success',
              duration: 3 * 1000
            })
            this.dialogVisible = false
            this.$emit('close')
          }
        })
      }
    },
    handleClose() {
      this.disabled = false
      this.hideIdFlag = true
    }
  }
}
</script>
