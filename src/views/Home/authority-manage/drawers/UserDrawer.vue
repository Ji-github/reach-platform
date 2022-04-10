<template>
    <a-form
        v-if="action.actionName === '新建'"
        :model="searchForm"
        :rules="formRules"
        class="form-item"
    >
        <a-form-item
            label="添加用户"
            name="name"
        >
            <a-input
                v-model:value="searchForm.name"
                class="search-input"
                placeholder="请输入用户名"
            />
        </a-form-item>
        <a-form-item
            v-for="item in drawerForm"
            :key="item.propsName"
            :label="item.type === 'checkbox' ? item.title : ''"
            :name="item.propsName"
        >
            <a-checkbox-group
                v-if="item.type === 'checkbox'"
                v-model:value="searchForm[item.propsName]"
                class="checkbox-box"
            >
                <a-checkbox
                    v-for="data in item.options"
                    :key="data.value"
                    :value="data.value"
                >{{ data.label }}</a-checkbox>
            </a-checkbox-group>
        </a-form-item>
    </a-form>
    <a-form
        v-else
        ref="formRef"
        :model="searchForm"
        class="form-item"
    >
        <a-form-item
            v-for="item in drawerForm"
            :key="item.propsName"
            :label="item.title"
            :name="item.propsName"
        >
            <a-checkbox-group
                v-if="item.type === 'checkbox'"
                v-model:value="searchForm[item.propsName]"
                class="checkbox-box"
            >
                <a-checkbox
                    v-for="data in item.options"
                    :key="data.value"
                    :value="data.value"
                >{{ data.label }}</a-checkbox>
            </a-checkbox-group>
            <p v-else style="margin: 0;">{{ searchForm[item.propsName] }}</p>
        </a-form-item>
    </a-form>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {FORM_RULES, USER_DRAWER_FORM} from '../../../../config/authorityTpl/user';
import {INFO_API} from '../../../../config/authorityTpl/index';
import {cloneDeep} from 'lodash';
import { authorityInfo, userSearch } from '../../../../api/power';

export default defineComponent({
    data() {
        return {
            searchForm: {} as any,
            drawerForm: USER_DRAWER_FORM,
            isShow: true,
            formRules: FORM_RULES,
            msg: '无',
            loading: false
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
        this.$emit('getDataList', this.drawerForm);
    },
    methods: {
        async getInfo() {
            const result = await authorityInfo(INFO_API.user, {
                id: this.drawerData.id
            });
            return result.data;
        },
        clearForm() {
            this.searchForm = {} as any;
        },
        // 编辑、新建数据
        async updateData(): Promise<void> {
            // 不影响页面，深拷贝一份数据
            let params = cloneDeep({
                ...this.searchForm,
                opuser: window.localStorage.getItem('username')
            });
            console.log(this.searchForm, 888);
            this.$emit('updateData', this.action.api, params);
        },
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
    p,
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