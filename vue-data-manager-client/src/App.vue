<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <template v-if="login">
        <Row type="flex">
        <i-col :span="spanLeft" class="layout-menu-left">
            <Menu active-name="1" theme="dark" width="auto">
                <div class="layout-logo-left">CMS</div>
                <Menu-item name="1">
                     <router-link to="/" activeClass="active" exact><Icon type="home" :size="iconSize"></Icon></router-link>
                    <span class="layout-text"> <router-link to="/" activeClass="active" exact>平台首页</router-link></span>
                </Menu-item>
                <Menu-item name="2">
                    <router-link to="/users" activeClass="active"><Icon type="person" :size="iconSize"></Icon></router-link>
                    <span class="layout-text"> <router-link to="/users" activeClass="active">用户模块</router-link></span>
                </Menu-item>
                <Menu-item name="3">
                    <router-link to="/news" activeClass="active"><Icon type="document-text" :size="iconSize"></Icon></router-link>
                    <span class="layout-text"> <router-link to="/news" activeClass="active">新闻模块</router-link></span>
                </Menu-item>
               <!--  <Menu-item name="4">
                    <router-link to="/note" activeClass="active"><Icon type="document-text" :size="iconSize"></Icon></router-link>
                    <span class="layout-text"> <router-link to="/note" activeClass="active">日记模块</router-link></span>
                </Menu-item>
                <Menu-item name="5">
                    <router-link to="photo" activeClass="active"><Icon type="document-text" :size="iconSize"></Icon></router-link>
                    <span class="layout-text"> <router-link to="/photo" activeClass="active">相册模块</router-link></span>
                </Menu-item> -->
                <Menu-item name="6">
                    <router-link to="/uploads" activeClass="active"><Icon type="pin" :size="iconSize"></Icon></router-link>
                    <span class="layout-text"> <router-link to="/uploads" activeClass="active">上传模块</router-link></span>
                </Menu-item>
                 <Menu-item name="7">
                    <router-link to="/cate" activeClass="active"><Icon type="folder" :size="iconSize"></Icon></router-link>
                    <span class="layout-text"> <router-link to="/cate" activeClass="active">分类模块</router-link></span>
                </Menu-item>
            </Menu>
        </i-col>
            <!-- <Asidebar></Asidebar>  -->
            <i-col :span="spanRight">
                <div class="layout-header">
                    <i-button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                      <router-view></router-view>                    
                    </div>
                </div>
               <footerbar></footerbar>    
            </i-col>
        </Row>
        </template>
        <template v-else>
            <div class="login">
                <h2 width="100%">
                    登录
                </h2>
                <Form ref="formInline" :model="formInline" :rules="ruleInline" inline class="formLogin">
                    <Form-item prop="name">
                        <Input type="text" v-model="formInline.name" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </Form-item>
                    <Form-item prop="password">
                        <Input type="password" v-model="formInline.password" placeholder="Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        </Input>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
                    </Form-item>
                </Form>
            </div>  
        </template>
    </div>
</template>
<script>
    import Asidebar from "./components/Asidebar.vue";
    import {mapGetters,mapActions} from 'vuex'
    var CryptoJS = require("crypto-js");
    import Footerbar from "./components/Footerbar.vue"
    export default {
         data () {
            return {
                spanLeft: 5,
                spanRight: 19,
                // login:true,
                formInline: {
                    name: '1',
                    password: '123456'
                },
                ruleInline: {
                    name: [{
                        required: true,
                        message: '请填写用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                            required: true,
                            message: '请填写密码',
                            trigger: 'blur'
                        },
                        {
                            type: 'string',
                            min: 6,
                            message: '密码长度不能小于6位',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        components:{
            // Asidebar,
            Footerbar
        },
        computed: {
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {
            ...mapActions(['CheckLogin']),
            handleSubmit(name) {
                // this.formInline.password = CryptoJS.MD5(this.formInline.password, {
                //     asString: true
                // }).toString();
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http.post("http://localhost:3000/users/login", this.formInline).then(res => {
                            if (res.data != null && res.data.name && res.data.name.trim().length > 0 ) {
                                this.$store.dispatch("checkLogin",true)
                            } else {
                                this.$Message.error('用户名或密码错误!');
                            }
                        })
    
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },

            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            }
        },
        computed: {
            ...mapGetters(['login']),
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            }
        }
        
    }
</script>
<style scoped leng='sass'>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .active{
        color:#fff;
    }
    .login{
        margin:200px auto;
        width:500px;
        overflow: hidden;
        height:400px;
        background:#000;
        display: flex;
        justify-content:center;
        align-items: center;
        flex-wrap:wrap;
    }
    h2{
        color:#fff;
        width:100%;
        text-align:center;
        font-size:40px;
    }
    .layout-logo-left{
        color:#fff;
        display: flex;
        justify-content: center;
        align-items:center;
    }
</style>