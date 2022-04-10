<template>
    <a-form
        :model="searchForm"
        :label-col="{span: 5}"
        :wrapper-col="{span: 18}"
        :rules="rules"
        ref="formData"
    >
        <a-form-item label="卡片名称" name="name">
            <a-input v-model:value="searchForm.name" style="width: 230px"/>
        </a-form-item>
        <a-form-item label="组件名称" name="typeName">
            <a-select
                v-model:value="cardId"
                style="width: 230px"
                placeholder="请输入组件名称"
                :options="cardList"
            />
            <a-button
                style="margin-left: 20px"
                type="primary"
                @click="onHandleAdd"
            >添加</a-button>
        </a-form-item>
        <a-form-item label="组件列表">
            <a-table :data-source="dataSource" :columns="columns">
                <template #action="{record}">
                    <a @click="handleDelete(record)">删除</a>
                </template>
            </a-table>
        </a-form-item>
    </a-form>
    <div class="btn-container">
        <a-button @click="save">保存</a-button>
    </div>
</template>

<script lang="ts">
import { COMPONENT_API, getComponentList } from '@/api/component';
import {message} from '@baidu/magic-cube-design-next';
import {defineComponent} from 'vue';
import {getCardHeadInfo, getCardHeadInsert, getCardHeadUpdate} from '@/api/cardHead';
export default defineComponent({
    data() {
        return {
            searchForm: {} as any,
            cardList: [],
            cardId: '',
            dataSource: [] as any[],
            columns: [
                {
                    title: '组建',
                    dataIndex: 'name'
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    slots: {customRender: 'action'}
                }
            ] as any[],
            rules: {
                name: [
                    {required: true, message: '卡片名称不能为空', trigger: 'blur'},
                ]
            }
        };
    },
    props: {
        recordData: {
            type: Object,
            default: () => {}
        }
    },
    async mounted() {
        const result = await getComponentList({}, COMPONENT_API);
        this.cardList = result.data.rows.map((item: any) => {
            return {
                label: item.name,
                value: item.id
            }
        })
        if(this.recordData.id) {
            // 请求info接口
            const result = await getCardHeadInfo(this.recordData.id);
            this.searchForm.name = result.data.name;
            const data = result.data.dataSource;
            console.log(data);
            data.forEach((item: any) => {
                this.cardList.forEach((it: any) => {
                    if(it.value === +item) {
                        this.dataSource.push({
                            name: it.label,
                            value: it.value
                        })
                    }
                })
            });
        }
    },
    methods: {
        onHandleAdd() {
            let isGo = false;
            this.dataSource.forEach((item: any) => {
                if(item.value === this.cardId) {
                    message.error('不能重复添加');
                    isGo = true;
                }
            })
            if(!isGo) {
                this.cardList.forEach((it: any) => {
                    if(it.value === this.cardId) {
                        this.dataSource.push({
                            name: it.label,
                            value: it.value
                        });
                    }
                })
            }
        },
        handleDelete(record: any) {
            this.cardList.forEach((item: any, index) => {
                if(item.value === record.value) {
                    this.dataSource.splice(index, 1);
                }
            })
        },
        async save() {
            // @ts-ignore
            await this.$refs.formData.validate();
            const data = this.dataSource.map((item: any) => {
                return item.value;
            })
            console.log(data);
            // 保存请求insert｜update接口
            try {
                if(this.recordData.id) {
                    await getCardHeadUpdate({
                        id: this.recordData.id,
                        name: this.searchForm.name,
                        dataSource: data
                    })
                } else {
                    await getCardHeadInsert({
                        name: this.searchForm.name,
                        dataSource: data
                    })
                }
                message.success('保存成功');
                this.$emit('onSearch');
            } catch(err) {
                console.log(err);
            }
        }
    }
});
</script>

<style lang="less" scoped>
.btn-container {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
}
</style>