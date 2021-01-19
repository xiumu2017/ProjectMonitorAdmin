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
      <el-form-item label="标签" prop="label">
        <el-select
          v-model="formData.label"
          multiple
          filterable
          allow-create
          default-first-option
        >
          <el-option
            v-for="(item) in typeArr"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="formData.date" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-input v-model="formData.startTime" placeholder="输入时间" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-input v-model="formData.endTime" placeholder="输入时间" />
      </el-form-item>
      <el-form-item label="做了什么事">
        <el-input
          v-model="formData.things"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-input v-model="formData.location" />
      </el-form-item>
      <el-form-item label="图片链接" prop="photos">
        <el-input v-model="formData.photos" />
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
      <el-button type="primary" size="mini" @click="submit('zz')">保存并继续</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { create, update, detail } from '@/api/day/timeline'
export default {
  name: 'TimelineInfo',
  data() {
    return {
      // 0 详情 1 新增 2 更新
      type: 0,
      title: '新增',
      titleArr: ['详情', '新增', '更新'],
      formData: {},
      typeArr: ['吃饭', '睡觉', '干活', '运动', '其它'],
      id: 0,
      now: new Date(),
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
    initInfoDialog(visible, infoId, type) {
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
    submit(val) {
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
        //
        this.handleFormData()
        create(this.formData).then(res => {
          if (res.code === 200) {
            Message({
              message: res.message,
              type: 'success',
              duration: 3 * 1000
            })
            if (val) {
              this.formData = {}
            } else {
              this.dialogVisible = false
            }
            this.$emit('close')
          }
        })
      }
    },
    handleClose() {
      this.disabled = false
      this.hideIdFlag = true
    },
    handleFormData() {
      const rq = this.formData.date
      const st = rq.split(' ')[0] + ' ' + this.formData.startTime + ':00'
      const et = rq.split(' ')[0] + ' ' + this.formData.endTime + ':00'
      this.formData.startTime = st
      this.formData.endTime = et
      const labelList = this.formData.label
      this.formData.label = labelList.toString()
      console.log('form', this.formData)
      if (!this.formData.photos) {
        this.formData.photos = '/'
      }
      if (!this.formData.remark) {
        this.formData.remark = '/'
      }
    }
  }
}
</script>
