<template>
    <search-form
        :query-form="HEAD_CARD_FORM"
        :search-form="HEAD_CARD_SEARCH_FORM"
        @onSearch="onSearch"
    />
    <search-list
        :columns="HEAD_CARD_CLUMNS"
        list-title="头卡"
        :list-data="listData"
        :action="action"
        :spinning="false"
        :btn-type="HEAD_CARD_BTN_TYPE"
        :total="total"
        @createAction="createAction"
        @clickType="clickType"
        @onSearch="onSearch"
        @pageChange="pageChange"
    />
    <a-drawer
        v-model:visible="visible"
        width="500"
        style="color: red"
        title="头卡配置"
        placement="right"
        @after-visible-change="afterVisibleChange"
    >
        <head-drawer
            :recordData="recordData"
            @onSearch="onSearch"
        />
    </a-drawer>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import SearchForm from '../../component/SearchForm.vue';
import SearchList from '../../component/SearchList.vue';
import HeadDrawer from './HeadDrawer.vue';
import {
    HEAD_CARD_FORM,
    HEAD_CARD_SEARCH_FORM,
    HEAD_CARD_CLUMNS,
    HEAD_CARD_BTN_TYPE
} from '../../../config/headCard';
import {fnDealTime} from '../../../utils';
import {getCardHeadList} from '@/api/cardHead';
export default defineComponent({
    components: {
        SearchForm,
        SearchList,
        HeadDrawer
    },
    data() {
        return {
            HEAD_CARD_FORM,
            HEAD_CARD_SEARCH_FORM,
            HEAD_CARD_CLUMNS,
            HEAD_CARD_BTN_TYPE,
            searchForm: {} as any,
            recordData: {},
            listData: [],
            total: 1,
            pagination: {
                total: 10,
                current: 1,
                pageSize: 10,
            },
            visible: false
        };
    },
    mounted() {
        this.onSearch(this.searchForm);
    },
    methods: {
        fnDealTime,
        async onSearch(searchForm: any) {
            this.searchForm = searchForm;
            const result = await getCardHeadList(searchForm);
            this.listData = result.data.rows;
            this.total = result.data.count;
        },
        pageChange(current: number) {
            this.searchForm.page_num = current;
            this.onSearch(this.searchForm);
        },
        createAction() {
            this.visible = true;
        },
        clickType(type: string, recordData: any) {
            if(type === 'edit') {
                this.visible = true;
                this.recordData = recordData;
            }
        }
    }
});
</script>

<style lang='less' scoped>
.custom-class {
    width: 400px;
}
</style>