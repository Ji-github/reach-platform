<template>
    <search-form
        :search-form="CUSTOM_FORM_SEARCHFORM"
        :query-form="CUSTOM_FORM_FORM"
        @onSearch="onSearch"
    />
    <search-list
        :columns="CUSTOM_FORM_CLUMNS"
        list-title="表单"
        :list-data="listData"
        :total="total"
        action="add-form"
        :spinning="spinning"
        :btn-type="btnType"
        @createAction="createAction"
    />
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import SearchForm from '../../component/SearchForm.vue';
import SearchList from '../../component/SearchList.vue';
import {
    btnType,
    CUSTOM_FORM_CLUMNS,
    CUSTOM_FORM_FORM,
    CUSTOM_FORM_SEARCHFORM
} from '../../../config/custom-form';
import { COMPONENT_API, getComponentList } from '@/api/component';
export default defineComponent({
    components: {
        SearchForm,
        SearchList
    },
    data() {
        return {
            btnType,
            CUSTOM_FORM_FORM,
            CUSTOM_FORM_CLUMNS,
            CUSTOM_FORM_SEARCHFORM,
            COMPONENT_API,
            total: 10,
            spinning: false,
            listData: [],
        };
    },
    async mounted() {
        const result = await getComponentList({}, COMPONENT_API);
        this.listData = result.data.rows;
    },
    methods: {
        async onSearch(searchForm: any) {
            const result = await getComponentList(searchForm, COMPONENT_API);
            this.listData = result.data.rows;
        },
        createAction() {
            this.$router.push({
                path: '/add-form',
                query: {
                    curRouter: 'component'
                }
            });
        }
    }
});
</script>

<style>

</style>