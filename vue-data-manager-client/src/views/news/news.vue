<template>
    <div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item href="/home">首页</Breadcrumb-item>
              <Breadcrumb-item href="/news">新闻模块</Breadcrumb-item>
          </Breadcrumb>
          <Button type="primary" @click="modelValue = true">点击添加新闻</Button>
           <Button type="primary" @click="removeData()">删除</Button>
          <Button type="primary" @click="editNode">修改</Button>
          <Modal
              v-model="contentModel"
              title="内容"
              @on-ok="ok"
              @on-cancel="cancel">
              <p v-html="formValidate.content"></p>
          </Modal>
          <Modal
              v-model="commentContent"
              title="内容"
              @on-ok="ok"
              @on-cancel="cancel">
              <p v-html="formValidate.comment"></p>
          </Modal>
          <Modal
              v-model="commentModel"
              title="评论"
              @on-ok="ok"
              @on-cancel="cancel">
              <Table border :columns="columns2" :data="commentList"></Table>
              <Form ref="sssssssssss" :model="formValidate"  :label-width="80" :rules="ruleCustom">
                <Form-item label="name" prop="name">
                    <Input type="text" v-model="name"></Input>
                </Form-item>
                <Form-item label="comment" prop="comment">
                    <Input type="text" v-model="comment" number></Input>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="addComment('formValidate')">提交</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </Form-item>
            </Form>
          </Modal>
          <Modal
              v-model="modelValue"
              title="添加新闻"
              @on-ok="ok"
              @on-cancel="cancel">
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                  <Form-item label="分类名称" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入分类名称"></Input>
                  </Form-item>
                  <Form-item label="作者" :label-width="100">
                      <Input v-model="formValidate.author"></Input>
                  </Form-item>
                  <Form-item label="时间" :label-width="100">
                      <Input v-model="formValidate.time"></Input>
                  </Form-item>
                   <!-- 编辑器 -->
                   <span>内容</span>
                  <quill-editor v-model="formValidate.content"
                                ref="myQuillEditor"
                                :options="editorOption"
                                @blur="onEditorBlur($event)"
                                @focus="onEditorFocus($event)"
                                @ready="onEditorReady($event)"
                                >
                  </quill-editor>
                  <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                  <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
              </Form>
          </Modal>
      </div> 
      <div>
        <div id="news-content">
       <Tree :data="baseData" @on-select-change="changeNode" class="tree"></Tree><Table border :columns="columns1" :data="list"></Table>
      </div>
      </div>
      
  </div>
</template>
<script>
  import Base from "../../common/base.js";
  import { quillEditor } from 'vue-quill-editor';
  export default {
    mixins:[Base],
    components:{
      quillEditor
    },
    data(){
     // const validatePass = (rule, value, callback) => {
     //      if (value === '') {
     //          callback(new Error('内容不能为空'));
     //      } 
     //  };
     //  const validatePassCheck = (rule, value, callback) => {
     //      if (value === '') {
     //          callback(new Error('内容不能为空'));
     //      } 
     //  };
      return{
        commentList:[],
        name:"",
        comment:"",
        modelValue: false,
        commentModel:false,
        contentModel:false,
        commentContent:false,
        content:"",
        editorOption: {
        },
        ruleCustom: {
          name: [{
              required: true,
              message: '分类名称不能为空',
              trigger: 'blur'
            }],
            content: [{
              required: true,
              message: '分类名称不能为空',
              trigger: 'blur'
            }]
        },
        module:"cate",
        _id:null,
        baseData: [],
        dataId:null,
        formValidate: {
            title:"",
            author:"",
            content:"DDD",
            cate:"",
            sub_title:"sub_title",
            formValidate:"",
            time:"",
            count:0,
            _id: null,
            comment:[{
              name:"",
              comment:""
            }],
            type: 2,
            parentId: null,
            currentParentId: null,
            current_Id:null
          },
          ruleValidate: {
            title: [{
              required: true,
              message: '分类名称不能为空',
              trigger: 'blur'
            }]
          },
          list:[],
           columns1: [
              {
                  title: '姓名',
                  key: 'name'
              },
              {
                title: '评论',
                key: 'comment'
              }],
              columns1: [
              {
                  title: '姓名',
                  key: 'title'
              },
              {
                  title: '作者',
                  key: 'author'
              },
               {
                  title: '评论数',
                  key: 'count'
              },
              {
                title: '操作',
                key: 'action',
                width: 300,
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
                                  this.formValidate = params.row;
                                     this.editData(params.index)
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                  this.formValidate = params.row;
                                   this.removeData(params.index)
                                }
                            }
                        }, '删除'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                  this.formValidate = params.row;
                                  this.commentList = params.row.comment;
                                  this.commentModule(params.row)
                                }
                            }
                        }, '评论'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.contentModel = true;
                                    this.checkContent(params.index);
                                }
                            }
                        }, '查看')
                    ]);
                }
            }
          ],
          columns2: [
              {
                  title: '姓名',
                  key: 'name'
              },
              {
                title: '评论',
                key: 'comment'
              },
              {
                title: '操作',
                key: 'action',
                width: 300,
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
                                     this.editComment(params.index)
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                   this.removeComment(params.index)
                                }
                            }
                        }, '删除')
                    ])
                }
            }
          ],
        }       
      },
      created(){
          this.getTreeData();
      },
      methods:{
          getTreeData(){
            this.axios({
              url:`http://localhost:3000/cate/2`,
              method:"get"
            }).then((res)=>{
              this.baseData = res.data;
              if(this.baseData[0]){ 
                  this.baseData[0].children = this.filterCate(this.baseData[0].children);
                }
            })
          },
          getData(){
            this.axios({
              url:`http://localhost:3000/${this.module}/${this.formValidate._id}`,
              method:"get"
            }).then((res)=>{

            var length = res.data.length;
            if(length>0){
              for(var i = 0;i <length;i++ ){
                res.data.count = this. res.data.comment.length;
              }
            }
              this.list = res.data;
              /*if(this.baseData[0]){ 
                this.list[0].children = this.filterCate(this.baseData[0].children);
              }*/
            })
          },
          onEditorBlur(editor) {
          },
          onEditorFocus(editor) {

          },
          onEditorReady(editor) {
          },
          onEditorChange({ editor, html, text }) {
          },
          changeNode(node){
              if(node[0]){
                // console.log(node[0])
                // //设置新闻分类的type
                // this.formValidate.type = node[0]._id;
                // if(this.formValidate.type){
                // this.getData();
                // }
                this.formValidate.cate = node[0].title;
                var list = node[0].children;
                this.list=this.filterNews(list); //再表格中显示他的子级；不显示分类的新闻：      
                this._id = node[0]._id;//删除的标记 标记修改
                this.formValidate.parentId = node[0]._id; 
                this.formValidate.currentParentId = node[0].parentId; 
                this.formValidate._id = null;  //设为null让他识别是添加而不是修改。
              }
              if(this.formValidate.author){
                this.list = this.formValidate.comment;
              }
            },
          editNode(){
            this.formValidate._id = this._id; // 设置_id.识别是修改
            this.formValidate.parentId = this.formValidate.currentParentId
            this.modelValue=true;
          },
          ok () {
              this.$Message.info('点击了确定');
          },
          cancel () {
              this.$Message.info('点击了取消');
          },
          commentModule(index){
    
            this.commentModel = true;
            // this.formValidate = this.list[index];
            // console.log(this.formValidate)
            // this.handleSubmit('formValidate');
          },
          checkContent(index){
            this.formValidate = this.list[index];
          },
          addComment(){
            console.log(this.formValidate)
           this.formValidate.count = this.formValidate.comment.length+1;
            this.formValidate.comment.push({name:this.name,comment:this.comment});
            this.handleSubmit('formValidate');
          },
          editComment(index){
            if(this.name.trim().length == 0 || this.comment.trim().length == 0){
              alert("不能为空");
            }else{
              this.formValidate.comment[index] = {name:this.name,comment:this.comment};
            this.handleSubmit('formValidate');
            }
            
          },
          removeComment(index){
            this.formValidate.comment.splice(index,1);
            this.formValidate.count --;
            this.handleSubmit('formValidate');
          }
        },
        computed: {
          editor() {
            return this.$refs.myQuillEditor.quill
          }
        },
        mounted() {
          // you can use current editor object to do something(quill methods)
        
        }
    }
</script>
<style scoped leng="sass">
  .typeChoice{
    background:#FFF;
    color:#000;
  }
  #news-content{
    display:flex!important;
    margin-top:10px;
    
    justify-content:center;
    flex-wrap:nowrap!important;
  }
.tree{
    margin-right: 10px;
    width:150px;
  }
  .commentTable{

  }
</style>