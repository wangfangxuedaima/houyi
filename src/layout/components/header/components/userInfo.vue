<template>
  <div class="user-info-wraper">
    <span class="user-name">{{ userName || '' }}</span>
    <a @click="fLoginOut"
      class="login-out">
      <i class="el-icon-switch-button"></i>退出
    </a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import screenfull from 'screenfull'

export default {
  computed: {
    ...mapGetters(['userName']),
  },
  methods: {
    fLoginOut() {
      this.$store.dispatch('user/LoginOut')
    },
    fToggleFull() {
      if (!screenfull.enabled) {
        this.$message({
          type: 'warning',
          message: 'you browser can not work',
        })
        return false
      }
      screenfull.toggle()
    },
  },
}
</script>
<style lang="scss" scoped>
.user-info-wraper {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  .user-name {
    margin: 0 20px;
    color: #3d95f1;
  }
  .login-out {
    margin-right: 20px;
    color: #606266;
    &:hover {
      color: #3d95f1;
    }
  }
}
</style>
