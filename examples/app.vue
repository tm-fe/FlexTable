<template>
    <div class="container">
        <h1>FlexTable</h1>
        <nav class="nav">
            <ul>
                <li><router-link to="/">index</router-link></li>
                <li><router-link to="/fixedHeader">fixed header</router-link></li>
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
