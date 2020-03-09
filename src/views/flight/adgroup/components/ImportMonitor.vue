<template>
  <div class="import-mointor-wraper">
    <el-dialog title="批量导入监测" :visible.sync="bIsVisible" width="450px" class="import-mointor-dia">
      <div style="color:red;margin-bottom:10px">导入操作将会覆盖原有数据，请谨慎操作</div>
      <el-upload
        ref="fileUpload"
        :multiple="false"
        :action="''"
        :http-request="fUploadRequest"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="fChangeFile"
      >
        <el-button size="mini" type="primary" plain>点击上传</el-button>
        <el-tag v-if="fileName" type="info" size="small" class="file-name">
          {{ fileName }}
        </el-tag>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bIsVisible = false" type="info" size="small" plain>取 消</el-button>
        <el-button
          @click="fSubmitFile"
          :loading="bIsLoadingPreview"
          :disabled="!fileName"
          type="primary"
          size="small"
          plain
        >
          导入并预览
        </el-button>
      </span>
    </el-dialog>
    <el-dialog title="导入监测预览" :visible.sync="bIsShowPreview" width="1200px">
      <el-table :data="previewList" :cell-class-name="changeCellStyle" class="import-table" border>
        <el-table-column align="center" v-for="column in previewColumns" v-bind="column" :key="column.prop">
          <template slot-scope="{ row }">
            <span v-html="$options.filters.render(row, column)"></span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bIsShowPreview = false" type="info" size="small" plain>取 消</el-button>
        <el-button @click="fSubmitImport" type="primary" size="small" plain>导入</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="bIsShowConfirm" width="1200px">
      <div style="color:red;margin-bottom:10px">要导入的数据存在以下情形，请确定是否继续导入:</div>
      <el-table :data="confirmData.confirmList || []" class="import-table" border>
        <el-table-column align="center" v-for="column in confirmColumns" v-bind="column" :key="column.prop">
          <template slot-scope="{ row }">
            <span v-html="$options.filters.render(row, column)"></span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bIsShowConfirm = false" type="info" size="small" plain>取 消</el-button>
        <el-button @click="fConfirmImport" type="primary" size="small" plain>导入</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="bIsShowError" width="1200px">
      <div style="color:red;margin-bottom:10px">
        以下广告数据存在如下错误，不允许导入。你可以选择继续导入其他无误数据，或者就此取消所有导入，请确定:
      </div>
      <el-table :data="confirmData.errorList || []" class="import-table" border>
        <el-table-column align="center" v-for="column in errorColumns" v-bind="column" :key="column.prop">
          <template slot-scope="{ row }">
            <span v-html="$options.filters.render(row, column)"></span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bIsShowError = false" type="info" size="small" plain>取消导入</el-button>
        <el-button @click="fErrorGoConfirmImport" type="primary" size="small" plain>继续导入剩余正确数据</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fValidMonitorData, fValidMonitorDataSave } from "@/api/flight/adgroup";
export default {
  data() {
    return {
      previewColumns: [
        { prop: "id", label: "广告ID", "min-width": 60 },
        { prop: "customerredirect", label: "广告跳转地址", "min-width": 180 },
        {
          prop: "click",
          label: "第三方点击监测地址",
          "min-width": 180,
          formatter: (rowObject) => {
            let clicks = rowObject.click || [];
            let vals = clicks.map((item) => {
              return `<p>${item || ""}</p>`;
            });
            return vals.join("");
          }
        },
        { prop: "endMonition", label: "第三方结束曝光检测地址", "min-width": 180 },
        {
          prop: "timestr",
          label: "曝光时间",
          "min-width": 120,
          formatter: (rowObject) => {
            let monitions = rowObject.monitions || [];
            let vals = monitions.map((item) => {
              return `<p>${item.timestr || ""}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "company",
          label: "上报公司",
          "min-width": 120,
          formatter: (rowObject) => {
            let monitions = rowObject.monitions || [];
            let vals = monitions.map((item) => {
              return `<p>${item.company || ""}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "address",
          label: "第三方曝光监测地址",
          "min-width": 360,
          formatter: (rowObject) => {
            let monitions = rowObject.monitions || [];
            let vals = monitions.map((item) => {
              let address = item.address || "";
              if (address && item.checktongyuan == 1) {
                //有监测代码  但是代码不是同源代码
                address = "不是同源机房代码";
              }
              return `<p>${address}</p>`;
            });
            return vals.join("");
          }
        },
        { prop: "appjumpaddr", label: "app跳转地址", "min-width": 180 },
        { prop: "appjumpmaddr", label: "app跳转监测地址", "min-width": 180 }
      ],
      confirmColumns: [
        { prop: "advid", label: "广告id", "min-width": 60 },
        {
          prop: "type",
          label: "地址名称",
          "min-width": 60,
          formatter: (rowObject) => {
            let msgMap = rowObject.confimMsg || [];
            let vals = Object.keys(msgMap).map((key) => {
              let val = key.split("#\\#")[0];
              return `<p>${val || ""}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "url",
          label: "地址",
          "min-width": 60,
          formatter: (rowObject) => {
            let msgMap = rowObject.confimMsg || [];
            let vals = Object.keys(msgMap).map((key) => {
              let val = key.split("#\\#")[1];
              return `<p>${val || ""}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "confimMsg",
          label: "错误或警告信息",
          "min-width": 60,
          formatter: (rowObject) => {
            let msgMap = rowObject.confimMsg || [];
            let vals = Object.keys(msgMap).map((key) => {
              return `<p>${msgMap[key] || ""}</p>`;
            });
            return vals.join("");
          }
        }
      ],
      errorColumns: [
        { prop: "advid", label: "广告id", "min-width": 60 },
        {
          prop: "type",
          label: "地址名称",
          "min-width": 60,
          formatter: (rowObject) => {
            let msgMap = rowObject.errorMsg || [];
            let vals = Object.keys(msgMap).map((key) => {
              let val = key.split("#\\#")[0];
              return `<p>${val || ""}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "url",
          label: "地址",
          "min-width": 60,
          formatter: (rowObject) => {
            let msgMap = rowObject.errorMsg || [];
            let vals = Object.keys(msgMap).map((key) => {
              let val = key.split("#\\#")[1];
              return `<p>${val || ""}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "confimMsg",
          label: "错误或警告信息",
          "min-width": 60,
          formatter: (rowObject) => {
            let msgMap = rowObject.errorMsg || [];
            let vals = Object.keys(msgMap).map((key) => {
              return `<p>${msgMap[key] || ""}</p>`;
            });
            return vals.join("");
          }
        }
      ],
      fileName: "",
      previewList: [],
      confirmData: {},
      bIsLoadingPreview: false,
      bIsShowPreview: false,
      bIsShowConfirm: false,
      bIsShowError: false
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bIsVisible: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    fSubmitFile() {
      this.$refs.fileUpload.submit();
      this.$refs.fileUpload.clearFiles();
    },
    fChangeFile(param) {
      this.fileName = param.name;
    },
    fUploadRequest(param) {
      let fileUploadUrl = "/d/advertisement/importMonitorData";
      let allowFileTypes = ["xls", "xlsx"];

      let file = param.file;
      // 类型检查
      let fileSplits = file.name.split(".");
      let fileType = fileSplits[fileSplits.length - 1];
      if (!allowFileTypes.includes(fileType)) {
        this.$message.error("请使用excel文件导入！");
        return;
      }
      this.bIsLoadingPreview = true;

      var formData = new FormData();
      formData.append("importMonitorFile", file);
      var xhr = new XMLHttpRequest();
      xhr.open("post", fileUploadUrl, true);
      xhr.onload = () => {
        let response = JSON.parse(xhr.response);
        if (response.status === "200" && response.data) {
          this.previewList = response.data || [];
          this.bIsShowPreview = true;
        } else {
          this.$message.error("上传过程中发生错误请重新上传～");
        }
        this.bIsVisible = false;
        this.bIsLoadingPreview = false;
        this.fileName = "";
      };
      xhr.onerror = () => {
        this.$message.error("上传过程中发生错误请重新上传～");
      };
      xhr.send(formData);
    },
    changeCellStyle({ row, column }) {
      let colorColumns = ["click", "company", "address"];
      if (column.property === "customerredirect" && !row[column.property]) {
        return "notice-red-cell";
      }
      let mointor = row.monitions && row.monitions[0];
      if (colorColumns.includes(column.property) && !mointor[column.property]) {
        return "notice-red-cell";
      }
    },
    fSubmitImport() {
      fValidMonitorData().then((res) => {
        if (res.status === "200") {
          let isError = false;
          this.confirmData = res;
          if (res.errorList) {
            isError = true;
            this.bIsShowPreview = false;
            this.bIsShowError = true;
          }
          if (!isError) {
            if (res.confirmList) {
              this.bIsShowPreview = false;
              this.bIsShowConfirm = true;
            } else {
              this.$message.error("没有数据可以导入");
            }
          }
        } else {
          this.$message.error(res.errMessage || "");
        }
      });
    },
    fErrorGoConfirmImport() {
      if (!this.confirmData.confirmList) {
        this.$message.warning("已经没有正确数据可以导入！");
      } else {
        this.bIsShowError = false;
        this.bIsShowConfirm = true;
      }
    },
    fConfirmImport() {
      fValidMonitorDataSave()
        .then((res) => {
          this.$message({
            message: res.status == "200" ? res.successMsg : res.errMessage,
            type: res.status == "200" ? "success" : "error"
          });
          this.bIsShowConfirm = false;
        })
        .catch(() => {
          this.bIsShowConfirm = false;
          this.$message({
            message: "保存导入数据时发生异常，请重试或联系系统管理员！",
            type: "info"
          });
        });
    }
  }
};
</script>
<style lang="scss">
.import-mointor-wraper {
  .import-mointor-dia {
    .file-name {
      width: 300px;
      overflow: scroll;
      vertical-align: -8px;
      margin-left: 10px;
    }
  }
  .import-table {
    max-height: 400px;
    overflow: scroll;
    .notice-red-cell {
      background: #ffe4e1;
    }
    .cell {
      white-space: nowrap;
      overflow: scroll;
    }
  }
}
</style>
