<template>
  <div class="page-wraper">
    <div class="op-bar">
      <el-button type="success"
        icon="el-icon-plus"
        v-has="'/system/modules/create/:id'"
        @click="fCreate">新增模块</el-button>
    </div>
    <el-steps :active="steps.length"
      simple
      class="step-bar">
      <el-step v-for="step in steps"
        icon="el-icon-menu"
        :key="step.title"
        @click.native="fJumptoLevel(step.id)"
        :title="step.title">
      </el-step>
    </el-steps>
    <pagination-pro :loading.sync="bIsLoading"
      ref="pageRef"
      url="/system/modules"
      method='get'
      :autoload="false"
      :key-map="{data: 'data.rows'}"
      :params="listParams">
      <template slot-scope="{ data }">
        <el-table :data="data"
          v-loading="bIsLoading"
          ref="table"
          border
          header-cell-class-name="table-header">
          <el-table-column show-overflow-tooltip
            min-width="210px"
            align="center"
            prop="name"
            label="名称">
            <template slot-scope="{row}">
              <row-pop-view :info="row | popViewInfo"
                @fReload="fReload"></row-pop-view>
            </template>
          </el-table-column>
          <el-table-column min-width="150px"
            align="center"
            label="地址">
            <template slot-scope="{row}">
              {{ row.url || '/' }}
            </template>
          </el-table-column>
          <el-table-column min-width="150px"
            align="center"
            label="CODE">
            <template slot-scope="{row}">
              {{ row.code || '/' }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pagination-pro>
  </div>
</template>
<script>
import {
  listMixins, detailMixins,
} from '@/mixins/index'
import {
  fDelModules, fGetModuleInfo,
} from '@/api/system/modules'
import RowPopView from '@/components/RowPopView'
const FirstStep = {
  title: '一级列表',
  id: -1,
}

export default {
  mixins: [listMixins, detailMixins],
  components: { RowPopView },
  data() {
    return {
      isRefresh: false,
      listParams: { parentId: -1 },
      steps: [FirstStep],
      activeStepIndex: 1,
    }
  },
  filters: {
    popViewInfo: (row) => {
      return {
        detail: {
          pemissionUrl: '/system/modules/index/:id',
          link: `/system/modules/index/${row.id}`,
          val: row.name,
        },
        operationList: [
          {
            name: '修改',
            link: `/system/modules/edit/${row.id}`,
            // isHidden: ['内部用户', 'DSP用户'].includes(row.name),
            pemissionUrl: '/system/modules/edit/:id',
            type: 'primary',
          },
          {
            name: '新建子模块',
            link: `/system/modules/create/${row.id}`,
            pemissionUrl: '/system/modules/create/:id',
            type: 'warning',
          },
          {
            name: '删除',
            pemissionUrl: '/system/users/delete',
            // isHidden: ['内部用户', 'DSP用户'].includes(row.name),
            type: 'danger',
            operation: {
              reqFunction: fDelModules,
              reqParam: { id: row.id },
              confirmMessage: '将删除模块，请确定是否执行',
              emitName: 'fReload',
            },
          },
        ],
      }
    },
  },
  watch: {
    $route: {
      handler: function (v) {
        let { id } = v.params
        if (id === ':id') {
          id = -1
          this.$router.push({
            name: 'module-index',
            params: { id: -1 },
            type: 'replace',
          })
        }
        this.listParams.parentId = id || -1
        this.fReload()
        this.fGetModuleInfo(this.listParams.parentId)
      },
      immediate: true,
    },
  },
  created() {
    this.isRefresh = this.steps.length === 1 && this.listParams.parentId !== -1
    if (this.isRefresh) {
      this.steps = []
    }
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload()
      })
    },
    fJumptoLevel(id) {
      if (id === this.$route.params.id) {
        return
      }
      this.$router.push({
        name: 'module-index',
        params: { id: id },
        type: 'replace',
      })
    },
    fGetModuleInfo(parentModuleId) {
      if (+parentModuleId === -1) {
        this.steps = [FirstStep]
        return
      }
      fGetModuleInfo(parentModuleId).then(res => {
        let module = res.data
        if (!module) {
          return
        }
        if (this.isRefresh) {
          this.steps.push({
            title: module.name,
            id: module.id,
          })
          if (module.parentId !== -1) {
            this.fGetModuleInfo(module.parentId)
          } else {
            this.steps.push(FirstStep)
            this.steps.reverse()
            this.isRefresh = false
          }
        } else {
          let includeStep = null
          let includeStepIndex = null
          this.steps.forEach((step, index) => {
            if (step.title === module.name) {
              includeStep = step
              includeStepIndex = index
            }
          })
          if (includeStep) {
            this.steps.splice(includeStepIndex + 1)
          } else {
            this.steps.push({
              title: module.name,
              id: module.id,
            })
          }
        }
      })
    },
    fCreate() {
      this.$router.push({
        name: 'modules-create',
        params: { id: this.$route.params.id || -1 },
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  min-width: 0px;
  .step-bar {
    margin: 10px 0 20px;
  }
}
</style>
