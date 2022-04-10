<template>
    <a
        class="base-color action-margin"
        @click="handleClick"
    >升级版本</a>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
export default defineComponent({
    data() {
        return {
            curRouter: 'component',
            isShow: false
        };
    },
    props: {
        recordData: {
            type: Object,
            default: () => {return {};}
        }
    },
    mounted() {
        const status = window.localStorage.getItem('status');
        if(status && +status > 8) {
            this.isShow = true;
        }
    },
    methods: {
        handleClick() {
            this.$router.push({
                path: '/add-form',
                query: {
                    id: this.recordData.id,
                    curRouter: this.curRouter,
                }
            });
        }
    }
});
</script>