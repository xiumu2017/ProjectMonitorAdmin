.
<template>
  <div class="app-container">

    <!-- 查询区域 -->
    <div class="filter-container" />

    <div class="container">
      <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="currentColor"
            class="bi bi-code-slash"
            viewBox="0 0 16 16"
          >
            <path
              d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"
            />
          </svg>
          &nbsp;
          <span class="fs-4">CodeTrans</span>&nbsp;&nbsp;
        </a>
        <ul class="nav nav-pills">
          <li class="nav-item"><a href="https://github.com/hsiao-feng" target="_blank" class="nav-link">作者</a></li>
          <li class="nav-item"><a href="https://github.com/hsiao-feng/CodeTrans" target="_blank" class="nav-link">源码</a>
          </li>
        </ul>
      </header>
    </div>
    <main>
      <div class="container">
        <el-input
          v-model="inputValue"
          placeholder="请在此输入..."
          style="width: 500px;"
          class="filter-item"
          @change="textChange"
        />

        <el-row :gutter="50" style="margin-top:20px">
          <el-col v-for="item in resArr" :key="item.index" :span="8" :offset="0">
            <el-card class="box-card" width="500px" style="margin-top:10px">
              <div slot="header" class="clearfix">
                <span>{{ item.fontName }}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="copy(item.text)">复制</el-button>
              </div>
              <div class="text item">
                {{ item.text }}
              </div>
            </el-card>
          </el-col>
        </el-row>

      </div>
    </main>
  </div>
</template>
<script>
import { handleInput } from '@/utils/unicode'

export default {

  data() {
    return {
      inputValue: 'Welcome to Paradise ',
      resArr: []
    }
  },
  created() {
    this.textChange(this.inputValue)
  },
  methods: {
    copy(text) {
      navigator.clipboard.writeText(text)
    },
    textChange(v) {
      this.resArr = handleInput(v)
    }
  }
}
</script>
