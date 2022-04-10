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
            :data-source="listData"
            :pagination="false"
            row-key="id"
        >
            <template #type="{record}">
                <span>{{ powerType[record.type] }}</span>
            </template>
            <template #roles="{record}">
                <span>{{ROLES[record.roles]}}</span>
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
            <template #Action="{record}">
                <span
                    v-for="(item, index) in action"
                    :key="index"
                    :class="[item[notShow] ? '' : 'action-margin',
                             record.type === 1 || record.type === 2 ? 'disable' : '']"
                >
                    <a
                        v-if="!item.notShow"
                        type="text"
                        :style="item.type === 'delete' ? 'color: #ff3355' : ''"
                        @click="operateForm(record.id, item, record)"
                    >
                        {{ item.actionName }}
                    </a>
                </span>
            </template>
        </a-table>
        <a-pagination
            v-model:current="current"
            :total="total"
            @change="pageChange"
        />
    </a-card>
    <component
        :is="curDrawer"
        v-model:visible-drawer="visibleDrawer"
        :drawer-data="drawerData"
        :list-title="listTitle"
        :action="curAction"
    />
</template>

<script lang='ts'>
import {defineComponent, PropType} from 'vue';
import moment from 'moment';
import {Modal} from '@baidu/magic-cube-design-next';
import {POWER_TYPE} from '../../../../config/authorityTpl/power';
import { deleteAuthority } from '../../../../api/power';
import {ROLES} from '@/config/authorityTpl/user';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<any[]>,
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
            type: Array as PropType<{ [key: string]: any }>,
            default: () => [],
        },
        total: {
            type: String,
            default: '',
        },
        spinning: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            moment,
            current: '1',
            powerType: POWER_TYPE,
            ROLES
        };
    },
    methods: {
        pageChange() {
            this.$emit('pageChange', this.current);
        },
        async createAction(): Promise<void> {
            // 各业务新建操作
            this.$emit('createOrEditAuthority');
        },
        operateForm(
            id: number | string,
            action: { [key: string]: any },
            record: any
        ): void {
            // 列表中操作项行为

            if (action.type === 'delete') {
                this.deleteAction(id, action, record);
            } else {
                this.createOrEditAuthority(id, action);
            }
        },
        // 执行删除权限操作
        deleteAction(
            id: number | string,
            action: { [key: string]: any },
            record?: any
        ): void {
            Modal.confirm({
                title: '提示',
                content: `确认是否删除${this.listTitle}: ${record.name}吗?`,
                okText: '确认',
                onOk: async () => {
                    // 请求删除接口
                    await deleteAuthority(action.api, {
                        id: record.user_id || id
                    });
                    this.$emit('onSearch');
                },
            });
        },
        // 新建或者编辑操作
        createOrEditAuthority(
            id?: number | string,
            action?: { [key: string]: any }
        ): void {
            const index = this.listData.findIndex((item: any) => {
                return item.id === id;
            });
            if (index >= 0) {
                this.$emit('createOrEditAuthority', this.listData[index], action);
            }
        },
    },
});
</script>

<style lang='less' scoped>
.team-container {
    position: relative;
    &::after{
        content: '...';
        position: absolute;
        text-align: center;
        line-height: 6px;
        top: -5px;
        width: 16px;
        height: 15px;
        border: 1px solid rgb(7, 6, 6);
        border-radius: 10px;
    }
}
.disable {
    pointer-events: none;
    cursor: not-allowed;
    color: #acaaaa;
    a {
        color: #acaaaa;
    }
}
.action-margin:nth-last-child(2),
.action-margin:last-child {
  border-right: 0;
}
.ant-pagination {
  margin-top: 10px;
  float: right;
}
</style>