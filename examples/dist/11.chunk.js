(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{102:function(e,t,n){"use strict";n.r(t);var o=n(103),a=n.n(o);for(var r in o)"default"!==r&&function(e){n.d(t,e,function(){return o[e]})}(r);t.default=a.a},103:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;for(var o=[],a=0;a<20;a++)o.push({name:"John Brown",age:18,address:"New York No. 1 Lake Park",date:"2016-10-03"});var r={data:function(){return{columns:[{title:"Name",key:"name",width:100,fixed:"left",sortable:!0,minWidth:100,maxWidth:200},{title:"Age",key:"age",sortable:!0,render:function(e,t){return e("span","age: "+t.row.age)}},{title:"Address",key:"address",width:300},{title:"Date",key:"date",sortable:!0}],loading:!1,list:o,sum:{name:"Jim Green",age:24,address:"London",date:"2016-10-01"},height:250}},methods:{onSortChange:function(e){console.log(e)},onResizeWidth:function(e,t,n,o){console.log("newWidth--".concat(e)),console.log("oldWidth--".concat(t)),console.log("column--".concat(JSON.stringify(n))),console.log(o)}}};t.default=r},134:function(e,t,n){"use strict";function o(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h3",[e._v("调整宽度")]),e._v(" "),e._m(0),e._v(" "),n("flex-table",{attrs:{resizable:"",loading:e.loading,columns:e.columns,data:e.list,sum:e.sum,height:e.height,minWidth:40,maxWidth:300},on:{"on-col-width-resize":e.onResizeWidth,"on-sort-change":e.onSortChange}})],1)}var a=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("p",[e._v("拖动调整宽度 "),n("a",{attrs:{href:"https://github.com/tm-fe/FlexTable/blob/master/examples/features/resizable.vue"}},[e._v("source code")])])}];n.d(t,"a",function(){return o}),n.d(t,"b",function(){return a})},80:function(e,t,n){"use strict";n.r(t);var o=n(134),a=n(102);for(var r in a)"default"!==r&&function(e){n.d(t,e,function(){return a[e]})}(r);var i=n(0),s=Object(i.a)(a.default,o.a,o.b,!1,null,null,null);t.default=s.exports}}]);