<template>
    <div>
      <div class="layout-breadcrumb">
          <Breadcrumb>
              <Breadcrumb-item href="#/home">首页</Breadcrumb-item>
              <Breadcrumb-item href="#/cate">上传管理</Breadcrumb-item>
          </Breadcrumb>
      </div>
      <div class="btns">
        <Button type="error" @click="removes">删除数据</Button>
        <Input icon="search" v-model="filter.originalname" placeholder="请输入..." style="width: 200px"></Input>
        <Button type="ghost" @click="search">搜索数据</Button>
      </div>
      <div class="uploads-content">
          <Tree :data="baseData" @on-select-change="selectChange" class="tree"></Tree> 
           <Table border width="800"  :columns="columns" :data="list" @on-selection-change="handlerSelectionChange" 
            class="table"
           ></Table>
      </div> 

      <div>
        <Upload
            ref="upload"
            :format="['jpg','jpeg','png','gif']"
            :max-size="2048"
            name="avatar"
            :on-success="handleSuccess"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            :data="postData"
            :action="postUrl"
            style="display: inline-block;width:58px;">
          <Button type="ghost" icon="ios-cloud-upload-outline" class="uploadsBtn">上传文件</Button>
        </Upload>
      </div> 
      <Page :total="filter.total" :page-size="5"  :current="filter.page" @on-change="changePage"></Page>  
      <Modal
          v-model="modelValue"
          title="大图"
          @on-ok="ok"
          @on-cancel="cancel">
          <img :src="imgSrc" alt="图片都去哪儿啦"  class="modelImag">
      </Modal>
  </div>
    
</template>
<script>
    import Base from "../../common/base.js";
    export default {
      mixins:[Base],
        data(){
          return{
            module:"uploads",
            modelValue:false, //模态窗口
            imgSrc:"", //大图的src
            baseData: [],
            postData:{
              _id: null,
              originalname:"1",
              size:"1",
              filename:"1",
              path:"1",
              date:"1"
            },
            formValidate: {
              type: 1
            },
            list:[],
            imgName: '',
            visible: false,
            uploadList: [],

            columns: [{
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '_id',
              key: '_id',
              width: 100,
              align:"center",
            },
            {
              title: '原始名称',
              key: 'originalname',
              width: 100,
              align:"center",
            },
            {
              title: '文件大小',
              key: 'size',
              width: 120,
              align:"center",
            },
            {
              title: '文件名称',
              key: 'filename',
              width: 100
            },
            {
              title: '文件',
              key: 'path',
              width: 200,
              align:"center",
              render: (h, params) => {
                  return h('div', [
                      h('img', {
                          attrs: {
                              src:`http://localhost:3000/${params.row.filename}`
                          },
                          style: {
                              width:'50px',
                              height:"50px",
                              textAlign:"center"
                          }
                      }, '编辑')
                      
                  ]);
              } 
                             
              } ,
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
                                this.imgSrc = `http://localhost:3000/${params.row.filename}`
                                this.modelValue = true
                              }
                          }
                      }, '查看'),
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
                                  this.removeData(params.index)
                              }
                          }
                      }, '删除')
                      // h('Button', {
                      //     props: {
                      //         type: 'error',
                      //         size: 'small'
                      //     },
                      //     on: {
                      //         click: () => {
                      //           var _id = params.row._id;
                      //           console.log(_id)
                      //             this.changPic(_id)
                      //         }
                      //     }
                      // }, '修改')
                  ]);
              }
          }
          ]
        }
        },
        mounted () {
          this.uploadList = this.$refs.upload.fileList;
        },
        created(){
          this.getTreeData();
        },
        methods:{
            getTreeData(){
              this.axios({
                url:`http://localhost:3000/cate/3`,
                method:"get"
              }).then((res)=>{
                this.baseData = res.data;
                if(this.baseData[0]){ 
                    this.baseData[0].children = this.filterCate(this.baseData[0].children);
                  }
              })
            },

            changeType(type){
              this.formValidate.type = type;
              this.getData();
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                // 从 upload 实例删除数据
            },
            handleSuccess(file) {  
              console.log(file);            
              this.getData()
              this.$refs.upload.clearFiles();
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleBeforeUpload (file) {
                // var name = file.name;
                // name = name.replace(/(\..+)$/, "");
                // this.postData.originalname=file.name;
                // this.postData.date = file.lastModifiedDate;
                // this.postData.size = file.size ;
                // this.postData.filename = name;
                // console.log(this.postData);
                const check = this.uploadList.length < 5;

                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传 5 张图片。'
                    });
                }
                if(!this.postData._id){
                  this.$Notice.warning({
                        title: '请选择分类。'
                    })
                  }
                return check;
            },
            selectChange(node) {
              if(node[0]){
                this.postData._id = node[0]._id;
                this.filter.cateId = node[0]._id;
                this.getData()

              }
            },
            uploadsSeccess(event, file, fileList){

            },
            // changPic(){
            //   console.log(11111,this.postData._id)
            //   this.axios({
            //     url:"http://localhost:3000/uploads/filedata/${id}",
            //     method:"me",
            //     data:{
            //       name:1
            //     }
            //   }).then(()=>{
            //     console.log(res);
            //   })
            // }
        },
        computed:{
          postUrl(){
            return `http://localhost:3000/uploads/filedata/${this.postData._id}`
          }
        }
    }
</script>
<style scoped leng="sass">
  .typeChoice{
    background:#FFF;
    color:#000;
  }
  .demo-upload-list{
      display: inline-block;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-right: 4px;
  }
  .demo-upload-list img{
      width: 100%;
      height: 100%;
  }
  .demo-upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
      display: block;
  }
  .demo-upload-list-cover i{
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
  }
  .uploadsBtn{
    margin-top:20px;
    width: 100px;
  }
  .modelImag{
    text-align:center;
    vertical-align:center;
  }
  .uploads-content{
    margin-top:10px;
    display:flex;
    }
    .tree{
      margin-right: 10px;
      float:left;
      width:150px;
    }
    .table{
      float:left;
      width:500px;
    }
</style>