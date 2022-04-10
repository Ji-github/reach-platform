<template>
    <guide v-if="$route.name === 'guide'"/>
    <div v-else>
        <a-layout>
            <nav-slider/>
            <no-permission v-if="isNoAccess" :is-no-access="isNoAccess"/>
            <a-layout v-else>
                <nav-header/>
                <app-main/>
            </a-layout>
        </a-layout>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import NavHeader from '../components/NavHeader.vue';
import NavSlider from '../components/NavSlider.vue';
import NoPermission from './NoPermission.vue';
import Guide from './Guide.vue';
import AppMain from './AppMain.vue';
import zhCN from '@baidu/magic-cube-design-next/lib/locale-provider/zh_CN';
export default defineComponent({
    components: {
        NoPermission,
        NavHeader,
        NavSlider,
        AppMain,
        Guide
    },
    data() {
        return {
            locale: zhCN,
        };
    }
});
</script>

