(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{102:function(e,n,t){"use strict";t.r(n);var a=t(103),o=t.n(a);for(var l in a)"default"!==l&&function(e){t.d(n,e,function(){return a[e]})}(l);n.default=o.a},103:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;for(var a=[],o=0;o<80;o++)a.push({name:"John Brown",age:18,address:"New York No. 1 Lake Park",real_address:"New York No. 1 Lake Park",date:"2016-10-03"});var l={data:function(){return{columns:[{type:"selection",width:20,align:"center",fixed:"left"},{title:"Name",key:"name",width:150},{title:"Age",key:"age",width:150,render:function(e,n){return e("span","age: "+n.row.age)}},{title:"Address",key:"address",width:250},{title:"Real Address",key:"real_address",width:250},{title:"Date",key:"date",width:250}],loading:!1,list:a,sum:{name:"Jim Green",age:24,address:"London",date:"2016-10-01"}}},mounted:function(){},methods:{onSelectionChange:function(e,n){console.log("onSelectionChange",e,n)},onSelectionCancel:function(e){console.log("onSelectionCancel",e)},onAllCancel:function(e){console.log("onAllCancel",e)}}};n.default=l},126:function(e,n,t){"use strict";function a(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("h3",[e._v("多选")]),e._v(" "),e._m(0),e._v(" "),t("flex-table",{attrs:{loading:e.loading,columns:e.columns,data:e.list,sum:e.sum,"fixed-head":!0,"async-render":10},on:{"on-selection-change":e.onSelectionChange,"on-selection-cancel":e.onSelectionCancel,"on-all-cancel":e.onAllCancel}})],1)}var o=[function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("p",[e._v("选择行 "),t("a",{attrs:{href:"https://github.com/tm-fe/FlexTable/blob/master/examples/features/selectable.vue"}},[e._v("source code")])])}];t.d(n,"a",function(){return a}),t.d(n,"b",function(){return o})},81:function(e,n,t){"use strict";t.r(n);var a=t(126),o=t(102);for(var l in o)"default"!==l&&function(e){t.d(n,e,function(){return o[e]})}(l);var r=t(0),c=Object(r.a)(o.default,a.a,a.b,!1,null,null,null);n.default=c.exports}}]);