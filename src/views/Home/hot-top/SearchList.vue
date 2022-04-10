<template>
    <a-card class="list-card">
        <!-- 实时热榜 -->
        <a-table
            :columns="HOT_COLUMNS"
            :data-source="hotData"
            :pagination="false"
            @change="tableChange"
        >
            <template #query="{text}">
                <a
                    class="base-color"
                    :href="originUrl + text"
                    target="_blank"
                >{{ text }}</a>
            </template>
            <template #update_time="{text, record}">
                <span>{{ +text ? moment(+record.update_time).format("YYYY-MM-DD HH:mm:ss") : '-' }}</span>
            </template>
            <template #id="{text}">
                <a
                    class="base-color"
                    :href="`/event-config?id=${text}`"
                >{{ text ? text : '' }}</a>
            </template>
            <template #status="{text}">
                <span
                    :class="text === 1 ? 'ant-tag-success' : 'ant-tag-lime'"
                    style="padding: 3px 10px;"
                >{{ text === 7 ? '已绑定' : '未绑定' }}</span>
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
import moment from 'moment';
import {HOT_COLUMNS} from '../../../config/hotTop';
import {defineComponent} from 'vue';
export default defineComponent({
    setup() {
        return {
            HOT_COLUMNS,
        };
    },
    data() {
        return {
            originUrl: 'https://m.baidu.com/s?word=',
            current: '1',
            moment
        };
    },
    props: {
        topType: {
            type: Number,
        },
        hotData: {
            type: Object,
        },
        total: {
            type: String,
        }
    },
    watch: {
        topType() {
            this.current = '1';
        }
    },
    methods: {
        pageChange(): void {
            this.$emit('pageChange', this.current);
        },
        async tableChange(
            pagination: { current: number, pageSize: number, total: number },
            filters: any,
            sorter: { field: string, order: string }
        ): Promise<void> {
            this.$emit('change', {
                pagination,
                filters,
                sorter
            });
        },
    }
});
</script>
<style lang='less' scoped>
.ant-pagination{
    margin-top: 10px;
    float: right;
}
</style>