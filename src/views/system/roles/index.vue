<template>
  <div class="page-wraper">
    <div class="op-bar">
      <el-button type="success"
        icon="el-icon-plus"
        @click="$router.push('/system/roles/create')">新增角色</el-button>
    </div>
    <pagination-pro :loading.sync="bIsLoading"
      ref="pageRef"
      url="/system/roles"
      :autoload="false"
      :params="listParams">
      <template slot-scope="{ data }">
        <el-table :data="data"
          v-loading="bIsLoading"
          ref="rolesTable"
          border
          header-cell-class-name="table-header">
          <el-table-column show-overflow-tooltip
            align="center"
            v-for="v in columns"
            v-bind="v"
            :key="v.prop">
            <template slot-scope="{ row }">
              {{ row | render(v) }}
            </template>
          </el-table-column>
          <el-table-column prop="status"
            align="center"
            min-width="80px"
            label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{
                scope.row.status | roleStatus
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
            align="center"
            width="160px"
            label="操作">
            <template slot-scope="{ row }">
              <el-button size="mini"
                class="inline-block"
                type="primary"
                @click="$router.push('/system/roles/edit/' + row.id)">编辑</el-button>
              <el-button size="mini"
                class="inline-block"
                type="danger"
                @click="fDeleteRole(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pagination-pro>
  </div>
</template>
<script>
import { listMixins } from '@/mixins/index'
import { fDeleteRole } from '@/api/system/roles'
export default {
  mixins: [listMixins],
  data() {
    return {
      bIsLoading: false,
      listParams: {},
      columns: [
        {
          prop: 'name',
          label: '角色名称',
          'min-width': 150,
        },
        {
          prop: 'code',
          label: 'code',
          'min-width': 150,
        },
        {
          prop: 'creator',
          label: '创建人',
          'min-width': 150,
        },
        {
          prop: 'createTime',
          label: '创建时间',
          'min-width': 150,
        },
      ],
    }
  },
  created() {
    this.fReload()
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload()
      })
    },
    fDeleteRole(id) {
      this.$confirm('确定删除此角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        fDeleteRole(id).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.fReload()
          }
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.page-wraper {
  min-width: 0px;
  .op-bar {
    margin-bottom: 20px;
  }
}
</style>
