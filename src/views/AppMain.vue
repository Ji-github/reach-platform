<template>
    <a-layout>
        <a-layout-content
            class="global"
            :style="{height: bHeight + 'px'}"
        >
            <router-view/>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    computed: {
        bHeight() {
            return document.body.clientHeight;
        }
    }
});
</script>

<style scoped>
.global{
    padding: 24px;
    margin: 64px 0 0 0;
    min-height: 280px;
    overflow: auto;
}
</style>

