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
        <el-input v-model="formData.id" disabled />
      </el-form-item>
      <el-form-item label="数据库类型" prop="type">
        <el-select v-model="formData.type">
          <el-option
            v-for="(item) in typeArr"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据库版本" prop="version">
        <el-input v-model="formData.version" />
      </el-form-item>
      <el-form-item label="IP地址" prop="ipAddr">
        <el-input v-model="formData.ipAddr" />
      </el-form-item>
      <el-form-item label="IP地址（公网）" prop="ipAddrPublic">
        <el-input v-model="formData.ipAddrPublic" />
      </el-form-item>
      <el-form-item label="域名地址" prop="domainAddr">
        <el-input v-model="formData.domainAddr" />
      </el-form-item>
      <el-form-item label="PORT" prop="port">
        <el-input v-model="formData.port" />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="formData.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" />
      </el-form-item>
      <el-form-item label="JDBC_URL" prop="url">
        <el-input v-model="formData.url" />
      </el-form-item>
      <el-form-item label="关联服务器" prop="serverId">
        <el-input v-model="formData.serverId" />
      </el-form-item>
      <el-form-item label="启用状态">
        <el-select
          v-model="formData.enable"
          class="filter-item"
          placeholder="Please select"
        >
          <el-option key="0" :value="0" label="禁用" />
          <el-option key="1" :value="1" label="启用" />
        </el-select>
      </el-form-item>
      <el-form-item label="外网连接">
        <el-select
          v-model="formData.isPublic"
          class="filter-item"
          placeholder="Please select"
        >
          <el-option key="0" :value="0" label="关闭" />
          <el-option key="1" :value="1" label="开启" />
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
      <el-button type="primary" size="mini" @click="submit()">保存并继续</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { create, update, getTypeList, detail } from '@/api/pm/db'
export default {
  name: 'DbInfo',
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
    getTypeList().then(res => {
      this.typeArr = res.data
    })
  },
  methods: {
    initDbInfoDialog(visible, infoId, type) {
      console.log('type', type)
      console.log('infoId', infoId)
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
      this.id = infoId
      // 查询详情数据
      if (infoId !== 0) {
        detail(infoId).then(res => {
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
        create(this.formData).then(res => {
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
      }
    },
    handleClose() {
      this.disabled = false
      this.hideIdFlag = true
    }
  }
}
</script>
