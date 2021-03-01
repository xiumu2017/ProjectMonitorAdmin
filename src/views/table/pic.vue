<template>
  <div class="app-container" style="overflow: scroll">
    <div v-for="(item,index) in picList" :key="index" style="float: left">
      <el-image :src="item.img" :preview-src-list="srcList" />
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data() {
    return {
      picList: null,
      srcList: []
    }
  },
  created() {
    axios.get('https://api.apiopen.top/getImages').then(res => {
      console.log('tag', res)
      this.picList = res.data.result
      this.picList.forEach(element => {
        this.srcList.push(element.img)
      })
    })
  },
  methods: {}
}
</script>
