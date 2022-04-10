<template>
    <div class="guide-container" :style="{height: containerHeight + 'px'}">
        <div class="guide-header">
            <div class="guide-head">
                <div class="item">
                    <ul>
                        <li v-if="!cookie"><a @click="userLogin">登陆</a></li>
                        <li><a href="/">首页</a></li>
                        <li><a href="/event-list">数据中心</a></li>
                    </ul>
                </div>
            </div>
            <div class="guide-content">
                <span class="content-text">数据中台欢迎你</span>
            </div>
            <div class="guide-btn">
                <a-modal
                    v-model:visible="visible"
                    title="欢迎您登录"
                    :closable="false"
                >
                    <template #footer>
                        <a-button
                            key="back"
                            @click="handleRegister"
                        >注册</a-button>
                        <a-button
                            key="submit"
                            type="primary"
                            @click="handleLogin"
                        >登陆</a-button>
                    </template>
                    <a-form
                        ref="formData"
                        :model="searchForm"
                        name="login"
                        :label-col="{span: 6}"
                        :wrapper-col="{span: 16}"
                    >
                        <a-form-item
                            label="用户名"
                            name="username"
                            :rules="[{required: true, message: 'Please input your username!'}]"
                        >
                            <a-input v-model:value="searchForm.username"/>
                        </a-form-item>
                    </a-form>
                </a-modal>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { message } from '@baidu/magic-cube-design-next';
import {defineComponent} from 'vue';
import {Vue} from 'vue-class-component';
import {getLogin, getRegister} from '../api/navMenu';

export default defineComponent({
    data() {
        return {
            searchForm: {
                username: '',
                password: ''
            },
            visible: false,
            curList: [],
            currentIndex: 1, // 当前索引
            noTransition: false, // 是否需要过度动画
            containerHeight: document.documentElement.clientHeight,
            cookie: false
        };
    },
    async mounted() {
        this.cookie = window.localStorage.getItem('username') ? true : false;
        if(this.cookie) {
            this.visible = false;
        } else {
            this.visible = true;
        }
    },
    methods: {
        userLogin() {
            this.visible = true;
        },
        async handleLogin() {
            const formRef = this.$refs.formData as Vue;
            // @ts-ignore
            await formRef.validate();
            const result = await getLogin({
                loginId: this.searchForm.username
            });
            if(!result) {
                message.warn('无效的用户名，请重新输入或注册');
            } else {
                message.success('登陆成功');
                this.visible = false;
                window.localStorage.setItem('status', result.data.status);
                window.localStorage.setItem('username', result.data.loginId);
                this.cookie = true;
            }
        },
        async handleRegister() {
            const result = await getRegister({
                loginId: this.searchForm.username
            });
            if(!result.data) {
                message.warn('用户已存在,请登录');
            } else {
                message.success('创建成功');
            }
        },
    },
});
</script>

<style lang="less" scoped>
:root,
body {
    height: 100%;
}
.guide-container {
    width: 100%;
    overflow: hidden;
    height: 100%;
    .guide-header {
        width: 100%;
        height: 100%;
        background-image: url('../assets/guide/header.png');
        background-size: 120%;
        background-position: 50% 60%;
        .guide-head {
            width: 1440px;
            margin: 0 auto;
            height: 76px;
            line-height:76px;
            .item {
                float: right;
                ul {
                    float: right;
                    list-style: none;
                    li {
                        float: left;
                        height: 76px;
                        line-height: 76px;
                        margin: 0 12px;
                        a {
                            color: #fff;
                        }
                    }
                    li:last-child {
                        margin-right: 24px;
                    }
                }
            }
        }
        .guide-content {
            position: relative;
            width: 100%;
            margin-top: 3%;
            .content-text {
                position: absolute;
                left: 50%;
                color: #fff;
                font-size: 4rem;
                transform: translateX(-50%);
            }
        }
        .guide-btn {
            width: 100%;
            text-align: center;
            margin-top: 20%;
            .button {
                position: relative;
                width: 222px;
                height: 56px;
                line-height: 56px;
                font-size: 20px;
                border-radius: 16px;
                background-image: url('../assets/guide/btn.png');
                background-size: 100%;
                display: inline-block;
            }
        }
    }
}
</style>