<template>
    <search-form
        @search="onSearch"
    />
    <a-spin :spinning="spinning" tip="获取数据中...">
        <search-list
            :top-type="searchForm.type"
            :hot-data="hotData"
            :total="total"
            @change="tableChange"
            @pageChange="pageChange"
            @createAction="createAction"
        />
    </a-spin>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import SearchForm from './SearchForm.vue';
import SearchList from './SearchList.vue';
import moment from 'moment';
import { getEventList } from '@/api/event';

export default defineComponent({
    components: {
        SearchForm,
        SearchList
    },
    data() {
        return {
            searchForm: {
                id: '',
                query: '',
                status: '',
                page_num: '1',
                page_size: '10',
            } as any,
            total: '1',
            hotData: [],
            spinning: false,
            timer: 0
        };
    },
    mounted() {
        this.requestData({});
    },
    methods: {
        pageChange(current: string): void {
            this.searchForm.page_num = current;
            this.requestData({
                ...this.searchForm
            });
        },
        onSearch(params: any): void {
            // 搜索
            this.searchForm.page_num = '1';
            this.searchForm = {
                ...this.searchForm,
                ...params,
            };
            this.requestData(this.searchForm);
        },
        tableChange(params: any): void {
            this.requestData({
                ...this.searchForm
            });
        },
        freshSearch(): void {
            this.timer = setInterval(async () => {
                await this.requestData({
                    ...this.searchForm
                });
            }, 3 * 60 * 1000);
        },
        async requestData(params: any): Promise<void> {
            this.spinning = true;
            const result = await getEventList(params);
            this.hotData = result.data.rows;
            this.total = result.data.count;
            this.spinning = false;
        }
    },
});
</script>

<style>

</style>