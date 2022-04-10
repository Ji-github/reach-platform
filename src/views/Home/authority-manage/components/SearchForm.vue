<template>
    <a-card>
        <a-form
            layout="vertical"
            :model="searchForm"
        >
            <a-row :gutter="32">
                <a-col
                    v-for="(item, index) in queryForm"
                    :key="index"
                    :span="5"
                >
                    <a-form-item
                        v-if="item.type === 'rangeTime'"
                        :label="item.title"
                    >
                        <a-range-picker
                            v-model:value="curSearchForm[item.propsName]"
                            format="YYYY-MM-DD HH:mm"
                            :placeholder="['开始时间', '结束时间']"
                            allow-clear
                        />
                    </a-form-item>
                    <a-form-item
                        v-else-if="item.type === 'select'"
                        :label="item.title"
                    >
                        <a-select
                            ref="select"
                            v-model:value="curSearchForm[item.propsName]"
                            allow-clear
                            :placeholder="item.placeHolder"
                        >
                            <a-select-option
                                v-for="it in item.options"
                                :key="it.value"
                                :value="it.value"
                            >{{ it.label }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item v-else :label="item.title">
                        <a-input
                            v-model:value="curSearchForm[item.propsName]"
                            :placeholder="item.placeHolder"
                            allow-clear
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="4">
                    <a-form-item>
                        <a-button
                            type="primary"
                            style="margin-top:30px"
                            @click="onSearch"
                        >查询</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-card>
</template>

<script lang='ts'>
import {defineComponent, PropType} from 'vue';

export default defineComponent({
    props: {
        searchForm: {
            type: Object,
            default: () => {return {};}
        },
        queryForm: {
            type: Array as PropType<any[]>,
            default: () => []
        }
    },
    data() {
        return {
            curSearchForm: {} as any,
        };
    },
    mounted() {
        this.curSearchForm = this.searchForm;
    },
    methods: {
        onSearch(): void {
            // 请求是会携带页码，这里将页码至为undefined
            this.curSearchForm.page_num = undefined;
            this.$emit('onSearch', this.curSearchForm);
        }
    }
});
</script>

<style lang='less' scoped>
</style>