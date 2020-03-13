<template>
  <div class="page-wraper">
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"></top-search-bar>
    <pagination-pro ref="pageRef"
      :loading.sync="blistLoading"
      :autoload="false"
      url="/system/users"
      method="get"
      :params="searchObject">
      <template slot-scope="{ data }">
        <el-table :data="data"
          v-loading="blistLoading"
          ref="usersTable"
          border
          header-cell-class-name="table-header">
          <el-table-column show-overflow-tooltip
            prop="username"
            align="center"
            min-width="200"
            label="用户名">
            <template slot-scope="{ row }">
              <row-pop-view :info="row | popViewInfo"
                @fReload="fReload"></row-pop-view>
            </template>
          </el-table-column>
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
        </el-table>
      </template>
    </pagination-pro>
  </div>
</template>
<script>
import { listMixins } from '@/mixins/index'
import { fDeleteUser } from '@/api/system/users'
import TopSearchBar from '@/components/TopSearchBar'
import RowPopView from '@/components/RowPopView'

export default {
  mixins: [listMixins],
  name: 'user-index',
  components: {
    TopSearchBar,
    RowPopView,
  },
  data() {
    return {
      blistLoading: false,
      allRoles: {},
      searchItems: {
        topButtons: [
          {
            name: '新建用户',
            type: 'primary',
            icon: 'el-icon-plus',
            routerLink: '/system/users/create',
          },
        ],
        defaultSearch: {
          placeholder: '请输入用户名,按回车搜索',
          key: 'username', // 默认的搜索字段
        },
        searchButtons: [],
      },
      columns: [
        {
          prop: 'name',
          label: '用户昵称',
          'min-width': 120,
        },
        {
          prop: 'roleNameList',
          label: '角色',
          'min-width': 160,
        },
        {
          prop: 'creator',
          label: '创建人',
          'min-width': 150,
        },
      ],
      searchObject: { name: null },
    }
  },
  filters: {
    popViewInfo: row => {
      return {
        detail: {
          pemissionUrl: '/system/users/edit/:id',
          link: `/system/users/edit/${row.id}`,
          val: row.username,
        },
        operationList: [
          {
            name: '修改',
            link: `/system/users/edit/${row.id}`,
            pemissionUrl: '/system/users/edit/:id',
            type: 'primary',
          },
          {
            name: '删除',
            type: 'danger',
            isHidden: row.type === 2,
            pemissionUrl: '/system/users/delete',
            operation: {
              reqFunction: fDeleteUser,
              reqParam: { id: row.id },
              confirmMessage: '将删除此用户，请确定是否执行',
              emitName: 'fReload',
            },
          },
        ],
      }
    },
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
    fSearch(val) {
      this.searchObject = { ...val }
      this.fReload()
    },
  },
}
</script>
<style lang="scss" scoped>
.user-index-wraper {
  min-width: 0px;
}
</style>
