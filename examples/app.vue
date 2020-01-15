<template>
    <div class="container">
        <header>
            <h1>FlexTable</h1>
        </header>
        <div class="main">
            <nav class="nav">
                <ul>
                    <li v-for="item in routes" :key="item.name">
                        <router-link
                            :to="item.path"
                            :class="$route.name === item.name?'active':''"
                        >{{
                            (item.meta && item.meta.title) || item.name
                        }}</router-link>
                    </li>
                </ul>
            </nav>
            <div class="cont">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import routes from "./routes";
export default {
    data: function() {
        return {
            routes
        };
    }
};
</script>
<style lang="less">
body,
h1,
ul,
li {
    padding: 0;
    margin: 0;
}
.container {
    min-height: 100vh;
    display: flex;
    flex-flow: column;
    header {
        padding: 10px;
        flex-shrink: 0;
        color: #fff;
        text-align: center;
        border-bottom: 2px solid #0e8cf3;
        background: linear-gradient(to bottom, #1696ff, #16c9ff);
        h1 {
            font-weight: 600;
            font-size: 28px;
            line-height: 1;
        }
    }
}
.main {
    flex: 1;
    display: flex;
    align-items: stretch;
    position: relative;
}
.btn-box{
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
    button{
        padding: 5px 10px;
    }
}
.nav {
    padding: 15px 5px;
    width: 170px;
    border-right: 1px solid #d8d8d8;
    flex-shrink: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background: #fcfcfc;
    ul li{
        list-style: none;
    }
    a{
        color:#444;
        text-decoration: none;
        display: block;
        line-height: 24px;
        margin-bottom: 5px;
        padding: 0 10px;
        border-radius: 5px;
        font-size: 12px;
        &:hover{
            color:#0e8cf3;
        }
        &.active{
            background: #0e8cf3;
            color:#fff;
            &:hover{
                color:#fff;
            }
        }
    }
}
.cont {
    padding: 20px;
    width: 0;
    flex: 1;
}
</style>
