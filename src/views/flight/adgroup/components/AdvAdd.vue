<template>
  <el-dialog title="新建广告" :visible.sync="bIsVisible" width="360px">
    编号后缀:
    <el-input v-model="suffix" placeholder="输入广告后缀" size="small" style="width: 220px;margin-left: 5px"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="bIsVisible = false" type="info" size="small" plain>取 消</el-button>
      <el-button @click="fAddAdv" :disabled="confirmDisabled" type="primary" size="small" plain>
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import { fAddAdv } from "@/api/flight/adgroup";
export default {
  data() {
    return {
      suffix: "",
      confirmDisabled: false
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    adgroups: {
      type: Array,
      default: () => {
        return [];
      }
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
    fAddAdv() {
      let advList = this.adgroups.map((adgroup) => {
        return {
          adgroupId: adgroup.id,
          suffix: this.suffix,
          materialIds: [],
          pushFrequencyIds: [],
          groupFrequencyIds: [],
          frequencyIds: [],
          primerMaterialName: 1,
          monitions: [],
          starttime: "",
          endtime: "",
          starttimeStr: "2",
          endtimeStr: "2",
          callback: "",
          customerredirect: "",
          redirect: "",
          mclickstatistics: "",
          title: "",
          displaykeyword: "",
          skipseconds: "",
          skipmonitor: "",
          voiceProvider: "",
          successword: "",
          startskipseconds: "",
          isvpaid: "",
          vpaidurl: "",
          thirdPingBack: "",
          bgcolorForFocus: "",
          delay: "",
          cascadeIds: [],
          appjumpaddr: "",
          appjumpmaddr: "",
          downloadurl: "",
          adtemplate: "",
          imagetitle: "",
          imagesubtitle: ""
        };
      });
      this.confirmDisabled = true;
      fAddAdv(advList).then((res) => {
        this.confirmDisabled = false;
        this.bIsVisible = false;
        this.suffix = "";
        if (res.status === 0) {
          this.$message({
            message: "新建成功",
            type: "success"
          });
          this.$emit("addAdvSuccess");
          return;
        }
        this.$message({
          message: res.message || "新建失败",
          type: "error"
        });
      });
    }
  }
};
</script>
