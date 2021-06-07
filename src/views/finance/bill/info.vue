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
      <el-form-item label="类型" prop="typeId">
        <treeSelect
          v-model="formData.typeId"
          :tree-props="treeProps"
          :options="treeSelectList"
          :clearable="isClearable"
          :accordion="isAccordion"
          :expand-node="false"
          size="mini"
          width="100%"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input v-model="formData.amount" type="number" />
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="formData.date" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="方向">
        <el-select
          v-model="formData.direction"
          class="filter-item"
          placeholder="Please select"
        >
          <el-option key="2" :value="2" label="收入" />
          <el-option key="1" :value="1" label="支出" />
          <el-option key="0" :value="0" label="划转" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          v-model="formData.labels"
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
      <el-button type="primary" size="mini" @click="submit('on')">保存并继续</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { create, update, detail } from '@/api/finance/bill'
import { getTypeList } from '@/api/finance/billType'
import treeSelect from '../../../components/treeSelect'

export default {
  name: 'Info',
  components: {
    treeSelect
  },
  data() {
    return {
      treeProps: { // 配置项（必选）
        id: 'id',
        label: 'name',
        pid: 'parentId',
        children: 'children'
        // disabled:true
      },
      // 数组
      list: [],
      treeSelectList: [],
      isClearable: true, // 可清空（可选）
      isAccordion: false, // 可收起（可选）
      valueId: null, // 初始ID（可选）
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
    initData() {
      getTypeList().then(res => {
        this.list = res.data
        this.treeSelectList = this.listToTree(this.list, this.treeProps)
      })
    },
    initInfoDialog(visible, infoId, type) {
      console.log('type', type)
      console.log('infoId', infoId)
      this.type = type
      this.initData()
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
          this.formData.labels = res.data.labels.split('[,，]')
        })
      }
    },
    submit(val) {
      const formData = Object.assign({}, this.formData)
      formData.labels = this.formData.labels.toString()
      // 更新
      if (this.type === 2) {
        update(this.id, formData).then(res => {
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
        create(formData).then(res => {
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
