<template>
    <a-card :class="actionType === 'check' ? 'no-action' : ''">
        <a-form
            ref="formRef"
            :model="addFormState"
            :rules="rules"
            :label-col="{span: 4}"
            :wrapper-col="{span: 14}"
        >
            <a-col
                v-for="(item, index) in addForm"
                :key="index"
            >
                <a-form-item
                    :label="item.title"
                    :name="item.propsName"
                >
                    <a-input
                        v-model:value="addFormState[item.propsName]"
                        :disabled="item.propsName === 'uname' && id"
                        :placeholder="item.placeHolder"
                    />
                </a-form-item>
            </a-col>
        </a-form>
        <template v-if="id">
            <amis-editor
                v-if="addFormState.render_schema"
                :init-schema="addFormState.render_schema"
                @get-schema="getSchema"
            />
        </template>
        <template v-else>
            <amis-editor @get-schema="getSchema"/>
        </template>
    </a-card>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import {Vue} from 'vue-class-component';
import {message} from '@baidu/magic-cube-design-next';
import {ValidateErrorEntity} from '@baidu/magic-cube-design-next/es/form/interface';
import AmisEditor from '../AmisEditor/AmisEditor.vue';
import {CUSTOM_FORM} from '../../../config/customFormList';
import {CUSTOM_FORM_ADD_FORM} from '../../../config/custom-form';
import { getComponent, saveComponent } from '@/api/component';


export default defineComponent({
    components: {
        AmisEditor
    },
    data() {
        return {
            id: '',
            curRouter: 'component',
            formRef: '',
            CUSTOM_FORM,
            addForm: CUSTOM_FORM_ADD_FORM,
            addFormState: {
                name: '',
                uname: '',
                description: '',
                data_schema: '',
                render_schema: '',
                type: undefined
            } as any,
            rules: {
                name: [
                    {required: true, message: '组件名称不能为空', trigger: 'blur'},
                ],
                uname: [
                    {required: true, message: '组件英文名称不能为空', trigger: 'blur'},
                ]
            },
            currentview: '',
            actionType: ''
        };
    },
    async mounted() {
        this.id = this.$route.query.id as string;
        this.curRouter = this.$route.query.curRouter as string;
        // 操作类型，查看为check
        this.actionType = this.$route.query.actionType as string;
        this.addForm = CUSTOM_FORM[this.curRouter].addForm;
        if (this.id) {
            await this.getComponent(this.id);
        }
        const vueFormFile = CUSTOM_FORM[this.curRouter].vueFormFile as string;
        if (vueFormFile) {
            this.currentview = vueFormFile;
        }
    },
    methods: {
        async getComponent(id: string) {

            const responseData: any = await getComponent({id: id}, CUSTOM_FORM[this.curRouter].api);
            if (responseData.status === 0) {
                this.addFormState = responseData.data;
            }
            else {
                message.error(responseData.msg);
            }
        },
        getSchema(schemaValue: any) {
            schemaValue.renderSchema.name = this.addFormState.uname;
            schemaValue.renderSchema.body.name = this.addFormState.uname;
            this.addFormState.render_schema = schemaValue.renderSchema;
            this.addFormState.data_schema = schemaValue.dataSchema;
            this.saveForm();
        },
        saveForm() {
            (this.$refs.formRef as Vue & { validate: () => any })
                .validate()
                .then(async () => {
                    if (this.id) {

                    }
                    // delete this.addFormState.id;
                    this.addFormState.data_schema = JSON.stringify(this.addFormState.data_schema);
                    this.addFormState.render_schema = JSON.stringify(this.addFormState.render_schema);
                    const responseData: any = await saveComponent(this.addFormState, CUSTOM_FORM[this.curRouter].api);
                    if (responseData.status === 0) {
                        message.success('保存成功');
                        this.$router.push(CUSTOM_FORM[this.curRouter].url);
                    }
                    else {
                        message.error(responseData.msg);
                    }
                })
                .catch((error: ValidateErrorEntity<any>) => {
                    console.log('error', error);
                });
        }
    }
});
</script>
