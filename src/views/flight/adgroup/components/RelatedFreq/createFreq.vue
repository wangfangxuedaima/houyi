<template>
  <create-view
    class="create-freq-wraper"
    v-model="data"
    :formItems="formItems"
    :buttons="buttons"
    label-position="right"
    label-width="120px"
    @submit="fSubmit"
  ></create-view>
</template>
<script>
import CreateView from "@/components/CreateView";
import { fAddFreq, fSaveFreq } from "@/api/flight/adgroup";
export default {
  components: { CreateView },
  data() {
    return {
      buttons: [{ name: "保存" }, { name: "重置", attrs: { type: "info" } }],
      data: {},
      projectId: this.$route.params.projectid // 执行单id
    };
  },
  computed: {
    formItems() {
      let pagetype =
        this.adgroups && this.adgroups[0] && this.adgroups[0].bartemplet && this.adgroups[0].bartemplet.pagetype;
      return [
        {
          type: "Input",
          prop: "name",
          formItemAttrs: {
            label: "频次名称",
            rules: [{ required: true, message: "请输入合法的频次名称！", trigger: "blur" }]
          },
          attrs: { clearable: true, size: "mini", style: "width: 200px" }
        },
        {
          type: "Radio",
          prop: "type",
          default: 1,
          formItemAttrs: { label: "频次类型" },
          data: [
            { text: "全周期", value: 1 },
            { text: "分钟", value: 2 },
            { text: "天", value: 3 }
          ]
        },
        {
          type: "Input",
          prop: "duration",
          formItemAttrs: {
            label: "频控周期",
            rules: [{ required: true, message: "频空周期必填", trigger: "blur" }]
          },
          attrs: { clearable: true, type: "number", style: "width: 120px" },
          ifRender: (data) => {
            return data.type && data.type != 1;
          }
        },
        {
          type: "Input",
          prop: "number",
          formItemAttrs: {
            label: "控频次数",
            rules: [{ required: true, message: "频空次数必填", trigger: "blur" }]
          },
          attrs: { clearable: true, type: "number", min: 0, style: "width: 120px" }
        },
        {
          type: "CheckBox",
          prop: "isAddFrequency",
          default: "",
          formItemAttrs: { label: "追投 " },
          attrs: {
            "true-label": "1",
            "false-label": ""
          }
        },
        {
          type: "Input",
          prop: "addFrequencyNum",
          formItemAttrs: {
            label: "追投次数",
            rules: [{ required: true, message: "追投次数必填", trigger: "blur" }]
          },
          attrs: { clearable: true, type: "number", min: 0, style: "width: 120px" },
          ifRender: (data) => {
            return data.isAddFrequency == 1;
          }
        },
        {
          type: "DataPicker",
          prop: "time",
          formItemAttrs: { label: "起止日期" },
          attrs: {
            clearable: true,
            type: "datetimerange",
            "start-placeholder": "开始日期",
            "end-placeholder": "结束日期",
            format: "yyyy-MM-dd",
            "value-format": "yyyy-MM-dd",
            style: "width: 260px"
          }
        },
        {
          type: "Select",
          prop: "pageType",
          default: pagetype,
          formItemAttrs: { label: "页面类型" },
          attrs: { style: "width: 200px" },
          data: [
            { datavalue: "1", dataname: "播放器", disabled: pagetype === "2" },
            { datavalue: "2", dataname: "页面", disabled: pagetype === "1" }
          ]
        }
      ];
    }
  },
  props: {
    adgroups: {
      type: Array,
      default: () => {
        return [];
      }
    },
    type: {
      type: Number,
      default: 1 //1 组频次 2 物料频次 3 推送频次
    }
  },
  methods: {
    fSubmit() {
      if (this.data.number > 10) {
        this.$confirm("控频次数大于10，请确认保存", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.fSaveFreq();
        });
      } else {
        this.fSaveFreq();
      }
    },
    async fSaveFreq() {
      let plat = this.adgroups[0].plat;
      let allAddFreqPromises = this.adgroups.map(() => {
        let time = this.data.time || [];
        let freq = {
          ...this.data,
          plat: plat,
          ftype: this.type == 3 ? 2 : 1,
          projectid: this.projectId,
          startTime: time[0] || "",
          endTime: time[1] || ""
        };
        return fAddFreq(freq);
      });
      let addFreqDatas = await Promise.all(allAddFreqPromises);
      let allBatchFreqPromises = (addFreqDatas || []).map((item, index) => {
        return fSaveFreq(this.adgroups[index].id, item.id);
      });
      try {
        let responseData = await Promise.all(allBatchFreqPromises);
        let data = responseData[0];
        if (data.status === 0) {
          this.$message({
            message: data.message,
            type: "success"
          });
          this.$emit("reload");
        }
      } catch (error) {
        this.$message({
          message: "请求出错了!",
          type: "error"
        });
      }
    }
  }
};
</script>
<style lang="scss">
.create-freq-wraper {
  .el-form-item {
    margin-bottom: 6px;
  }
  .el-form-item__content,
  .el-input__inner {
    height: 35px !important;
  }
}
</style>
