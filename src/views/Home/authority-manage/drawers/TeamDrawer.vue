<template>
    <a-form
        ref="formRef"
        :model="searchForm"
        :rules="rules"
        class="form-item"
    >
        <a-form-item
            v-for="item in drawerForm"
            :key="item.propsName"
            :ref="item.propsName"
            :label="item.title"
            :name="item.propsName"
        >
            <a-textarea
                v-if="item.type === 'textarea'"
                v-model:value="searchForm[item.propsName]"
                :placeholder="item.placeHolder"
                class="textarea"
                :maxlength="36"
                show-count
                :rows="4"
            />
            <a-input
                v-else
                v-model:value="searchForm[item.propsName]"
                :maxlength="16"
                :placeholder="item.placeHolder"
            />
        </a-form-item>
    </a-form>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {TEAM_ADD_FORM, FORM_RULES} from '../../../../config/authorityTpl/team';
import {INFO_API} from '../../../../config/authorityTpl/index';
import {Vue} from 'vue-class-component';
import { authorityInfo } from '../../../../api/power';

export default defineComponent({
    data() {
        return {
            searchForm: {} as any,
            drawerForm: TEAM_ADD_FORM,
            rules: FORM_RULES
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
    async mounted() {
        if (this.action.type === 'edit') {
            await this.getInfo();
        }
    },
    methods: {
        // 新建逻辑
        async updateData() {
            const formRef = this.$refs.formRef as Vue;
            // @ts-ignore
            await formRef.validate();
            console.log(this.action)
            this.$emit('updateData', this.action.api, this.searchForm);
        },
        async getInfo() {
            const result = await authorityInfo(INFO_API.team, {
                id: this.drawerData.id
            });
            this.searchForm = result.data;
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
    .textarea,
    p,
    input{
        width: 300px;
    }
    .checkbox-box {
        border: 1px solid;
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
.result-box {
    margin-top: 10px;
    border: 1px solid;
    width: 250px;
    padding:10px 30px;
}
.search-input {
    width: 300px;
}
.drawer-btn{
    position: absolute;
    right: 100px;
    bottom: 50px;
}
.search-result {
    width: 370px;
    border-top: 1px solid #eee;
    border-bottom: 1px dashed #eee;
}
.msg-style {
    position: absolute;
    left: 0;
}
</style>