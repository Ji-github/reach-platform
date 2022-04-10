<template>
    <div>
        <a
            class="action-margin"
            @click="handleEdit(recordData)"
        >编辑</a>
        <a
            class="action-margin"
            @click="handleClickDelete(recordData.id)"
        >删除</a>
        <a
            v-if="showOnline(recordData.status)"
            class="action-margin"
            @click="online(recordData.id)"
        >上线</a>
    </div>
</template>

<script lang="ts">
import {defineComponent, createVNode} from 'vue';
import {message, Modal} from '@baidu/magic-cube-design-next';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {EventStatusEnum} from '../../../config/eventsStatus';
import { getEventDelete, getEventUpdate } from '@/api/event';
export default defineComponent({
    data() {
        return {
            EventStatusEnum
        };
    },
    props: {
        recordData: {
            type: Object,
            default: () => {return {};}
        }
    },
    methods: {
        async online(id: any) {
            await getEventUpdate({
                id,
                status: 7
            });
            message.success('上线成功');
            this.$emit('onSearch');
        },
        handleEdit(record: any) {
            this.$router.push({
                path: '/event-config',
                query: {
                    id: record.id
                }
            })
        },
        // 展示上线
        showOnline(status: number) {
            const list = [
                EventStatusEnum.Hold
            ];
            return list.includes(status);
        },
        // 删除
        handleClickDelete(event_id: number | string) {
            Modal.confirm({
                title: `确认删除事件id为${event_id}的事件吗？`,
                icon: createVNode(ExclamationCircleOutlined),
                onOk: async() => {
                    await getEventDelete(event_id)
                    message.success('删除成功');
                    this.$emit('onSearch');
                },
            });
        }
    }
});
</script>

<style>

</style>