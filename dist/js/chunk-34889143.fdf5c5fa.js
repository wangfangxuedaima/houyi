(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-34889143"],{"0a42":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"page-wraper fullsize fullsize-flex advproject-page"},[a("div",{staticClass:"card"},[a("top-search-bar",{ref:"searchRef",attrs:{config:e.searchItems},on:{operate:function(t){return e.foperate(arguments)}}}),a("top-search-bar",{ref:"searchRef2",attrs:{config:e.searchItems2},on:{fSearch:e.fSearch2}})],1),a("pagination-pro",{ref:"pageRef",staticClass:"mg-t-10 grow-1",attrs:{loading:e.bIsLoading,autoload:!1,fullsize:!0,"page-size":15,url:"d/advbookpkg/list",params:e.searchObject},on:{"update:loading":function(t){e.bIsLoading=t}},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.height;return[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.bIsLoading,expression:"bIsLoading"}],attrs:{data:e.advbookpkgList,height:r,"header-cell-class-name":"table-header","row-class-name":e.tableRowClassName,border:""},on:{"selection-change":e.handleSelectionChange,"row-click":e.fClickRow}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),e._l(e.columns,(function(t){return a("el-table-column",e._b({key:t.prop,attrs:{align:"center","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(r){var n=r.row;return[a("span",[e._v(e._s(e._f("render")(n,t)))])]}}],null,!0)},"el-table-column",t,!1))})),a("el-table-column",{attrs:{fixed:"right",align:"center",label:"模板类型",width:"250px","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[a("el-select",{attrs:{placeholder:"请选择"},model:{value:r.styleArrVal,callback:function(t){e.$set(r,"styleArrVal",t)},expression:"row.styleArrVal"}},e._l(r.styleArr,(function(e){return a("el-option",{key:e.templateId,attrs:{label:e.name,value:e.templateId}})})),1)]}}],null,!0)})],2)]}}])}),a("el-dialog",{attrs:{title:"拆包选项",visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{attrs:{model:e.unpack}},[a("el-form-item",{attrs:{label:"拆包维度","label-width":"100px"}},[a("el-radio-group",{model:{value:e.unpack.resource,callback:function(t){e.$set(e.unpack,"resource",t)},expression:"unpack.resource"}},[a("el-radio",{attrs:{label:"按排期拆包"}}),a("el-radio",{attrs:{label:"自定义拆包"}})],1)],1),a("el-form-item",{attrs:{label:"广告组后缀","label-width":"100px"}},[a("el-input",{attrs:{"aria-placeholder":"广告组后缀"},model:{value:e.unpack.name,callback:function(t){e.$set(e.unpack,"name",t)},expression:"unpack.name"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.doUnPack}},[e._v("确 定")])],1)],1)],1)},n=[],i=(a("a623"),a("4de4"),a("7db0"),a("4160"),a("c975"),a("277d"),a("a15b"),a("d81d"),a("0d03"),a("b0c0"),a("b64b"),a("d3b7"),a("ac1f"),a("25f0"),a("3ca3"),a("1276"),a("2ca0"),a("159b"),a("ddb0"),a("3835")),l=(a("96cf"),a("1da1")),o=a("46f1"),s=a("1b62");var c=a("0c6d");function p(){return Object(c["a"])({url:"d/adstyle/all",method:"get"})}function d(){return Object(c["a"])({url:"d/basedata/allAdTime",method:"get"})}function u(){return Object(c["a"])({url:"d/plat/all",method:"get"})}function f(){return Object(c["a"])({url:"/d/godtemplate/listAll",method:"post"})}function m(e){return Object(c["a"])({url:"d/advbookpkg/list",method:"post",dataType:"formData",params:e})}function h(e){return Object(c["a"])({url:"d/adgroup/manualEdit",method:"post",dataType:"formData",data:e})}function b(e,t){return Object(c["a"])({url:"d/advproject/getDirects",method:"post",dataType:"formData",data:{_id:e,ids:t}})}var g={name:"bpList",mixins:[s["c"]],components:{TopSearchBar:o["a"]},data:function(){return{advbookpkgList:[],hangleSections:[],parameter:{},unpack:{},dialogFormVisible:!1,searchItems:{labelWidth:"75px",searchItems:[{type:"Input",prop:"adgroupname",formItemAttrs:{label:"广告组名称"},attrs:{clearable:!0,style:"width:150px"}},{type:"Input",prop:"sufffix",formItemAttrs:{label:"广告组后缀"},attrs:{clearable:!0,style:"width:150px"}},{type:"Select",prop:"adgrouptype",default:"0",formItemAttrs:{label:"广告组类型","label-width":"80px"},attrs:{placeholder:"广告组类型",style:"max-width:150px"},data:[{datavalue:"0",dataname:"普通线"},{datavalue:"1",dataname:"故事线"}]}],searchButtons:[{name:"保存"},{name:"拆包"},{name:"未拆包排期包"}]},searchItems2:{labelWidth:"75px",defaultSearch:{placeholder:"搜索内容后请敲回车键...",key:"FCNBSearch",label:"所有排期包"},searchItems:[{type:"Input",prop:"pkgname",formItemAttrs:{label:"排期包名称"},attrs:{clearable:!0,style:"width:150px"}},{type:"Select",prop:"basedata_type_adstyle",formItemAttrs:{label:"广告形式"},attrs:{clearable:!0,style:"width:150px"},dataConfig:{optionName:"name",optionValue:"code"},data:[]},{type:"Select",prop:"duration",formItemAttrs:{label:"广告时长"},attrs:{clearable:!0,style:"width:150px"},data:[]},{type:"Select",prop:"queryPlatId",formItemAttrs:{label:"平台"},attrs:{clearable:!0,style:"width:150px",multiple:!0,"collapse-tags":!0},dataConfig:{optionName:"platname",optionValue:"ccode"},data:[]},{type:"Select",prop:"usetype",formItemAttrs:{label:"使用属性"},attrs:{clearable:!0,style:"width:150px"},data:[{dataname:"售卖",datavalue:"1"},{dataname:"配送",datavalue:"2"},{dataname:"补偿",datavalue:"3"},{dataname:"推广",datavalue:"4"},{dataname:"补量",datavalue:"5"}]},{type:"Input",prop:"areaDirectSpace",triggerFocus:!0,formItemAttrs:{label:"地域定向"},attrs:{clearable:!0,style:"width:150px"}},{type:"DataPicker",prop:"searchTimeStart",startTimeKey:"starttime",endTimeKey:"endtime",formItemAttrs:{label:"投放日期"},attrs:{clearable:!0,style:"width:350px",type:"daterange","start-placeholder":"开始日期","end-placeholder":"结束日期",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd"}},{type:"Input",prop:"searchNote",formItemAttrs:{label:"备注"},attrs:{clearable:!0,style:"width:150px"}}]},GodTemplateConfig:{},bIsLoading:!1,searchObject:{projectid:12386},curentSelect:"",columns:[{prop:"id",label:"排期包ID","min-width":80,fixed:"left"},{prop:"pkgname",label:"排期包名称","min-width":180},{prop:"platname",label:"平台","min-width":180},{prop:"cpmResourceName",label:"内容","min-width":120},{prop:"hdName",label:"小时/分钟","min-width":110},{prop:"areaName",label:"地域","min-width":110},{prop:"duration",label:"广告时长","min-width":120},{prop:"adStyleName",label:"广告形式","min-width":130},{prop:"createTime",label:"创建时间",filter:"time","min-width":130},{prop:"saletypeName",label:"售卖方式"},{prop:"note",label:"备注"},{prop:"timearea",label:"投放时间"},{prop:"usetype",label:"使用属性",filter:"usetype"},{prop:"realprice",label:"折后单价"}]}},watch:{},created:function(){this.getTemplates(),this.fGetadvbookpkg(),this.getAllDict()},methods:{fReload:function(){var e=this;this.$nextTick((function(){e.$refs.pageRef.fReload()}))},fGetadvbookpkg:function(e){var t=this;return Object(l["a"])(regeneratorRuntime.mark((function a(){var r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,m(Object.assign({projectid:12386},e));case 2:r=a.sent,t.advbookpkgList=r.rows,r.rows.forEach((function(e){var a=[],r=Object.keys(t.GodTemplateConfig);r.forEach((function(r){var n=t.GodTemplateConfig[r];r.startsWith(e.adStyle+"_",0)&&n.plats.split(",").indexOf(e.plat.toString())>-1&&(n["templateId"]=r,a.push(n))})),e.activeAdType?e.styleArr=a.filter((function(t){return+t.activeAdType===e.activeAdType})):e.styleArr=a.filter((function(e){return!e.activeAdType}))}));case 5:case"end":return a.stop()}}),a)})))()},getAllDict:function(){var e=this,t=this.searchItems2.searchItems;Promise.all([p(),d(),u()]).then((function(a){var r=Object(i["a"])(a,3),n=r[0],l=r[1],o=r[2],s=e.findSearchItem(t,"basedata_type_adstyle"),c=e.findSearchItem(t,"duration"),p=e.findSearchItem(t,"queryPlatId");e.$set(s,"data",JSON.parse(n)),e.$set(c,"data",JSON.parse(l)),e.$set(p,"data",JSON.parse(o))}))},getTemplates:function(){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,f();case 2:a=t.sent,a.forEach((function(t){e.GodTemplateConfig[t.keyid]=JSON.parse(t.template),e.GodTemplateConfig[t.keyid].activeAdType=t.activeAdType}));case 4:case"end":return t.stop()}}),t)})))()},onSubmit:function(){},fClickRow:function(e){this.curentSelect=e},findSearchItem:function(e,t){if(Array.isArray(e))return e.find((function(e){return e.prop===t}))},foperate:function(e){"保存"===e[0].name&&this.fsave(e[1]),"未拆包排期包"===e[0].name&&this.fSearchTable(),"拆包"===e[0].name&&this.unpackage()},fsave:function(e){var t=this;if(0===this.hangleSections.length)this.$message.error("请选择要关联的排期包");else{var a=this.isEqual(this.hangleSections,"styleArrVal");if(a){"oad"!==this.hangleSections[0].adStyle&&"1"===e.adgrouptype&&this.$message.error("只有前贴片的排期包可以管理故事线广告组，以下排期包不符合要求");var r=this.hangleSections.map((function(e){return e.id})).join(",");this.parameter={bpids:r,projectid:12386,templateId:this.hangleSections[0].styleArrVal,name:e.adgroupname||"",type:e.adgrouptype||"",suffix:e.sufffix||""},h(this.parameter).then((function(e){0===e.status||t.$message.error(e.message)}))["catch"]((function(e){console.log(e)}))}else this.$message.error("选择的排期包广告形式不同")}},fSearchTable:function(){this.searchObject=Object.assign(this.searchObject,{isRGroup:1}),this.fGetadvbookpkg(this.searchObject)},unpackage:function(){if(0===this.hangleSections.length)this.$message.error("请选择要拆的排期包");else{this.dialogFormVisible=!0;var e=this.hangleSections.map((function(e){return e.id})).join(","),t=this.projectid||12396;this.initSplitObj(t,e)}},doUnPack:function(){return Object(l["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)})))()},initSplitObj:function(e,t){var a=this;return Object(l["a"])(regeneratorRuntime.mark((function r(){var n,i;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n={},n["byPlat"]=1,n["byAdStyle"]=1,n["byDuration"]=1,n["projectid"]=e,n["bpids"]=t,n["groupType"]=a.groupType,n["splitType"]=a.split_type||"",r.next=10,b(e,t);case 10:i=r.sent,console.log(i),i.resMap,i.plat,i.adstyles,i.durations;case 13:case"end":return r.stop()}}),r)})))()},isEqual:function(e,t){return e.every((function(a){return a[t]===e[0][t]}))},handleSelectionChange:function(e){this.hangleSections=e},fSearch2:function(e){var t=e.pkgname,a=e.basedata_type_adstyle,r=e.duration,n=e.usetype,i=e.note,l=e.queryPlatId,o=e.starttime,s=e.endtime,c=e.FCNBSearch;this.searchObject={pkgname:t,adStyle:a,duration:r,usetype:n,note:i,platCodes:l.join(),starttime:o,endtime:s,FCNBSearch:c},this.fGetadvbookpkg(this.searchObject)},tableRowClassName:function(e){var t=e.row;return t.id===this.curentSelect.id?"selected-row":""}}},y=g,v=(a("aba9"),a("2877")),w=Object(v["a"])(y,r,n,!1,null,"4e41af95",null);t["default"]=w.exports},"2ca0":function(e,t,a){"use strict";var r=a("23e7"),n=a("06cf").f,i=a("50c4"),l=a("5a34"),o=a("1d80"),s=a("ab13"),c=a("c430"),p="".startsWith,d=Math.min,u=s("startsWith"),f=!c&&!u&&!!function(){var e=n(String.prototype,"startsWith");return e&&!e.writable}();r({target:"String",proto:!0,forced:!f&&!u},{startsWith:function(e){var t=String(o(this));l(e);var a=i(d(arguments.length>1?arguments[1]:void 0,t.length)),r=String(e);return p?p.call(t,r,a):t.slice(a,a+r.length)===r}})},"4c2e":function(e,t,a){},"7db0":function(e,t,a){"use strict";var r=a("23e7"),n=a("b727").find,i=a("44d2"),l=a("ae40"),o="find",s=!0,c=l(o);o in[]&&Array(1)[o]((function(){s=!1})),r({target:"Array",proto:!0,forced:s||!c},{find:function(e){return n(this,e,arguments.length>1?arguments[1]:void 0)}}),i(o)},a623:function(e,t,a){"use strict";var r=a("23e7"),n=a("b727").every,i=a("a640"),l=a("ae40"),o=i("every"),s=l("every");r({target:"Array",proto:!0,forced:!o||!s},{every:function(e){return n(this,e,arguments.length>1?arguments[1]:void 0)}})},aba9:function(e,t,a){"use strict";var r=a("4c2e"),n=a.n(r);n.a}}]);