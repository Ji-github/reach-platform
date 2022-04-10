<template>
    <a-card>
        <a-tabs
            v-model:activeKey="topType"
            size="large"
            @change="onSearch"
        >
            <a-tab-pane
                :key="0"
                tab="实时热榜"
            />
        </a-tabs>
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
                            v-model:value="searchForm[item.propsName]"
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
                            v-model:value="searchForm[item.propsName]"
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
                    <a-form-item
                        v-else
                        :label="item.title"
                    >
                        <a-input
                            v-model:value="searchForm[item.propsName]"
                            allow-clear
                            :placeholder="item.placeHolder"
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
import {defineComponent} from 'vue';
import {FORM_ITEMS} from '../../../config/hotTop';
export default defineComponent({
    data() {
        return {
            time: '',
            searchForm: {} as any,
            queryForm: FORM_ITEMS
        };
    },
    methods: {
        clearForm(): void {
            this.searchForm.id = '';
            this.searchForm.status = '';
            this.searchForm.query = '';
        },
        // 切换历史热榜和实时热榜
        onSearch(): void {
            this.$emit('search', {
                ...this.searchForm,
            });
        },
    }
});
</script>
<style lang='less' scoped>
.form-width{
    width: 100px;
    height: 20px;
}
</style>