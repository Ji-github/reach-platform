<template>
    <a-layout style="height: 100%;">
        <a-button
            type="primary"
            class="preview-btn"
            @click="showDrawer"
        >预览</a-button>
        <div id="amis-editor"></div>
        <a-button
            class="submit-btn"
            type="primary"
            shape="circle"
            size="large"
            @click="onSubmit"
        >保存当前表单</a-button>
        <a-drawer
            v-model:visible="visible"
            title="预览页面和数据"
            placement="right"
            :closable="false"
            :width="1000"
        >
            <amis
                :title="title"
                :controls="controls"
                :mode="mode"
                :submit-text="submitText"
                :init-data="initData"
            />
            <!-- <a-card title="数据接口">
                {{ dataSchema }}
            </a-card> -->
        </a-drawer>
    </a-layout>
</template>

<script lang="ts">
/* globals amisEditorSDK */
import {load} from '../../../utils/asyncLoad';
import {defineComponent} from 'vue';
import Amis from '../../../components/AmisRenderer.vue';
import {parseSchema, formatSchema} from '../../../utils/index';
// @ts-ignore
import {amis2JsonSchema} from 'amis2schema/dist/index';

export default defineComponent({
    props: {
        initSchema: {
            type: String,
            default: `{"type":"page","title":"简单页面","body":{"type":"form","name":"sample2",
            "controls":[{"type":"text","name":"test","label":"Label","placeholder":"Placeholder"}]}}`
        }
    },
    components: {
        Amis
    },
    data() {
        return {
            schema: {
                body: {}
            },
            visible: false,
            title: '',
            controls: [],
            mode: '',
            submitText: '',
            initData: {},
            dataSchema: {}
        };
    },
    methods: {
        onChange(value: any) {
            this.schema = value;
            this.dataSchema = amis2JsonSchema(this.schema.body);
        },
        onSubmit() {
            // 可以在这里增加提交后的处理逻辑
            formatSchema(this.schema);
            this.$emit('get-schema', {
                renderSchema: this.schema,
                dataSchema: this.dataSchema
            });
        },
        showDrawer() {
            console.log(this.schema)
            this.title = parseSchema(this.schema, 'title');
            this.controls = parseSchema(this.schema, 'controls');
            this.mode = parseSchema(this.schema, 'mode');
            this.submitText = parseSchema(this.schema, 'submitText');
            this.initData = parseSchema(this.schema, 'data');
            const res = amis2JsonSchema(this.schema.body);
            this.dataSchema = res;
            this.visible = true;
        }
    },
    mounted() {
        load('amisEditorSDK').then(() => {
            if (!amisEditorSDK) {
                console.error('amisEditorSDK is not defined!');
                return;
            }

            const schema = JSON.parse(this.initSchema);
            formatSchema(schema);
            amisEditorSDK.setup({
                id: 'amis-editor',
                onChange: this.onChange,
                initSchema: schema
            });
            this.schema = schema;
            this.dataSchema = amis2JsonSchema(schema.body);
        });
    }
});
</script>
<style lang="less" scoped>
#amis-editor {
    height: 700px;
}
.submit-btn {
    position: fixed;
    bottom: 100px;
    right: 100px;
    z-index: 10;
    width: 120px;
    height: 80px;
}
.preview-btn {
    position: absolute;
    top: 154px;
    right: 100px;
    z-index: 10;
    width: 100px;
    // 预览按钮不会因为是查看操作而屏蔽
    pointer-events: painted !important;
}
</style>
<style lang="less">
.amis-editor-container {
    height: 100%;
}
</style>