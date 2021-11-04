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
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="formData.author" />
      </el-form-item>
      <el-form-item label="朝代" prop="dynasty">
        <el-input v-model="formData.dynasty" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input
          v-model="formData.content"
          :autosize="{ minRows: 3, maxRows: 4 }"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="绝句">
        <el-input
          v-model="formData.sentence"
          :autosize="{ minRows: 3, maxRows: 4 }"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
    </el-form>

    <div v-if="type !== 0" class="dialog-footer" style="margin-left: 30px">
      <el-button type="primary" size="mini" @click="submit()">保存</el-button>
      <el-button type="primary" size="mini" @click="submit('zz')">保存并继续</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { create, update, detail } from '@/api/day/poem'
export default {
  name: 'PoemInfo',
  data() {
    return {
      // 0 详情 1 新增 2 更新
      type: 0,
      title: '新增',
      titleArr: ['详情', '新增', '更新'],
      formData: {},
      submitFormData: {},
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
  },
  methods: {
    initDialog(visible, infoId, type) {
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
          this.cost = this.formData.cost / 100
        })
      }
    },
    submit(val) {
      // 更新
      if (this.type === 2) {
        this.submitFormData = Object.assign({}, this.formData)
        this.submitFormData.cost = this.cost * 100
        update(this.id, this.submitFormData).then(res => {
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
        this.submitFormData = Object.assign({}, this.formData)
        this.submitFormData.cost = this.cost * 100
        create(this.submitFormData).then(res => {
          if (res.code === 200) {
            Message({
              message: res.message,
              type: 'success',
              duration: 3 * 1000
            })
            if (val) {
              // this.formData = {}
              this.$emit('close')
            } else {
              this.dialogVisible = false
              this.$emit('close')
            }
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
