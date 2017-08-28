   var CryptoJS = require("crypto-js");
 export default {
        data () {
            return {
                filter:{
                    page:0, //页数
                    limit: 5, //一页多少个
                    total:0, //总数
                    name: '',  
                },
                ids: [],
                //模态表单
                modelValue:false,
            }
        },
        created(){
            this.getData();
        },
        computed:{
            
        },
        methods:{
            //显示form
            ok () {
                this.$Message.info('点击了确定');
            },
            cancel () {
                this.$Message.info('点击了取消');
            },
            //请求数据
            getData(){
                this.axios.post(`http://localhost:3000/${this.module}/list`,this.filter).then((res) => {
                    this.list = res.data.docs;
                    this.filter.page = res.data.page;
                    this.filter.total = res.data.total;
                })
            },
            removeData(index){
                var that = this;
                this.$Modal.confirm({
                    title: '确认删除数据',
                    content: '<p>确认删除数据</p>',
                    onOk: () => {
                        if(this._id){
                            var _id = this._id
                        }else{
                            var _id = that.list[index]._id;
                        }
                        that.axios.delete(`http://localhost:3000/${this.module}/${_id}`).then((res) => {
                            if(this.filter.page){
                                this.filter.page=1
                            };
                            that.getData();
                        }) 
                    },
                    onCancel: () => {
                         this.$Message.info('取消删除数据');
                    }
                });
            },
            editData(index){
                this.formValidate = this.list[index]
                this.formValidate._id = this.list[index]._id;
                this.modelValue = true
            },
            //监听换页修改
            changePage(page){
                if(this.filter.page){
                    this.filter.page = page;
                    this.getData(); 
                }
            },
            removes(){
             var that = this;
                if (that.ids.length > 0) {
                    this.$Modal.confirm({
                        title: '确认删除数据',
                        content: '<p>确认删除数据</p>',
                        onOk: () => {
                            let deleteUrl = `http://localhost:3000/${that.module}/removes`;
                            that.$http.post(deleteUrl, { ids: that.ids })
                            .then(response => {
                                that.getData();
                                that.$Message.info('成功删除数据');
                            })
                        },
                        onCancel: () => {
                            that.$Message.info('取消删除数据');
                        }
                    });
                } else {
                    alert('请选择要删除的数据')
                }
            },
            //表单提交
            submitData(url,method){
                // this.formValidate.password = CryptoJS.MD5(this.formValidate.password, {
                //     asString: true
                // }).toString();
                this.axios({
                    url,
                    method,
                    data:this.formValidate                    
                }).then((res) => {
                    this.getData();
                    if(this.getTreeData){
                        this.getTreeData();
                    }
                    // 让我们的数据恢复到初始化状态
                    if(this._id){
                        Object.assign(this.$data.formValidate, this.$options.data().formValidate);
                    }
                }).catch((err)=>{
                })
            },
            handleSubmit (name) {
                this.modelValue=false;
               this.commentModel=false;
             this.contentModel=false;
          this.commentContent=false;
                var submitUrl = '';
                var submitMethod = '';
                if(this.formValidate._id != null){
                    submitUrl = `http://localhost:3000/${this.module}/data/` + this.formValidate._id;
                    submitMethod = 'put';
                }else{
                    submitUrl = `http://localhost:3000/${this.module}/data/`;
                    submitMethod = 'post';
                    // this.formValidate._id = this._id;
                };
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!');
                        this.submitData(submitUrl,submitMethod)
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            //表单重置
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            handlerSelectionChange(selection){//选中事件
                this.ids = selection;
                // console.log(selection);
                // if(selection && selection.length>0){
                //     var length = selection.length;
                //     var ids=[];
                //     for(var i = 0;i < length;i ++){
                //         ids.push(selection[i]);
                //     };
                //     this.ids = ids;
                //     console.log(this.ids);
                // }
            },
            search(){
                this.getData();
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
            //筛选新闻。剔除不显示分类
          filterNews(list){
            var newsList = [];
            if(list && list != null){
              var length = list.length;
              for(var i = 0;i < length;i++){
                if(list[i].author){
                  newsList.push(list[i]);
                }
              }
            }
            return newsList;
          },
          //筛选分类。剔除不显示新闻
          filterCate(list){
            var cateList = [];
            if(list && list != null){
              var length = list.length;
              for(var i = 0;i < length;i++){
                if(!list[i].author || list[i].author.trim().length==0){
                  cateList.push(list[i]);
                }
              }
            }
            return cateList;
          },
          changePage(page){
                this.filter.page = page;
                this.getData();
            }
        }
    }
