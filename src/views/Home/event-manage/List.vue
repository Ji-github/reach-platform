<template>
    <div>
        <search-form
            :query-form="HOT_SEARCHFORM"
            :search-form="HOT_SEARCH_FORM"
            @onSearch="onSearch"
        />
        <search-list
            :columns="HOT_COLUMNS"
            list-title="事件"
            :list-data="list"
            :btn-type="btnType"
            :total="total"
            :spinning="spinning"
            @pageChange="onPageChange"
            @createAction="createAction"
            @onSearch="onSearch"
        />
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import SearchForm from '../../component/SearchForm.vue';
import SearchList from '../../component/SearchList.vue';
import {
    HOT_SEARCHFORM,
    HOT_SEARCH_FORM,
    HOT_COLUMNS,
    btnType
} from '../../../config/events';
import {fnDealTime} from '../../../utils';
import {message} from '@baidu/magic-cube-design-next';
import {getEventList} from '../../../api/event';
import { categoryList } from '@/api/category';
export default defineComponent({
    components: {
        SearchForm,
        SearchList
    },
    data() {
        return {
            HOT_SEARCHFORM,
            HOT_SEARCH_FORM,
            HOT_COLUMNS,
            btnType,
            searchForm: {} as any,
            spinning: false,
            total: 10,
            list: []
        };
    },
    async mounted() {
        const result = await getEventList();
        this.list = result.data.rows;
        this.total = result.data.count;
        this.HOT_SEARCHFORM.forEach(async (item: any) => {
            if (item.propsName === 'category') {
                const result = await categoryList();
                item.options = result.data.rows.map((it: any) => {
                    return {
                        label: it.name,
                        value: it.id
                    }
                });
            }
        })
    },
    methods: {
        fnDealTime,
        onSearch(searchForm: any) {
            this.searchForm = searchForm;
            this.getAuthorityList(searchForm);
        },
        onPageChange(current: number) {
            this.searchForm.page_num = current;
            this.getAuthorityList(this.searchForm);
        },
        async getAuthorityList(searchForm: any) {
            this.spinning = true;
            try {
                const result = await getEventList(searchForm);
                this.list = result.data.rows;
                this.total = result.data.count;
            } catch(err) {
                console.log(err);
            }
            this.spinning = false;
        },
        createAction() {
            this.$router.push({
                path: 'event-config'
            });
        }
    }
});
</script>
