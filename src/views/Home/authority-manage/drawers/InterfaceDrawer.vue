<template>
    <a-form
        ref="formRef"
        :model="searchForm"
        :rules="formRules"
        class="form-item"
    >
        <a-form-item
            v-for="item in formData"
            :key="item.propsName"
            :ref="item.propsName"
            :label="item.title"
            :name="item.propsName"
        >
            <div v-if="item.type === 'checkbox'">
                <a-checkbox-group
                    v-model:value="searchForm[item.propsName]"
                    class="checkbox-box"
                >
                    <a-checkbox
                        v-for="item in authorityRelate"
                        :key="item.value"
                        :value="item.value"
                    >{{ item.label }}</a-checkbox>
                </a-checkbox-group>
            </div>
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
import {FORM_RULES, INTERFACE_DRAWER_ADD_FORM} from '../../../../config/authorityTpl/interface';
import {Vue} from 'vue-class-component';
import {INFO_API} from '../../../../config/authorityTpl/index';
import {PAGE_SIZE} from '../../../../config/base';
import { authorityInfo, getAuthorityList } from '../../../../api/power';

export default defineComponent({
    data() {
        return {
            searchForm: {} as any,
            formRules: FORM_RULES,
            formData: INTERFACE_DRAWER_ADD_FORM,
            authorityRelate: []
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
        const result = await getAuthorityList(INFO_API.powerids, {
            page_size: PAGE_SIZE
        });
        this.authorityRelate = result.data.rows.map((item: any) => {
            return {
                label: item.label,
                value: item.value.toString()
            }
        });
    },
    methods: {
        async getInfo() {
            const result = await authorityInfo(INFO_API.interfaceInfo, {
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
    textarea,
    input{
        width: 300px;
    }
    .checkbox-box {
        width: 300px;
        margin-top: 10px;
        &:first-child{
            padding-top: 20px;
        }
        & > label {
            display: block;
            width: 300px;
            margin-left: 0px;
            padding-left: 30px;
            padding-bottom: 20px;
        }
    }
}
.drawer-btn{
    position: absolute;
    right: 100px;
    bottom: 50px;
}

</style>