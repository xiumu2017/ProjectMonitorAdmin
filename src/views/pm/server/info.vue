<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    width="45%"
    top="8vh"
  >
    <el-form>
      <el-form-item label="服务器类型" prop="type">
        <el-select v-model="serverFormData.type">
          <el-option
            v-for="item in serverTypeArr"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          />
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
        <el-select
          v-model="serverFormData.status"
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

    <div class="dialog-footer" style="margin-left: 30px">
      <el-button type="primary" size="mini" @click="submitServerEdit()">保存</el-button>
      <el-button type="primary" size="mini" @click="submitServerEdit()">保存并继续</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { create, update } from '@/api/server'
export default {
  name: 'ServerInfo',
  data() {
    return {
      title: '新增Server',
      serverFormData: {},
      serverTypeArr: [],
      id: 0,
      dialogVisible: false,
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
  methods: {
    initServerDialog(visible, serverId) {
      this.dialogVisible = true
      this.id = serverId
      // 查询详情数据
      this.serverFormData = {}
    },
    submit() {
      if (this.serverFormData.id) {
        update(this.serverFormData).then(res => {
          if (res.code === 200) {
            this.dialogVisible = false
          }
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        })
      } else {
        create(this.serverFormData).then(res => {
          if (res.code === 200) {
            this.dialogVisible = false
          }
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        })
      }
    }
  }
}
</script>
