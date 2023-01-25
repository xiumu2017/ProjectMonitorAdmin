<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :title="title" width="35%" top="6vh"
    @close="handleClose()">
    <el-form label-width="120px" size="mini" label-position="right" :disabled="disabled">
      <el-form-item label="ID" prop="id" :hidden="hideIdFlag">
        <el-input v-model="formData.id" disabled />
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="formData.date" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type">
          <el-option v-for="(item, index) in typeArr" :key="item" :value="index" :label="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="吃什么" prop="what">
        <el-input v-model="formData.what" />
      </el-form-item>
      <el-form-item label="在哪儿吃" prop="place">
        <el-input v-model="formData.place" />
      </el-form-item>
      <el-form-item label="花了多少" prop="cost">
        <el-input v-model="cost" suffix-icon="el-icon-money" type="number" />
      </el-form-item>
      <el-form-item label="支付方式" prop="payType">
        <el-select v-model="formData.payType">
          <el-option v-for="(item, index) in payTypeArr" :key="item" :value="index" :label="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" :autosize="{ minRows: 3, maxRows: 4 }" type="textarea" placeholder="" />
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
import { create, update, types, payTypes, detail } from '@/api/day/meal'
import { formatDateTime } from '@/utils/dateUtils'

export default {
  name: 'MealInfo',
  data() {
    return {
      // 0 详情 1 新增 2 更新
      type: 0,
      title: '新增',
      titleArr: ['详情', '新增', '更新'],
      formData: {},
      submitFormData: {},
      cost: 0,
      typeArr: [],
      payTypeArr: [],
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
    types().then(res => {
      this.typeArr = res.data
    })
    payTypes().then(res => {
      this.payTypeArr = res.data
    })
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
        // 初始化默认值
        // 日期默认当天
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        let dateStr = formatDateTime(now)
        console.log(dateStr)
        let type = 1
        const hours = now.getHours()
        if (hours > 6 && hours < 12) {
          type = 1
        } else if (hours >= 12 && hours < 18) {
          type = 2
        } else {
          type = 3
        }
        this.formData = {
          date: dateStr,
          type: type,
          place: '公司食堂',
          payType: 4
        }
        this.cost = 0
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
        // const date = new String(this.submitFormData.date)
        // this.submitFormData.date = date.slice(0, 10)
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
        // const date = new String(this.submitFormData.date)
        // this.submitFormData.date = date.slice(0, 10)
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
