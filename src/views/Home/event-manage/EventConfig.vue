<template>
    <a-card>
        <span class="title">基础信息</span>
        <a
            v-if="isBasicsSearch"
            class="more-less-style base-color"
            @click="changeBasicsSearchs"
        >
            收起
            <up-outlined/>
        </a>
        <a
            v-else class="more-less-style base-color"
            @click="changeBasicsSearchs"
        >
            展开
            <down-outlined/>
        </a>
        <div v-show="isBasicsSearch">
            <a-form
                :model="searchForm"
                :label-col="{span: 9}"
                :rules="rules"
                ref="formData"
            >
                <a-form-item label="正式/测试" name="isTest">
                    <a-select
                        v-model:value="searchForm.isTest"
                        class="item-width"
                        placeholder="请选择环境"
                    >
                        <a-select-option
                            v-for="(item, index) in defBasicInfo"
                            :key="index"
                            :value="item.value"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="事件标题" name="title">
                    <a-input
                        v-model:value.trim="searchForm.title"
                        placeholder="请输入事件标题"
                        class="item-width"
                    />
                </a-form-item>
                <a-form-item label="类目" name="category">
                    <a-select
                        ref="select"
                        v-model:value="searchForm.category"
                        placeholder="请选择类目"
                        class="item-width"
                        :options="options"
                    />
                    <a
                        class="category-manage base-color"
                        @click="toCategoryList"
                    >配置类目</a>
                </a-form-item>
                <a-form-item label="召回Query" name="query">
                    <a-input
                        v-model:value.trim="searchForm.query"
                        placeholder="请输入召回Query"
                        class="item-width"
                    />
                </a-form-item>
                <a-form-item label="上线时间">
                    <a-date-picker
                        v-model:value="onlineTime"
                        show-time
                        placeholder="请选择上线时间"
                        class="item-width"
                        @change="onChangeOnline"
                    />
                </a-form-item>
                <a-form-item label="下线时间" name="offlineTime">
                    <a-date-picker
                        v-model:value="offlineTime"
                        show-time
                        placeholder="请选择下线时间"
                        class="item-width"
                        @change="onChangeOffline"
                    />
                </a-form-item>
            </a-form>
        </div>
        <span class="title">数据信息</span>
        <a
            v-if="isDataSearch"
            class="more-less-style base-color"
            @click="changeDataSearchs"
        >
            收起
            <up-outlined/>
        </a>
        <a
            v-else class="more-less-style base-color"
            @click="changeDataSearchs"
        >
            展开
            <down-outlined/>
        </a>
        <div v-show="isDataSearch" class="data-container">
            <label style="color:#494C57;margin-right:8px;margin-left:20px;">
                <span style="color:#F2616E;margin-right:2px;margin-left: 1%;">*</span>选择卡片
            </label>
            <a-select
                v-model:value="searchForm.cardId"
                style="width: 200px"
                placeholder="请先选择卡片"
                allow-clear
                :options="cardList"
                option-filter-prop="children"
                @change="changeCard"
            />
            <div class="amis-container">
                <div class="amis-item" v-for="item in amisList" :key="item.id">
                    <div class="amis-title">{{item.form.name}}</div>
                    <amis
                        v-if="item.form.isShowAmis"
                        title=""
                        :controls="item.form.controls"
                        :mode="item.form.mode"
                        :submit-text="item.form.submitText"
                        :init-data="item.form.initData"
                        :name="item.form.name"
                        :debug="false"
                        @onChange="(value) => handleChange(value, item)"
                        @saveAmisScope="saveAmisScope"
                    />
                </div>
            </div>
        </div>
        <div class="btn-container">
            <a-button
                type="primary"
                style="margin-right: 20px"
                @click="save"
            >保存</a-button>
            <a-button
                type="default"
                @click="online"
            >上线</a-button>
        </div>
    </a-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Amis from '../../../components/AmisRenderer.vue';
import {eventConfigRules} from '../../../config/events';
import {getEventInfo, getEventInsert, getEventUpdate} from '../../../api/event';
import moment from 'moment';
import { message } from '@baidu/magic-cube-design-next';
import { categoryList } from '@/api/category';
import { getCardHeadInfo, getCardHeadList } from '@/api/cardHead';
import { getComponent } from '@/api/component';
import { CUSTOM_FORM } from '@/config/customFormList';
import { parseSchema } from '@/utils';
export default defineComponent({
    components: {
        Amis
    },
    data() {
        return {
            searchForm: {} as any,
            onlineTime: '',
            offlineTime: '',
            options: [],
            defBasicInfo: [
                {
                    value: 1,
                    name: '正式'
                },
                {
                    value: 0,
                    name: '测试'
                }
            ],
            isBasicsSearch: true,
            isDataSearch: true,
            cardList: [],
            rules: eventConfigRules,
            amisList: [] as any[], // amis渲染列表
            amisData: {} as any
        };
    },
    async mounted() {
        const result = await categoryList({
            page_size: 999
        });
        this.options = result.data.rows.map((it: any) => {
            return {
                label: it.name,
                value: it.name
            }
        });
        const list = await getCardHeadList({
            page_size: 999
        });
        this.cardList = list.data.rows.map((item: any) => {
            return {
                label: item.name,
                value: item.id
            }
        })
        if(this.$route.query.id) {
            const respData = await getEventInfo(this.$route.query.id as string);
            this.searchForm = respData.data;
            const result = await getCardHeadInfo(this.searchForm.cardId);
            const resp = [] as any[];
            result.data.dataSource.forEach(async (item: any) => {
                const result = await getComponent({id: item}, CUSTOM_FORM["component"].api);
                const schemaRegion = JSON.parse(result.data.render_schema);
                const schemaData = JSON.parse(this.searchForm.component_conf);
                console.log(result.data.uname, schemaData)
                this.amisList.push({
                    form: {
                        title: parseSchema(schemaRegion, 'title'),
                        controls: parseSchema(schemaRegion, 'controls'),
                        mode: parseSchema(schemaRegion, 'mode'),
                        submitText: parseSchema(schemaRegion, 'submitText'),
                        initData: schemaData[result.data.uname],
                        name: result.data.name,
                        uname: result.data.uname,
                        isShowAmis: true
                    }
                })
            })
        }
    },
    watch: {
        'searchForm.insert_time'(value: number) {
            if(value) {
                this.onlineTime = moment(+value) as unknown as string;
            }
        },
        'searchForm.update_time'(value: any) {
            if(value) {
                this.offlineTime = moment(+value) as unknown as string;
            }
        }
    },
    methods: {
        changeBasicsSearchs() {
            this.isBasicsSearch = !this.isBasicsSearch;
        },
        changeDataSearchs() {
            this.isDataSearch = !this.isDataSearch;
        },
        async online() {
            if(this.$route.query.id) {
                await getEventUpdate({
                    id: this.$route.query.id,
                    status: 7
                });
                message.success('上线成功');
            } else {
                message.warn('保存后才能上线');
            }
        },
        async changeCard(value: any) {
            // 这里处理请求的逻辑 渲染amis
            console.log(value);
            const result = await getCardHeadInfo(value);
            const resp = [] as any[];
            result.data.dataSource.forEach(async (item: any) => {
                const result = await getComponent({id: item}, CUSTOM_FORM["component"].api);
                const schemaRegion = JSON.parse(result.data.render_schema);
                this.amisList.push({
                    form: {
                        title: parseSchema(schemaRegion, 'title'),
                        controls: parseSchema(schemaRegion, 'controls'),
                        mode: parseSchema(schemaRegion, 'mode'),
                        submitText: parseSchema(schemaRegion, 'submitText'),
                        initData: parseSchema(schemaRegion, 'data'),
                        name: result.data.name,
                        uname: result.data.uname,
                        isShowAmis: true
                    }
                })
            })
        },
        onChangeOnline(value: any) {
            this.onlineTime = moment(+value / 1000) as unknown as string;
            this.searchForm.insert_time = moment(value).unix() * 1000;
        },
        onChangeOffline(value: any) {
            this.searchForm.update_time = moment(value).unix() * 1000;
            this.offlineTime = moment(+this.searchForm.update_time / 1000) as unknown as string;
        },
        handleChange(value: any, item: any) {
            this.amisData[item.form.uname] = value;
            console.log(this.amisData, item);
        },
        async save() {
            if(this.searchForm.cardId) {
                this.searchForm.component_conf = JSON.stringify(this.amisData);
                // @ts-ignore
                await this.$refs.formData.validate();
                if(this.$route.query.id) {
                    try{
                        this.searchForm.status = 1;
                        await getEventUpdate(this.searchForm);
                        message.success('更新成功');
                    } catch(err) {
                        console.log(err);
                    }
                } else {
                    try {
                        this.searchForm.status = 1;
                        const result = await getEventInsert(this.searchForm);
                        this.$router.replace({
                            path: '/event-config',
                            query: {
                                id: result.data.id
                            }
                        })
                        message.success('新建成功');
                    } catch(err) {
                        console.log(err);
                    }
                }
            } else {
                message.warn('请选择卡片才能保存');
            }
        }
    }
});
</script>

<style scoped lang="less">
.item-width {
    width: 268px;
    font-size: 14px;
}
.category-manage {
    cursor:pointer;
    padding: 10px;
}
.title {
    display: block;
    font-weight: bolder;
    font-size: 1rem;
    padding: 20px;
}
.btn-container {
    margin: 20px 0;
    text-align: center;
}
.data-container {
    margin: 0 auto;
}
.amis-container {
    width: 800px;
    margin: 0 auto;
    .amis-item {
        margin: 10px 0;
        .amis-title {
            padding: 10px 0;
        }
    }
}
</style>