<template>
    <a-drawer
        :visible="visibleDrawer"
        width="520"
        :title="action.actionName + listTitle"
        :destroy-on-close="true"
        placement="right"
        :body-style="{paddingBottom: '60px'}"
        @close="closeDrawer"
    >
        <component
            :is="curDrawer"
            ref="drawerForm"
            :drawer-data="drawerData"
            :action="action"
            @updateData="emitUpdateData"
            @getDataList="getDataList"
        />
        <div class="btn">
            <a-button
                class="cancel-style"
                @click="closeDrawer"
            >取消</a-button>
            <a-button
                :loading="btnLoading"
                type="primary"
                @click="updateData"
            >保存</a-button>
        </div>
    </a-drawer>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import BusinessDrawer from './BusinessDrawer.vue';
import InterfaceDrawer from './InterfaceDrawer.vue';
import UserDrawer from './UserDrawer.vue';
import TeamDrawer from './TeamDrawer.vue';

export default defineComponent({
    components: {
        BusinessDrawer,
        InterfaceDrawer,
        UserDrawer,
        TeamDrawer
    },
    props: {
        visibleDrawer: {
            type: Boolean,
            default: true
        },
        action: {
            type: Object,
            default: () => {return {};}
        },
        listTitle: {
            type: String,
            default: ''
        },
        drawerData: {
            type: Object,
            default: () => {return {};}
        },
        curDrawer: {
            type: String,
            default: ''
        },
        btnLoading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getDataList(dataList: any) {
            this.$emit('getDataList', dataList);
        },
        // drawer关闭时调用
        closeDrawer(): void {
            this.$emit('update:visibleDrawer', false);
        },
        // 编辑、新建数据
        async updateData(): Promise<void> {
            const drawerForm = this.$refs.drawerForm as any;
            await drawerForm.updateData();
        },
        emitUpdateData(url: string, searchForm: any) {
            this.$emit('updateData', url, searchForm);
        },
        clearForm() {
            // @ts-ignore
            this.searchForm = {} as any;
        },
    }
});
</script>

<style lang='less' scoped>
.btn {
    position: absolute;
    background: #fff;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 15px 24px;
    text-align: right;
    left: 0;
    border-radius: 0 0 4px 4px;
    .cancel-style{
        margin-right: 24px;
    }
}
</style>