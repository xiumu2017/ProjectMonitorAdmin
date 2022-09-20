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
      <el-form-item label="日期">
        <el-date-picker v-model="formData.date" type="date" placeholder="选择日期" value-format="timestamp" />
      </el-form-item>
      <el-form-item label="上床时间">
        <el-input v-model="formData.bedTime" />
      </el-form-item>
      <el-form-item label="入睡时间">
        <el-input v-model="formData.sleepTime" />
      </el-form-item>
      <el-form-item label="醒来时间">
        <el-input v-model="formData.wakeTime" />
      </el-form-item>
      <el-form-item label="起床时间">
        <el-input v-model="formData.upTime" />
      </el-form-item>
      <el-form-item label="睡眠质量">
        <el-rate v-model="formData.sleepQuality" />
      </el-form-item>
      <el-form-item label="睡前回忆">
        <el-input
          v-model="formData.memory"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="熬夜原因">
        <el-input v-model="formData.lateReason" />
      </el-form-item>
      <el-form-item label="今日最佳">
        <el-input v-model="formData.bestTime" />
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
import { create, update, detail } from '@/api/day/sleep'
import { formatTimeYmd } from '@/utils/dateUtils'

export default {
  name: 'SleepRecordInfo',
  data() {
    return {
      // 等同于 { 2: 'icon-rate-face-1', 4: { value: 'icon-rate-face-2', excluded: true }, 5: 'icon-rate-face-3' }
      iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
      // 0 详情 1 新增 2 更新
      type: 0,
      title: '新增睡眠记录',
      titleArr: ['详情', '新增', '更新'],
      formData: {},
      submitFormData: {},
      id: 0,
      disabled: false,
      dialogVisible: false,
      hideIdFlag: true,
      pickerOptions: {
        format: 'HH:mm'
      },
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
    // 初始化
  },
  methods: {
    initServerDialog(visible, id, type) {
      console.log('type', type)
      console.log('id', id)
      this.type = type
      if (type && type instanceof Number) {
        this.title = this.titleArr[type]
      }
      if (this.type === 0) {
        this.disabled = true
      }
      if (this.type === 1) {
        this.formData = {
          date: new Date(formatTimeYmd(new Date())).getTime()
        }
      }
      this.dialogVisible = true
      this.id = id
      // 查询详情数据
      if (id !== 0) {
        detail(id).then(res => {
          this.formData = res.data
          this.formData.date = (new Date(this.formData.date)).getTime()
        })
      }
    },
    submit() {
      this.handleFormData()
      // 更新
      if (this.type === 2) {
        update(this.id, this.submitFormData).then(res => {
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
        create(this.submitFormData).then(res => {
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
    },
    handleFormData() {
      this.submitFormData = Object.assign({}, this.formData)
      const bedTime = this.submitFormData.bedTime
      const sleepTime = this.submitFormData.sleepTime
      const v = new Date(this.submitFormData.date)
      const rq = v.getFullYear() + '-' + (v.getMonth() + 1) + '-' + v.getDate()
      const bt = rq + ' ' + this.submitFormData.bedTime + ':00'
      const st = rq + ' ' + this.submitFormData.sleepTime + ':00'
      const wt = rq + ' ' + this.submitFormData.wakeTime + ':00'
      const ut = rq + ' ' + this.submitFormData.upTime + ':00'
      const std = new Date(st)
      const btd = new Date(bt)
      const wtd = new Date(wt)
      const utd = new Date(ut)
      this.submitFormData.bedTime = btd.getTime()
      this.submitFormData.sleepTime = std.getTime()
      this.submitFormData.wakeTime = wtd.getTime()
      this.submitFormData.upTime = utd.getTime()
      // 时间修正
      if (bedTime.split(':')[0] > 20) {
        this.submitFormData.bedTime = this.submitFormData.bedTime - 24 * 3600 * 1000
      }
      if (sleepTime.split(':')[0] > 20) {
        this.submitFormData.sleepTime = this.submitFormData.sleepTime - 24 * 3600 * 1000
      }
      console.log('submitFormData', this.submitFormData)
    }
  }
}
</script>
