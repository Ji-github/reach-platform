<template>
    <div class="no-permission">
        <img src="@/assets/no_permission.png" alt="">
        <p>{{ isNoAccess ? noAccessMsg : msg }}</p>
        <a :href="msgUrl">{{ msg }}</a>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
export default defineComponent({
    data() {
        return {
            msg: '您暂时无权限，请联系超级管理员：jixinyan',
            noAccessMsg: '当前用户为无效用户，请联系管理员进行注册'
        };
    },
    props: {
        isNoAccess: {
            default: false,
            type: Boolean
        }
    }
});
</script>

<style lang="less" scoped>
:root,
body{
    width: 100%;
    height: 100%;
}
p{
    margin-top: 20px;
}
.no-permission {
    background-color: #fff;
    padding-top: 8%;
    padding-bottom: 10%;
    width: 100%;
    vertical-align: middle;
    text-align: center;
}
</style>