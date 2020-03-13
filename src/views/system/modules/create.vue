<template>
  <div class="module-create-wrap">
    <create-view v-model="OModule"
      :formItems="formItems"
      label-position="right"
      label-width="120px"
      @submit="fSaveModule"></create-view>
    <!-- <create-view v-model="OModule"
      :config="configList"
      @submit="fSaveModule"></create-view> -->
  </div>
</template>
<script>
import { detailMixins } from '@/mixins/index'
import {
  fGetModuleInfo, fSaveModule,
} from '@/api/system/modules'
import CreateView from '@/components/CreateView'

import { omit } from 'lodash'

export default {
  mixins: [detailMixins],
  components: { CreateView },
  data() {
    return {
      OModule: {
        parentId: this.$route.params.id,
        url: '/',
        level: 1,
      },
      formItems: [
        {
          type: 'Section',
          title: '基本信息', // 部分标题
          hidden: false,
          prop: 'base',
        },
        {
          type: 'Input',
          prop: 'parentName',
          span: 14,
          hidden: this.$route.meta.action === 'edit',
          formItemAttrs: {
            label: '上级模块',
          },
          attrs: {
            disabled: true,
          }
        },
        {
          type: 'Input',
          prop: 'name',
          span: 14,
          formItemAttrs: {
            label: '名称',
            rules: [
              {
                required: true, message: '名称必填', trigger: 'blur',
              },
            ],
          },
        },
        {
          type: 'Input',
          prop: 'url',
          span: 14,
          formItemAttrs: {
            label: '前端地址',
            rules: [
              {
                required: true, message: '前端地址必填', trigger: 'blur',
              },
            ],
          },
        },
        {
          type: 'Input',
          prop: 'code',
          span: 14,
          formItemAttrs: {
            label: 'CODE',
            rules: [
              {
                required: true, message: 'CODE必填', trigger: 'blur',
              },
            ],
          },
        },
        {
          type: 'Input',
          prop: 'note',
          span: 14,
          formItemAttrs: {
            label: '备注',
          },
          attrs: {
            type: 'textarea',
            rows: 3,
          }
        },
      ],
    }
  },
  created() {
    this.fGetModuleInfo()
  },
  methods: {
    fGetModuleInfo() {
      if (+this.$route.params.id === -1) {
        return
      }
      fGetModuleInfo(this.$route.params.id).then(res => {
        let module = res.data
        if (!module) {
          return
        }
        if (this.isEdit) {
          this.OModule = {
            ...this.OModule,
            ...module,
          }
        } else if (this.isCreate) {
          this.OModule = {
            ...this.OModule,
            url: module.url === '/' ? '/' : `${module.url}/`,
            parentName: module.name,
            parentId: module.id,
            level: module.level++,
          }
        }
      })
    },
    fSaveModule() {
      this.OModule = this.isCreate ? omit(this.OModule, 'parentName') : this.OModule
      fSaveModule(this.OModule, this.isCreate).then(response => {
        if (response.code === 200) {
          this.$message({
            message: this.isEdit ? '修改成功' : '添加成功',
            type: 'success',
          })
        }
        this.$router.back()
      }).catch(e => {
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  .section-main {
    width: 50%;
    min-width: 500px;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }

  .section-title {
    letter-spacing: 1.5px;
    font-size: 16px;
    font-weight: 700;
    color: #606266;
    line-height: 40px;
    padding-bottom: 10px;
    color: #409eff;
  }
  .op {
    margin-top: 20px;
    text-align: center;
  }
  .select {
    width: 100%;
  }

  .label {
    color: #606266;
  }
}
</style>
