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
      <el-form-item label="上级分类" prop="parentId">
        <treeSelect
          v-model="formData.parentId"
          :tree-props="treeProps"
          :options="treeSelectList"
          :clearable="isClearable"
          :accordion="isAccordion"
          :expand-node="false"
          size="small"
          width="100%"
          @getValue="getValue($event)"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="formData.icon" />
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
import { create, update, getTypeList, detail } from '@/api/finance/billType'
import treeSelect from '../../../components/treeSelect'

export default {
  name: 'Info',
  components: { treeSelect },
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
        console.log('res-list', this.list)
        this.treeSelectList = this.listToTree(this.list, this.treeProps)
        console.log('treeSelectList:', this.treeSelectList)
      })
    },
    /**
     * @description        数组转树形数据
     * @param {数据数组}    list
     * @param {树结构配置}  config
     */
    listToTree(list, config) {
      const conf = {}
      Object.assign(conf, config)
      const nodeMap = new Map()
      const result = []
      const { id, pid } = conf
      for (const node of list) {
        // node[children] = node[children] || [];
        nodeMap.set(node[id], node)
      }
      for (const node of list) {
        const parent = nodeMap.get(node[pid]);
        (parent ? (parent.children ? parent.children : parent.children = []) : result).push(node)
      }
      return result
    },
    initInfoDialog(visible, infoId, type) {
      console.log('type', type)
      console.log('infoId', infoId)
      this.initData()
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
        if (!this.formData.parentId) {
          this.formData.parentId = 0
        }
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
    },
    getValue(value) {
      console.log('getTreeSelValue', value)
    }
  }
}
</script>
