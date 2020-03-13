<template>
  <div class="page-wraper">
    <header class="section-title">基本信息</header>
    <el-form :model="roleInfo"
      ref="userForm"
      :rules="rules"
      label-width="100px">
      <section class="section-main pd-l-10">
        <el-col :span="12"
          class="col">
          <el-form-item label="角色名称"
            class="label"
            prop="name">
            <el-input class="width280-imp"
              v-model.trim="roleInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="状态"
            prop="status"
            class="label">
            <status v-model="roleInfo.status"></status>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          class="col">
          <el-form-item label="Code"
            class="label"
            prop="code">
            <el-input class="width280-imp"
              v-model.trim="roleInfo.code"></el-input>
          </el-form-item>
        </el-col>
      </section>
    </el-form>
    <!-- 角色信息 -->
    <div class="permission">
      <header class="section-title">权限信息</header>
      <section class="pd-l-20">
        <tree-table v-loading="bModulesLoading"
          ref="modulesTable"
          :default-value="roleInfo.moduleList"
          :data="moduleList"
          :columns="moduleColumns">
          <el-table-column slot="selection"
            type="selection"
            align="center"
            width="100px"> </el-table-column>
        </tree-table>
      </section>
    </div>
    <button-group class="op">
      <el-button type="primary"
        @click="fSave">保存</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </button-group>
  </div>
</template>
<script>
import { detailMixins } from "@/mixins/index";
import TreeTable from "@/components/TreeTable";
import { fSaveRole, fGetRoleInfo } from "@/api/system/roles";
import { fGetModulesTree } from "@/api/system/modules";
export default {
  mixins: [detailMixins],
  components: { TreeTable },
  data() {
    return {
      id: this.$route.params.id || null,
      bModulesLoading: false,
      moduleColumns: [
        {
          text: "模块名称",
          value: "name"
        },
        {
          text: "URL",
          value: "url"
        }
      ],
      moduleList: [],
      rules: {
        name: {
          required: true,
          message: "角色名称不能为空",
          trigger: "blur"
        },
        code: {
          required: true,
          message: "code不能为空",
          trigger: "blur"
        }
      },
      roleInfo: { status: 0 }
    };
  },
  created() {
    if (this.isEdit) {
      this.fGetRole();
    }
    this.fGetPermission();
  },
  methods: {
    fGetRole() {
      fGetRoleInfo(this.id).then(res => {
        let role = res.data;
        if (!role) {
          this.$message({
            message: "无法查询到有效的角色信息！",
            type: "error"
          });
          this.fBack();
          return;
        }
        this.roleInfo = {
          ...role,
          status: +role.status,
          moduleList: (role.moduleList || "").split(",").map(v => v >> 0)
        };
      });
    },
    // 获取权限列表
    fGetPermission() {
      // type==0 时表示模块权限
      // 如果已经拉取过模块数据就不再拉取
      if (this.moduleList && this.moduleList.length) {
        return;
      }
      this.bModulesLoading = true;
      fGetModulesTree({ rootId: -1 })
        .then(
          res => {
            if (res.data) {
              const formatter = v => {
                v.children = v.childModule;
                delete v.childModule;
                v.pid = v.parentId;
                if (v.children) {
                  v.children.forEach(formatter);
                }
              };
              let rows = res.data.rows || [];
              rows.forEach(formatter);
              this.moduleList = rows;
            }
          },
          e => { }
        )
        .finally(() => {
          this.bModulesLoading = false;
        });
    },
    fSave() {
      this.fVelidateForm(this.$refs.userForm, () => {
        const moduleList = this.fGetSelectedModules()
          .map(v => v.id)
          .join(",");
        const obj = {
          ...this.roleInfo,
          moduleList
        };
        fSaveRole(obj, this.isCreate)
          .then(res => {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.fBack();
          })
          .catch(error => console.log(error));
      });
    },
    fGetSelectedModules() {
      return this.$refs.modulesTable.fGetSelection();
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  .section-main {
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

  .mg-b-10 {
    margin-bottom: 20px;
  }
}
</style>
