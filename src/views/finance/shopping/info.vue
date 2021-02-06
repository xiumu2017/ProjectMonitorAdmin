<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    width="35%"
    top="10vh"
    @close="handleClose()"
  >
    <el-form label-width="120px" size="mini" label-position="right" :disabled="disabled">
      <el-form-item label="ID" prop="id" :hidden="hideIdFlag">
        <el-input v-model="formData.id" disabled />
      </el-form-item>
      <el-form-item label="购买时间" prop="purchaseTime">
        <el-input v-model="formData.purchaseTime" />
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-select v-model="formData.source">
          <el-option
            v-for="(item,index) in sourceArr"
            :key="index"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="formData.orderNo" />
      </el-form-item>
      <el-form-item label="标签" prole="labelArr">
        <el-select
          v-model="formData.labelArr"
          multiple
          filterable
          allow-create
          default-first-option
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-input v-model="formData.type" />
      </el-form-item>
      <el-form-item label="名称" prop="productName">
        <el-input v-model="formData.productName" />
      </el-form-item>
      <el-form-item label="明细">
        <el-input
          v-model="formData.detailName"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="链接" prop="orderLink">
        <el-input v-model="formData.orderLink" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="formData.price" />
      </el-form-item>
      <el-form-item label="支付方式" prop="payType">
        <el-select v-model="formData.payType">
          <el-option
            v-for="(item,index) in payTypeArr"
            :key="index"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="满意度" prop="rate">
        <el-rate
          v-model="formData.rate"
          show-text
          :texts="rateTexts"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="formData.remark"
          :autosize="{ minRows: 2, maxRows: 5 }"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
    </el-form>

    <div v-if="type !== 0" class="dialog-footer" style="margin-left: 30px">
      <el-button type="primary" size="mini" @click="submit()">保存</el-button>
      <el-button type="primary" size="mini" @click="submit('on')">保存并继续</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { create, update, payTypes, sources, detail } from '@/api/finance/shopping'
export default {
  name: 'Info',
  data() {
    return {
      // 0 详情 1 新增 2 更新
      type: 0,
      title: '新增',
      titleArr: ['详情', '新增', '更新'],
      rateTexts: ['垃圾', '失望', '一般', '满意', '惊喜'],
      formData: {},
      typeArr: [],
      payTypeArr: [],
      sourceArr: [],
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
    payTypes().then(res => {
      this.payTypeArr = res.data
    })
    sources().then(res => {
      this.sourceArr = res.data
    })
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
          res.data.rate = parseInt(res.data.rate)
          this.formData = res.data
          this.formData.labelArr = this.formData.labels.split(/[,，]/g)
        })
      }
    },
    submit(val) {
      if (this.formData.labelArr) {
        this.formData.labels = this.formData.labelArr.toString()
      }
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
            Message({
              message: res.message,
              type: 'success',
              duration: 3 * 1000
            })
            if (val) {
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
