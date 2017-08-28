<template>
    <div>
        <div class="searchBox">
            <Input v-model="filter.name" placeholder="请输入..." style="width: 300px"></Input>
            <Button type="success" @click="search">搜索</Button>
        </div>

        <!--table-->
        <Table width="600" border 
        :columns="tableItem" 
        :data="list" 
        @on-selection-change="handlerSelectionChange"
        class="table"
        ></Table>
            
        </Table>
        <Page :total="filter.total" :page-size="5"  :current="filter.page" @on-change="changePage"></Page>
        <Button type="primary" @click="addNewMamber" class="model-button">增加新成员</Button>
        <Button type="error" @click="removes" class="remove-button">删除用户</Button>
        <!-- 模态窗口 -->
        <Modal
            v-model="modelValue"
            title="增加"
            @on-ok="ok"
            @on-cancel="cancel">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <Form-item label="姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
                </Form-item>
                 <Form-item label="密码" prop="password">
                    <Input v-model="formValidate.password" type="password" placeholder="请输入密码"></Input>
                </Form-item>
                <Form-item label="邮箱" prop="mail">
                    <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
                </Form-item>
                <Form-item label="城市" prop="city">
                    <Select v-model="formValidate.city" placeholder="请选择所在地">
                        <Option value="北京市">北京市</Option>
                        <Option value="上海市">上海市</Option>
                        <Option value="深圳市">深圳市</Option>
                    </Select>
                </Form-item>
                <Form-item label="选择日期">
                    <Row>
                        <Col span="11">
                            <Form-item prop="date">
                                <Date-picker type="date" placeholder="选择日期" v-model="formValidate.date"></Date-picker>
                            </Form-item>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <Form-item prop="time">
                                <Time-picker type="time" placeholder="选择时间" v-model="formValidate.time"></Time-picker>
                            </Form-item>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="性别" prop="gender">
                    <Radio-group v-model="formValidate.gender">
                        <Radio label="男">男</Radio>
                        <Radio label="女">女</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="爱好" prop="interest">
                    <Checkbox-group v-model="formValidate.interest">
                        <Checkbox label="吃饭"></Checkbox>
                        <Checkbox label="睡觉"></Checkbox>
                        <Checkbox label="跑步"></Checkbox>
                        <Checkbox label="看电影"></Checkbox>
                    </Checkbox-group>
                </Form-item>
                <Form-item label="介绍" prop="desc">
                    <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import md5 from 'crypto-js/md5';
    import Base from "../../common/base"
    export default {
       mixins:[Base],
        data () {
            return {
                module:"users",
                //搜索框
                //过滤器。
                //,
                list:[],
                formValidate: {
                    name: 'aa',
                    mail: '11@sss.scom',
                    password:'123456',
                    city: '上海市',
                    gender: '男',
                    interest: ['吃饭','睡觉'],
                    date: '',
                    time: '',
                    desc: 'ssssssssssssssssssssssssssssssssssssssssssssssss'
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    gender: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    interest: [
                        { required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change' },
                        { type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
                    ],
                    time: [
                        { required: true, type: 'date', message: '请选择时间', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请输入个人介绍', trigger: 'blur' },
                        { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
                    ]
                },    
                //表的项名
                tableItem: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed :'left'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        width: 80,
                        align:"center",
                    },
                    {
                        title: '邮箱',
                        key: 'mail',
                        width:150
                    },
                    {
                        title: '性别',
                        key: 'gender',
                        width: 100
                    },
                    {
                        title: '城市',
                        key: 'city',
                        width: 100
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        fixed:"right",
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editData(params.index)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeData(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ]
            }
        },
        methods:{
            
                //跳页监听
            changePage(page){
                this.filter.page = page;
                this.getData();
            },
            addNewMamber(){
                this.modelValue = true;
                var parentId=this.formValidate.parentId;
                var thisId = this.formValidate._id;
                Object.assign(this.$data.formValidate, this.$options.data().formValidate);
            }
        }    
    }
</script>
<style>
    .model-button,.remove-button{
        margin-top:20px;
    }
    .table{
        margin:20px;
    }
</style>