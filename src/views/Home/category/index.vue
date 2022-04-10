<template>
    <a-card
        title="类目"
    >
        <a-button
            type="primary"
            class="category-btn"
            @click="showConfirm"
        >添加类目</a-button>
        <div>
            <a-table
                :columns="CATEGORY_CLOMNS"
                :data-source="dataSource"
                row-key="id"
                :pagination="pagination"
                @change="handleTableChange"
            >
                <template #source="{record}">
                    <a class="base-color">{{ record.source }}</a>
                </template>
                <template #action="{record}">
                    <a
                        class="base-color action-margin"
                        @click="handleClick(record)"
                    >删除</a>
                </template>
            </a-table>
        </div>
        <a-modal
            v-model:visible="visible"
            title="类目添加"
            @ok="handleInsert"
        >
            <a-form
                ref="formData"
                :model="searchForm"
                :label-col="{span: 6}"
                :wrapper-col="{span: 16}"
            >
                <a-form-item
                    label="类目"
                    :rules="[{required: true, message: 'Please input your name!'}]"
                >
                    <a-input v-model:value="searchForm.name"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {CATEGORY_CLOMNS} from '../../../config/category';
import {categoryInsert, categoryList, categoryDelete} from '../../../api/category';
export default defineComponent({
    data() {
        return {
            CATEGORY_CLOMNS,
            visible: false,
            pagination: {
                total: 10,
                current: 1,
                pageSize: 10,
            },
            searchForm: {
                name: '',
                source: window.localStorage.getItem('username')
            },
            dataSource: []
        };
    },
    async mounted() {
        const result = await categoryList();
        this.dataSource = result.data.rows;
        this.pagination.total = result.data.count;
    },
    methods: {
        async handleClick(record: any) {
            const result = await categoryDelete({
                id: record.id
            });
            const data = await categoryList();
            this.dataSource = result.data.rows;
        },
        showConfirm() {
            this.visible = true;
        },
        async handleInsert() {
            await categoryInsert({
                name: this.searchForm.name,
                source: 'jixinyan'
            })
            this.visible = false;
            const result = await categoryList();
            this.dataSource = result.data.rows;
            this.pagination.total = result.data.count;
        },
        async handleTableChange(page: { pageSize: number; current: number },
            filters: any,
            sorter: any,) {
                this.pagination.current = page.current;
                const result = await categoryList({
                    page_num: page.current
                });
                this.dataSource = result.data.rows;
        }
    }
});
</script>

<style lang="less" scoped>
.category-btn {
    float: right;
    z-index: 2;
    margin: 0 0 20px 0;
}
</style>