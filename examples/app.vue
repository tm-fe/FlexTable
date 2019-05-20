<template>
    <div class="container">
        <h1>FlexTable</h1>
        <nav class="nav">
            <ul>
                <li>普通用法：<router-link to="/">index</router-link></li>
                <li>设置表格最大高度：<router-link to="/fixedHeader">fixed header</router-link></li>
                <li>固定列：<router-link to="/fixedLeft">fixedLeft</router-link></li>
                <li>排序：<router-link to="/sortable">sortable</router-link></li>
                <li>Footer:<router-link to="/footer">footer</router-link></li>
                <li>加载中：<router-link to="/loading">loading</router-link></li>
                <li>render 函数：<router-link to="/render">render</router-link></li>
                <li>多选：<router-link to="/selectable">selectable</router-link></li>
                <li>调整宽度：<router-link to="/resizable">resizable</router-link></li>
                <li>展开：<router-link to="/expand">expand</router-link></li>
                <li>scopedSlot：<router-link to="/scopedSlot">scoped-slot</router-link></li>
            </ul>
        </nav>
        <router-view></router-view>
    </div>
</template>
<script>
    module.exports = {
        data: function() {
            return {
            }
        },
    }
</script>
<style lang="less" scoped>
.container{
    padding: 10px 40px 0;
}
.nav{ 
    margin: 20px auto;
    border: 1px solid #d8d8d8;
}
</style>
