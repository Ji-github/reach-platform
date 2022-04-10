<template>
    <a-card :title="listTitle + '列表'" class="list-card">
        <template #extra>
            <a-button
                type="primary"
                @click="createAction"
            >新建{{ listTitle }}</a-button>
        </template>
        <a-table
            :columns="columns"
            :loading="spinning"
            :scroll="{x: 1000}"
            :data-source="listData"
            :pagination="false"
            row-key="id"
        >
            <template #status="{record}">
                <span>{{ powerType[record.status] }}</span>
            </template>
            <template #isTest="{record}">
                <span>{{ record.isTest === 1 ? '测试' : '正式' }}</span>
            </template>
            <template #insert_time="{record}">
                <span>{{
                    +record.insert_time
                        ? moment(+record.insert_time).format("YYYY-MM-DD HH:mm")
                        : "-"
                }}</span>
            </template>
            <template #update_time="{record}">
                <span>{{
                    +record.update_time
                        ? moment(+record.update_time).format("YYYY-MM-DD HH:mm")
                        : "-"
                }}</span>
            </template>
            <template #action="{record}">
                <component
                    :is="btnType"
                    :record-data="record"
                    @onSearch="onSearch"
                    @clickType="clickType"
                />
            </template>
        </a-table>
        <a-pagination
            v-model:current="current"
            :total="total"
            @change="pageChange"
        />
    </a-card>
</template>

<script lang='ts'>
import {defineComponent, PropType} from 'vue';
import moment from 'moment';
import {powerType} from '../../config/events';
import EventListBtn from '../Home/event-manage/EventListBtn.vue';
import HeadCardBtn from '../Home/head-card/HeadCardBtn.vue';
import CustomBtn from '../Home/custom-form/CustomBtn.vue';

export default defineComponent({
    components: {
        EventListBtn,
        HeadCardBtn,
        CustomBtn
    },
    props: {
        columns: {
            type: Array as PropType<{ [key: string]: any }>,
            default: () => [],
        },
        listTitle: {
            type: String,
            default: '',
        },
        listData: {
            type: Array as PropType<{ [key: string]: any }>,
            default: () => [],
        },
        action: {
            type: String,
            default: '',
        },
        total: {
            type: String,
            default: '',
        },
        spinning: {
            type: Boolean,
            default: false,
        },
        btnType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            moment,
            current: '1',
            powerType
        };
    },
    methods: {
        pageChange() {
            this.$emit('pageChange', this.current);
        },
        createAction() {
            this.$emit('createAction');
        },
        onSearch(searchForm?: any) {
            console.log(123);
            this.$emit('onSearch', searchForm);
        },
        clickType(type: string, recordData: any) {
            this.$emit('clickType', type, recordData);
        }
    },
});
</script>

<style lang='less' scoped>
.ant-pagination {
  margin-top: 10px;
  float: right;
}
</style>