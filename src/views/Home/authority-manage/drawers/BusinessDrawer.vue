<template>
    <a-form
        ref="formRef"
        :model="searchForm"
        :rules="rules"
        class="form-item"
    >
        <a-form-item
            v-for="item in drawerAddForm"
            :key="item.propsName"
            :label="item.title"
            :name="item.propsName"
        >
            <a-select
                v-if="item.type === 'select'"
                v-model:value="searchForm[item.propsName]"
                class="search-input"
                allow-clear
                :placeholder="item.placeHolder"
            >
                <a-select-option
                    v-for="it in (item.options)"
                    :key="it.value"
                    :value="it.value"
                >{{ it.label }}</a-select-option>
            </a-select>
            <a-input
                v-else
                v-model:value="searchForm[item.propsName]"
                :placeholder="item.placeHolder"
            />
        </a-form-item>
    </a-form>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {
    FORM_RULES,
    BUSINESS_DRAWER_TABLE,
    BUSINESS_DRAWER_FORM,
    BUSINESS_DRAWER_ADD_FORM
} from '../../../../config/authorityTpl/business';
import {INFO_API} from '../../../../config/authorityTpl/index';
import {Vue} from 'vue-class-component';
import { authorityInfo } from '../../../../api/power';

export default defineComponent({
    data() {
        return {
            searchForm: {} as any,
            rules: FORM_RULES,
            columns: BUSINESS_DRAWER_TABLE,
            drawerForm: BUSINESS_DRAWER_FORM,
            drawerAddForm: BUSINESS_DRAWER_ADD_FORM,
            dataSource: []
        };
    },
    props: {
        action: {
            type: Object,
            default: () => {return {};}
        },
        drawerData: {
            type: Object,
            default: () => {return {};}
        }
    },
    watch: {
        async 'drawerData.id'() {
            if (this.drawerData.id) {
                this.searchForm = await this.getInfo();
            } else {
                this.clearForm();
            }
        }
    },
    async mounted() {
        if (this.action.type === 'edit') {
            this.searchForm = await this.getInfo();
        }
    },
    methods: {
        async getInfo() {
            const result = await authorityInfo(INFO_API.business, {
                id: this.drawerData.id
            });
            return result.data;
        },
        clearForm() {
            this.searchForm = {} as any;
        },
        // 编辑、新建数据
        async updateData() {
            const formRef = this.$refs.formRef as Vue;
            // @ts-ignore
            await formRef.validate();
            this.$emit('updateData', this.action.api, this.searchForm);
        }
    }
});
</script>

<style lang='less' scoped>
.form-item {
    width:100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: flex-start;
    padding-right: 50px;
    padding-bottom: 20px;
    input{
        width: 300px;
    }
    .search-input{
        width: 300px;
    }
}
.drawer-btn{
    position: absolute;
    right: 100px;
    bottom: 50px;
}
</style>