<template>
    <div>
        <a
            class="action-margin"
            @click="handleEdit"
        >编辑</a>
        <a
            class="action-margin"
            @click="handleClickDelete(recordData.event_id)"
        >删除</a>
    </div>
</template>

<script lang="ts">
import {defineComponent, createVNode} from 'vue';
import {message, Modal} from '@baidu/magic-cube-design-next';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
export default defineComponent({
    props: {
        recordData: {
            type: Object,
            default: () => {return {};}
        }
    },
    methods: {
        // 删除
        handleClickDelete(event_id: number | string) {
            Modal.confirm({
                title: `确认删除事件id为${event_id}的事件吗？`,
                icon: createVNode(ExclamationCircleOutlined),
                onOk() {
                    console.log(event_id);
                    message.success('删除成功');
                },
            });
        },
        handleEdit() {
            this.$emit('clickType', 'edit', this.recordData);
        }
    }
});
</script>

<style>

</style>