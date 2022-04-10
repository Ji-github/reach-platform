<template>
    <div>
        <search-form
            :key="numberkey"
            :search-form="tplData.searchForm"
            :query-form="tplData.formItem"
            @onSearch="onSearch"
        />
        <search-list
            :key="numberkey"
            :spinning="spinning"
            :columns="tplData.columns"
            :list-title="tplData.title"
            :list-data="listData"
            :action="tplData.action"
            :total="total"
            @onSearch="onSearch"
            @pageChange="onPageChange"
            @createOrEditAuthority="createOrEditAuthority"
            @createAction="createAction"
        />
        <drawer
            :key="numberkey"
            v-model:visible-drawer="visibleDrawer"
            :btn-loading="btnLoading"
            :cur-drawer="curDrawer"
            :drawer-data="drawerData"
            :list-title="tplData.title"
            :action="curAction"
            @onSearch="onSearch"
            @updateData="onUpdateData"
            @getDataList="getDataList"
        />
    </div>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import SearchForm from './components/SearchForm.vue';
import SearchList from './components/SearchList.vue';
import {AUTHORITY_TPL, INFO_API} from '../../../config/authorityTpl';
import {message} from '@baidu/magic-cube-design-next';
import Drawer from './drawers/index.vue';
import {PAGE_SIZE} from '../../../config/base';
import {fnDealTime} from '../../../utils/index';
import {createAuthority, getAuthorityList} from '../../../api/power';

export default defineComponent({
    components: {
        SearchForm,
        SearchList,
        Drawer
    },
    props: {
        name: {
            type: String,
            default: 'businessManage'
        }
    },
    data() {
        return {
            tplData: {} as any,
            listData: [] as any[],
            curDrawer: '',
            drawerData: {} as any[],
            curAction: {},
            visibleDrawer: false,
            total: '10',
            searchForm: {} as any,
            api: '',
            page_size: 10,
            PAGE_SIZE: PAGE_SIZE,
            numberkey: 0,
            btnLoading: false,
            spinning: false
        };
    },
    watch: {
        name() {
            this.toRender();
        }
    },
    async mounted() {
        this.init();
    },
    methods: {
        toRender() {
            this.numberkey++;
            this.tplData.searchForm = {};
            this.init();
        },
        getDataList(dataList: any) {
            dataList.forEach(async (item: any) => {
                if (item.type && item.type === 'checkbox') {
                    console.log(item, 222)
                    const result = await getAuthorityList(INFO_API[item.propsName as string], {
                        page_size: PAGE_SIZE
                    });
                    console.log(result);
                    item.options = result.data.rows;
                    console.log(item, 222)
                }
                if (item.propsName === 'team_ids') {
                    item.options?.unshift({
                        label: '全部团队',
                        value: 0
                    });
                }
            });
        },
        async init(): Promise<void> {
            this.tplData = AUTHORITY_TPL[this.name];
            this.tplData.formItem.forEach(async (item: any) => {
                if (item.type && item.type === 'select') {
                    const result = await getAuthorityList(INFO_API[item.propsName as string], {
                        page_size: PAGE_SIZE
                    });
                    item.options = result.data.rows.map((it: any) => {
                        if(item.propsName === 'roles') {
                            return {
                                label: it.label,
                                value: it.value
                            }
                        } else if(item.propsName === 'team_names') {
                            return {
                                label: it.name,
                                value: it.name
                            }
                        }
                    console.log(item, it, 666)
                    });
                }
            });
            let params;
            if (this.name === 'businessManage') {
                params = {
                    page_size: this.page_size,
                };
            } else {
                params = {
                    page_size: this.page_size,
                };
            }
            this.getAuthorityList(params);
        },
        async onSearch(searchForm?: any): Promise<void> {
            console.log(this.searchForm, 666);
            if (searchForm) {
                this.searchForm = searchForm;
            };
            this.getAuthorityList({
                ...this.searchForm
            });
        }, 
        async onPageChange(current: number): Promise<void> {
            this.searchForm.page_num = current;
            this.getAuthorityList(this.searchForm);
        },
        async getAuthorityList(searchForm?: any) {
            this.spinning = true;
            try {
                const result = await getAuthorityList(this.tplData.api, searchForm);
                this.listData = result.data.rows;
                this.total = result.data.count;
                this.spinning = false;
            } catch (error) {
                this.spinning = false;
            }
        },
        // 新建或者编辑操作
        createOrEditAuthority(curData?: any, action?: any): void {
            this.curDrawer = this.tplData.drawerName;
            this.visibleDrawer = true;
            // 默认是新建逻辑
            this.drawerData = [];
            const tempAction = {
                actionName: '新建',
                type: 'create',
                api: `/ocp/${this.tplData.path}/insert`
            };
            this.curAction = tempAction;
            // 满足条件是编辑逻辑
            if (curData && action) {
                this.drawerData = curData;
                this.curAction = action;
            }
        },
        async onUpdateData(url: string, searchForm: any): Promise<void> {
            this.btnLoading = true;
            try {
                await createAuthority(url, searchForm);
                this.btnLoading = false;
                this.onSearch();
                message.success('保存成功');
            } catch (error) {
                this.btnLoading = false;
            }
        }
    }
});
</script>

<style lang='less' scoped>
</style>