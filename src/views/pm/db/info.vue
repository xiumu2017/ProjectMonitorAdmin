<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    width="35%"
    top="6vh"
    @close="handleClose()"
  >
    <el-form label-width="120px" size="mini" label-position="right" :disabled="disabled">
      <el-form-item label="ID" prop="id" :hidden="hideIdFlag">
        <el-input v-model="serverFormData.id" disabled />
      </el-form-item>
      <el-form-item label="服务器类型" prop="type">
        <el-select v-model="serverFormData.serverType">
          <el-option
            v-for="(item,index) in serverTypeArr"
            :key="item"
            :value="index"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务器名称" prop="name">
        <el-input v-model="serverFormData.name" />
      </el-form-item>
      <el-form-item label="IP地址" prop="ipAddr">
        <el-input v-model="serverFormData.ipAddr" />
      </el-form-item>
      <el-form-item label="IP地址（公网）" prop="ipAddrPublic">
        <el-input v-model="serverFormData.ipAddrPublic" />
      </el-form-item>
      <el-form-item label="域名地址" prop="domainAddr">
        <el-input v-model="serverFormData.domainAddr" />
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
      <el-form-item label="登录用户名" prop="userName">
        <el-input v-model="serverFormData.userName" />
      </el-form-item>
      <el-form-item label="OS" prop="os">
        <el-input v-model="serverFormData.os" />
      </el-form-item>
      <el-form-item label="OSVersion" prop="osVersion">
        <el-input v-model="serverFormData.osVersion" />
      </el-form-item>
      <el-form-item label="内存大小" prop="memory">
        <el-input v-model="serverFormData.memory" />
      </el-form-item>
      <el-form-item label="启用状态">
        <el-select
          v-model="serverFormData.enable"
          class="filter-item"
          placeholder="Please select"
        >
          <el-option key="0" value="0" label="启用" />
          <el-option key="1" value="1" label="停用" />
        </el-select>
      </el-form-item>
      <el-form-item label="链接状态">
        <el-select
          v-model="serverFormData.serverStatus"
          class="filter-item"
          placeholder="Please select"
        >
          <el-option key="0" value="0" label="启用" />
          <el-option key="1" value="1" label="停用" />
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          v-model="serverFormData.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
    </el-form>

    <div v-if="type !== 0" class="dialog-footer" style="margin-left: 30px">
      <el-button type="primary" size="mini" @click="submit()">保存</el-button>
      <el-button type="primary" size="mini" @click="submit()">保存并继续</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { create, update, getServerTypeList, detail } from '@/api/server'
export default {
  name: 'ServerInfo',
  data() {
    return {
      // 0 详情 1 新增 2 更新
      type: 0,
      title: '新增Server',
      titleArr: ['Server详情', '新增Server', '更新Server'],
      serverFormData: {},
      serverTypeArr: [],
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
    // 初始化查询 服务器类型列表
    getServerTypeList().then(res => {
      this.serverTypeArr = res.data
    })
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
        this.serverFormData = {}
      }
      this.dialogVisible = true
      this.id = serverId
      // 查询详情数据
      if (serverId !== 0) {
        detail(serverId).then(res => {
          this.serverFormData = res.data
        })
      }
    },
    submit() {
      // 更新
      if (this.type === 2) {
        update(this.id, this.serverFormData).then(res => {
          if (res.code === 200) {
            this.dialogVisible = false
            this.$emit('close')
          }
          Message({
            message: res.message,
            type: 'success',
            duration: 3 * 1000
          })
        })
      } else {
        // 新增
        // const data = JSON.stringify(this.serverFormData)
        // console.log('data', data)
        create(this.serverFormData).then(res => {
          if (res.code === 200) {
            this.dialogVisible = false
            this.$emit('close')
          }
          Message({
            message: res.message,
            type: 'success',
            duration: 3 * 1000
          })
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
