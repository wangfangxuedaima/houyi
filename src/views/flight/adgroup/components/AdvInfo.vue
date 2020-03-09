<template>
  <transition name="fade-bottom" mode="out-in">
    <div class="adv-info-tables" v-if="isShow && currentRow">
      <el-button @click="isShow = false" type="primary" size="small" class="adv-info-btn" plain>
        广告信息
        <i class="el-icon-caret-top"></i>
      </el-button>
      <el-table :data="currentRow" v-loading="bIsLoading" border style="max-height:400px;overflow: scroll;">
        <el-table-column align="center" v-for="column in columns" v-bind="column" :key="column.prop">
          <template slot-scope="{ row }">
            <span v-html="$options.filters.render(row, column)"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="操作">
          <template slot-scope="{ row }">
            <el-button
              v-if="currentGroup.plat === 0 && row.materials !== null"
              :adgroupPlat="currentGroup.plat"
              @click="fPreviewFlight(row.id)"
              type="primary"
              size="small"
              plain
            >
              预投放
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="预投放" :visible.sync="isPreviewDiaVisible" width="35%" center>
        <div class="preview-content">
          <label v-if="previewData.pagetype === 1">*请输入预览地址*</label>
          <label v-if="previewData.pagetype === 2">*请选择要预览的广告条并输入预览地址*</label>
          <el-input
            type="textarea"
            v-model="previewData.previewUrl"
            rows="4"
            class="preview-url"
            size="small"
          ></el-input>
          <el-select
            v-if="previewData.pagetype === 2"
            v-model="previewData.previewBarId"
            size="small"
            style="width:130px"
          >
            <el-option v-for="item in previewData.bars" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isPreviewDiaVisible = false" type="info" size="small" plain>取 消</el-button>
          <el-button :disabled="!previewData.previewUrl" @click="fGoPreview" type="primary" size="small" plain>
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
import { fGetAdvInfo, fFlightPreview } from "@/api/flight/adgroup";
import * as constantData from "@/utils/constant";
export default {
  data() {
    return {
      columns: [
        { prop: "id", label: "广告ID", "min-width": 60 },
        {
          prop: "materialId",
          label: "物料ID",
          "min-width": 80,
          formatter: (rowObject) => {
            let materials = this.fGetMaterials(rowObject);
            let vals = materials.map((item) => {
              return `<p>${item.id}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "type",
          label: "类型",
          "min-width": 100,
          formatter: (rowObject) => {
            let materials = this.fGetMaterials(rowObject);
            let vals = materials.map((item) => {
              return `<p>${constantData.MaterailTypeMap[item.type] || ""}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "autocasing",
          label: "自动套壳",
          "min-width": 80,
          formatter: (rowObject) => {
            let materials = this.fGetMaterials(rowObject);
            let vals = materials.map((item) => {
              return `<p>${item.autocasing == 1 ? "是" : "否"}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "area",
          label: "地域",
          "min-width": 60,
          formatter: (rowObject) => {
            let materials = this.fGetMaterials(rowObject);
            let vals = materials.map((item) => {
              return `<p>${constantData.AreaTypMap[item.area] || ""}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "size",
          label: "规格",
          "min-width": 80,
          formatter: (rowObject) => {
            let materials = this.fGetMaterials(rowObject);
            let vals = materials.map((item) => {
              return `<p>${item.width}*${item.height}</p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "path",
          label: "URL",
          "min-width": 200,
          formatter: (rowObject) => {
            let materials = this.fGetMaterials(rowObject);
            let vals = materials.map((item) => {
              return `<p><a href='${item.path}' target='_blank'>${item.path}</a></p>`;
            });
            return vals.join("");
          }
        },
        {
          prop: "time",
          label: "时长",
          "min-width": 60,
          formatter: (rowObject) => {
            let materials = this.fGetMaterials(rowObject);
            let vals = materials.map((item) => {
              return `<p>${item.time || ""}</p>`;
            });
            return vals.join("");
          }
        },
        { prop: "sort", label: "顺序", "min-width": 60 },
        { prop: "count", label: "次数", "min-width": 60 },
        {
          prop: "flightTime",
          label: "投放时间",
          "min-width": 250,
          formatter: (rowObject) => {
            if (rowObject.starttime && rowObject.endtime) {
              return `${rowObject.starttime} 00:00 ~ ${rowObject.endtime}  00:00`;
            }
            return "";
          }
        },
        { prop: "redirect", label: "GOTO跳转地址", "min-width": 200 },
        { prop: "customerredirect", label: "广告跳转地址", "min-width": 200 },
        { prop: "callback", label: "回调函数", "min-width": 160 },
        {
          prop: "monitions",
          label: "曝光地址",
          "min-width": 200,
          formatter: (rowObject) => {
            if (rowObject.monitions == null) {
              return "";
            }
            return rowObject.monitions
              .map((item) => {
                let time = item.time;
                if (time == null) {
                  time = "";
                } else {
                  if (time == -1) {
                    time = "开始";
                  } else if (time == -2) {
                    time = "结束";
                  }
                }
                return `<p>${time ? `${time}:` : ""} ${item.url}</p>`;
              })
              .join(",");
          }
        },
        {
          prop: "frequenciesId",
          label: "频次ID",
          "min-width": 100,
          formatter: (rowObject) => {
            if (rowObject.frequencies == null) {
              return "";
            }
            return rowObject.frequencies
              .map((item) => {
                return `<p>${item.id}</p>`;
              })
              .join(",");
          }
        },
        {
          prop: "frequenciesName",
          label: "频次名称",
          "min-width": 100,
          formatter: (rowObject) => {
            if (rowObject.frequencies == null) {
              return "";
            }
            return rowObject.frequencies
              .map((item) => {
                return `<p>${item.name}</p>`;
              })
              .join(",");
          }
        },
        {
          prop: "frequenciesType",
          label: "频次类型",
          "min-width": 80,
          formatter: (rowObject) => {
            if (rowObject.frequencies == null) {
              return "";
            }
            let types = rowObject.frequencies.map((item) => {
              return `<p>${constantData.FrequencieTypeMap[item.type] || "未知"}</p>`;
            });
            return types.join("");
          }
        },
        {
          prop: "frequenciesDuration",
          label: "频控周期",
          "min-width": 80,
          formatter: (rowObject) => {
            if (rowObject.frequencies == null) {
              return "";
            }
            let types = rowObject.frequencies.map((item) => {
              return `<p>${item.duration}</p>`;
            });
            return types.join("");
          }
        },
        {
          prop: "frequenciesNumber",
          label: "频控次数",
          "min-width": 80,
          formatter: (rowObject) => {
            if (rowObject.frequencies == null) {
              return "";
            }
            let types = rowObject.frequencies.map((item) => {
              return `<p>${item.number}</p>`;
            });
            return types.join("");
          }
        },
        {
          prop: "frequenciesIsAddFrequency",
          label: "追投",
          "min-width": 80,
          formatter: (rowObject) => {
            if (rowObject.frequencies == null) {
              return "";
            }
            let types = rowObject.frequencies.map((item) => {
              return `<p>${item.isAddFrequency == "1" ? "是" : "否"}</p>`;
            });
            return types.join("");
          }
        },
        {
          prop: "frequenciesAddFrequencyNum",
          label: "追投次数",
          "min-width": 80,
          formatter: (rowObject) => {
            if (rowObject.frequencies == null) {
              return "";
            }
            let types = rowObject.frequencies.map((item) => {
              return `<p>${item.addFrequencyNum == null ? "" : item.addFrequencyNum}</p>`;
            });
            return types.join("");
          }
        }
      ],
      bIsLoading: false,
      isShow: false,
      rowList: [], // 广告组信息数据数组
      currentRow: "",
      currentGroup: {},
      isPreviewDiaVisible: false,
      previewData: {}
    };
  },
  methods: {
    fSelectRow(row, reload = false) {
      if (!row.id) {
        return;
      }
      this.isShow = true;
      this.currentGroup = row;
      let rowIds = this.rowList.map((item) => {
        let groupid = item && item[0] && item[0].groupid;
        if (groupid === row.id) {
          this.currentRow = item;
        }
        return groupid;
      });
      // 未展示过
      if (!rowIds.includes(row.id) || reload) {
        this.bIsLoading = true;
        // 请求当前广告组下素材
        fGetAdvInfo(row.id).then((res) => {
          let data = res.rows.map((item) => {
            return { ...item, groupid: row.id };
          });
          this.rowList.push(data);
          this.currentRow = data;
          this.bIsLoading = false;
        });
      }
    },
    fGetMaterials(rowObject) {
      return [
        ...(rowObject.materials || []),
        ...(rowObject.floatMaterial || []),
        ...(rowObject.topViewMaterial ? [rowObject.topViewMaterial] : []),
        ...(rowObject.logoMaterial ? [rowObject.logoMaterial] : [])
      ];
    },
    //预投放
    fPreviewFlight(advId) {
      fFlightPreview(advId)
        .then((res) => {
          if (res.code !== 0) {
            this.$message({
              message: "预投放未成功，请检查关联排期包、物料是否有错！",
              type: "error"
            });
            return;
          }
          // 预览数据组装
          this.previewData = {
            pagetype: res.pagetype,
            adstyle: res.adstyle,
            bars: res.bars || [],
            previewUrl: "",
            previewBarId: res.bars && res.bars[0] && res.bars[0].id,
            advId: advId
          };
          this.isPreviewDiaVisible = true;
        })
        .catch(() => {
          this.$message({
            message: "操作失败！",
            type: "error"
          });
        });
    },
    fGoPreview() {
      let posId = "";
      this.previewData.bars.forEach((bar) => {
        if ((bar.id = this.previewData.previewBarId)) {
          posId = bar.posid;
        }
      });
      let token =
        this.previewData.pagetype === 1
          ? `#adreview_${this.previewData.adstyle}_0_${this.previewData.advId}`
          : `#adreview_${posId}_${this.previewData.previewBarId}_${this.previewData.advId}`;
      let url = `${this.previewData.previewUrl}${token}`;
      window.open(url, "target");
      this.isPreviewDiaVisible = false;
    }
  }
};
</script>
<style lang="scss">
.adv-info-tables {
  margin: 10px 0 30px;
  .adv-info-btn {
    margin-bottom: 12px;
  }
  .preview-url {
    margin: 10px 0;
  }
  .cell {
    white-space: nowrap;
    overflow: scroll;
  }
}
</style>
