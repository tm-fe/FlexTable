(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{28:function(e,n,t){"use strict";t.r(n);for(var o=t(30),l=[],a=0;a<10;a++)l.push({name:"John Brown",age:18,address:"New York No. 1 Lake Park",date:"2016-10-03"});var c={components:{flexTable:o.a},data:function(){return{columns:[{type:"selection",width:20,align:"center",fixed:"left"},{title:"Name",key:"name"},{title:"Age",key:"age",render:function(e,n){return e("span","age: "+n.row.age)}},{title:"Address",key:"address"},{title:"Date",key:"date"}],loading:!1,list:l,sum:{name:"Jim Green",age:24,address:"London",date:"2016-10-01"}}},mounted:function(){},methods:{onSelectionChange:function(e,n){console.log("onSelectionChange",e,n)},onSelectionCancel:function(e){console.log("onSelectionCancel",e)},onAllCancel:function(e){console.log("onAllCancel",e)}}},s=t(10),i=Object(s.a)(c,function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("h3",[e._v("多选")]),e._v(" "),e._m(0),e._v(" "),t("flex-table",{attrs:{loading:e.loading,columns:e.columns,data:e.list,sum:e.sum},on:{"on-selection-change":e.onSelectionChange,"on-selection-cancel":e.onSelectionCancel,"on-all-cancel":e.onAllCancel}})],1)},[function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("p",[e._v("选择行 "),t("a",{attrs:{href:"https://github.com/tm-fe/FlexTable/blob/master/examples/features/selectable.vue"}},[e._v("source code")])])}],!1,null,null,null);n.default=i.exports}}]);