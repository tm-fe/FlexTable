(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{128:function(e,t,n){"use strict";function a(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h3",[e._v("固定列")]),e._v(" "),e._m(0),e._v(" "),n("flex-table",{attrs:{loading:e.loading,columns:e.columns,data:e.list,sum:e.sum,height:300},on:{"on-sort-change":e.onSortChange}})],1)}var r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("p",[e._v("左右固定列 "),n("a",{attrs:{href:"https://github.com/tm-fe/FlexTable/blob/master/examples/features/fixedLeft.vue"}},[e._v("source code")])])}];n.d(t,"a",function(){return a}),n.d(t,"b",function(){return r})},79:function(e,t,n){"use strict";n.r(t);var a=n(128),r=n(98);for(var o in r)"default"!==o&&function(e){n.d(t,e,function(){return r[e]})}(o);var i=n(0),u=Object(i.a)(r.default,a.a,a.b,!1,null,null,null);t.default=u.exports},98:function(e,t,n){"use strict";n.r(t);var a=n(99),r=n.n(a);for(var o in a)"default"!==o&&function(e){n.d(t,e,function(){return a[e]})}(o);t.default=r.a},99:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;for(var a=[],r=0;r<100;r++)a.push({name:"John Brown",age:18,hegith:"178",address:"New York No. 1 Lake Park",date:"2016-10-03"});console.time("fixed");var o={data:function(){return{columns:[{title:"Name",key:"name",width:100,fixed:"left",sortable:!0},{title:"Age",key:"age",fixed:"right",width:150,sortable:!0,render:function(e,t){return e("span","age: "+t.row.age)}},{title:"Height",key:"hegith",width:300,fixed:"left"},{title:"Address",key:"address",width:500},{title:"Date",key:"date",width:200,sortable:!0}],loading:!1,list:a,sum:{name:"Jim Green",age:24,hegith:"-",address:"London",date:"2016-10-01"}}},mounted:function(){console.timeEnd("fixed")},methods:{onSortChange:function(e){console.log(e)}}};t.default=o}}]);