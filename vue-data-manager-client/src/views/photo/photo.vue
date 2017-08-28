<template>
    <div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item href="/home">首页</Breadcrumb-item>
              <Breadcrumb-item href="/news">相册模块</Breadcrumb-item>
          </Breadcrumb>
           <Tree :data="baseData" @on-select-change="changeNode"></Tree>

          <Button type="primary" @click="modelValue = true">点击添加相册</Button>
           <Button type="primary" @click="removeData()">删除</Button>
          <Button type="primary" @click="editNode">修改</Button>
          <Modal
              v-model="modelValue"
              title="普通的Modal对话框标题"
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
      <Table border :columns="columns1" :data="list"></Table>
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
      return{
        modelValue: false,
        content:"",
        editorOption: {
        },
        module:"cate",
        _id:null,
        baseData: [],
        dataId:null,
        formValidate: {
            title:"111",
            author:"111",
            content:"phone",
            cate:"",
            sub_title:"sub_title",
            time:"",
            _id: null,
            type:3,
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
                  key: 'title'
              },
              {
                  title: '作者',
                  key: 'author'
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
                url:`http://localhost:3000/${this.module}/${this.formValidate.type}`,
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
              this.list = res.data;
              if(this.baseData[0]){ 
                this.baseData[0].children = this.filterCate(this.baseData[0].children);
              }
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
                console.log(node[0])
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
<style scoped>
  .typeChoice{
    background:#FFF;
    color:#000;
  }
</style>