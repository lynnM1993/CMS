<template>
    <div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item href="#/home">首页</Breadcrumb-item>
              <Breadcrumb-item href="#/cate">分类管理</Breadcrumb-item>
          </Breadcrumb>
      </div>
      <div>
          <Button-group>
            <Button @click="changeType(1)" :class="{typeChoice:formValidate.type===1}" >日记</Button>
            <Button @click="changeType(2)" :class="{typeChoice:formValidate.type===2}" >新闻</Button>
            <Button @click="changeType(3)" :class="{typeChoice:formValidate.type===3}" >相册</Button>
          </Button-group>  
          <Tree :data="baseData" @on-select-change="changeNode"></Tree> 
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <Form-item label="分类名称" prop="title">
                <Input v-model="formValidate.title" placeholder="请输入分类名称"></Input>
              </Form-item>
              <Button type="primary" @click="editNode()">修改</Button>
              <Button type="primary" @click="removeData()">删除</Button>
          
              <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
              <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </Form>
      </div>    
  </div>
    
</template>
<script>
    import Base from "../../common/base.js";
    export default {
      mixins:[Base],
        data(){
          return{
            current_Id:null,
            _id:null,
            module:"cate",
            baseData: [],
            dataId:null,
            formValidate: {
              _id: null,
              type: 1,
              title: '',
              parentId: null,
              currentParentId: null,
              current_Id:null,
            },

            ruleValidate: {
              title: [{
                required: true,
                message: '分类名称不能为空',
                trigger: 'blur'
              }]
            },
          }        
        },
        created(){
            this.getData()
        },
        methods:{
            getData(){
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
            changeNode(node){
              if(node[0]){
                this._id = node[0]._id;//删除的标记 标记修改
                this.formValidate.parentId = node[0]._id; 
                this.formValidate.currentParentId = node[0].parentId; 
                this.formValidate._id = null;  //设为null让他识别是添加而不是修改。
              }
            },
            editNode(){
              this.formValidate._id = this._id; // 设置_id.识别是修改
              this.formValidate.parentId = this.formValidate.currentParentId
              this.handleSubmit('formValidate');
            },
            //修改type
            changeType(type){
              this.formValidate.type = type;
              this.getData();
            }

        }
    }
</script>
<style>
  .typeChoice{
    background:#FFF;
    color:#000;
  }

</style>