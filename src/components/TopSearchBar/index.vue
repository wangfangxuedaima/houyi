<template>
  <div class="top-search-bar">
    <el-card :shadow="config.cardShadow || 'never'">
      <operation-buttons class="before-btns" :buttons="topBtns" :isFloat="false" :align="'left'" @operate="fOperation">
        <div v-for="(slot, index) in slotList" :key="index" :slot="slot">
          <slot :name="slot"></slot>
        </div>
      </operation-buttons>
      <label v-if="config.defaultSearch" style="font-size: 12px;">
        {{ config.defaultSearch.label }}
      </label>
      <search
        v-if="config.defaultSearch"
        :isAdvanceSearch="searchBtns.length > 0"
        class="advance-search"
        v-model="searchObject[config.defaultSearch.key]"
        ref="search"
        :placeholder="config.defaultSearch.placeholder"
        @on-search="fSearch"
        @on-push-down="bIsShowMoreSearch = !bIsShowMoreSearch"
      ></search>
      <div class="search-right-slot">
        <slot name="search-right"></slot>
      </div>

      <transition name="el-fade-in-linear">
        <!-- 输入区 -->
        <div class="search-detail-wrap" v-show="bIsShowMoreSearch">
          <el-form
            :model="searchObject"
            :label-width="config.labelWidth || '120px'"
            label-position="right"
            ref="searchForm"
            :inline="true"
            size="small"
          >
            <el-form-item
              v-for="(item, index) in _formItems || []"
              :key="index"
              :prop="item.prop"
              v-bind="item.formItemAttrs"
            >
              <component :config="item" v-bind="item.attrs" v-model="searchObject[item.prop]" :is="item.type" />
            </el-form-item>
            <!-- 操作按钮 -->
            <el-form-item style="height: 35px;">
              <operation-buttons
                :buttons="searchBtns"
                :isFloat="false"
                :align="'center'"
                @operate="fOperation"
              ></operation-buttons>
            </el-form-item>
          </el-form>
        </div>
      </transition>
    </el-card>
  </div>
</template>
<script>
import Search from "../Search";
import { omit } from "lodash";
import { detailMixins } from "@/mixins";

import OperationButtons from "@/components/OperationButtons";
import Input from "./components/InputComponent.vue";
import Select from "./components/SelectComponent.vue";
import DataPicker from "./components/DataPickerComponent.vue";
import Radio from "./components/RadioComponent.vue";
import Cascader from "./components/CascaderComponent.vue";
import CheckBox from "./components/CheckBoxComponent.vue";

export default {
  mixins: [detailMixins],
  components: {
    Search,
    Radio,
    Cascader,
    DataPicker,
    Select,
    Input,
    CheckBox,
    OperationButtons
  },
  data() {
    return {
      bIsShowMoreSearch: false,
      searchObject: {}
    };
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          cardShadow: "always",
          labelWidth: "",
          topButtons: [],
          searchButtons: [],
          defaultSearch: {
            placeholder: "请输入",
            key: "name" // 默认的搜索字段
          },
          searchItems: []
        };
      }
    }
  },
  computed: {
    // 根据formItem计算出实际需要让页面渲染的真正的_formItem数据
    _formItems() {
      let formItem = (this.config.searchItems || []).filter((item) => {
        return !item.hidden;
      });
      return formItem
        .map((item) => {
          return this.computeFormItem(item, this.searchObject);
        })
        .filter((item) => item._ifRender);
    },
    // 收集页面中的所有slot
    slotList() {
      return this.topBtns
        .map((item) => {
          return item.popover && item.popover.slotName;
        })
        .filter((item) => !!item);
    },
    topBtns() {
      return this.config.topButtons ? this.config.topButtons : [];
    },
    searchBtns() {
      return this.config.searchButtons
        ? this.config.searchButtons
        : [{ name: "查询" }, { name: "清空", attrs: { type: "info" } }];
    }
  },
  watch: {
    searchObject: {
      // 深度监听
      handler: function() {
        if (this.config.searchImmediate) {
          this.fSearch();
        } else {
          this.$emit("fGetEmitSearchObj", this.fGetEmitSearchObj());
        }
      },
      deep: true
    }
  },
  mounted() {
    this.bIsShowMoreSearch = !this.config.defaultSearch;
    setTimeout(() => {
      this.fResetData();
    }, 1000);
  },
  methods: {
    computeFormItem(formItem, data) {
      const item = { ...formItem };
      // 获取动态 Attributes
      if (item.getAttrs) {
        item.attrs = Object.assign(item.attrs, item.getAttrs(data));
      }
      // 条件渲染
      item._ifRender = item.ifRender ? item.ifRender(data) : true;
      return item;
    },
    fOperation(item) {
      if (["查询", "搜索"].includes(item.name)) {
        this.fSearch();
      } else if (["清空", "重置"].includes(item.name)) {
        this.fResetData();
      } else if (item.routerLink) {
        this.$router.push(item.routerLink);
      } else {
        if (item.valid) {
          this.fVelidateForm(this.$refs.searchForm, () => {
            this.$emit("operate", item, this.fGetEmitSearchObj());
          });
        } else {
          this.$emit("operate", item, this.fGetEmitSearchObj());
        }
      }
    },
    fSearch() {
      if (this.config.valid) {
        this.fVelidateForm(this.$refs.searchForm, () => {
          this.$emit("fSearch", this.fGetEmitSearchObj());
        });
      } else {
        this.$emit("fSearch", this.fGetEmitSearchObj());
      }
    },
    fGetEmitSearchObj() {
      let emitSearchObject = { ...this.searchObject };
      // DateRange 数据处理
      this._formItems.forEach((item) => {
        if (item.attrs.type === "daterange") {
          let dates = emitSearchObject[item.prop];
          if (dates && dates.length === 2) {
            emitSearchObject = omit(emitSearchObject, item.prop);
            emitSearchObject[item.startTimeKey] = dates[0];
            emitSearchObject[item.endTimeKey] = dates[1];
          }
        }
      });
      return emitSearchObject;
    },
    fSetSearchVal(obj) {
      this.searchObject = { ...this.searchObject, ...obj };
    },
    fResetData() {
      const defaultValueMap = {
        Select: "",
        DataRange: [],
        Input: "",
        Radio: 0,
        CheckBox: 0
      };
      let newObj = { ...this.originalSearchObj };
      this._formItems.forEach((item) => {
        let value = item.default || defaultValueMap[item.type];
        if (item.type === "Select") {
          value = item.attrs && item.attrs.multiple ? [] : "";
        }
        if (item.type === "DataRange") {
          value = item.attrs && item.attrs.type.includes("range") ? [] : "";
        }
        newObj[item.prop] = value;
      });
      this.searchObject = newObj;
    }
  }
};
</script>
<style lang="scss">
.top-search-bar {
  margin-bottom: 5px;
  .el-card {
    border: 0;
    .el-card__body {
      padding: 5px 5px 0;
      .el-button {
        font-size: 12px;
      }
    }
  }
  .search-right-slot {
    display: inline-block;
    width: 195px;
    margin-left: 10px;
  }
  .op {
    display: inline-block;
    margin-top: 0px;
    vertical-align: bottom;
  }
  .search-detail-wrap {
    display: inline-block;
    margin-bottom: 10px;
    .el-form--inline .el-form-item {
      vertical-align: bottom !important;
      margin-bottom: 6px;
    }
  }
  .before-btns {
    margin-bottom: 10px;
  }
  .advance-search {
    margin-bottom: 10px;
    margin-left: 0 !important;
  }
  .el-form-item__label {
    font-size: 12px;
  }
}
</style>
