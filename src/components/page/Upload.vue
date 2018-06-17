<!-- banner管理 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-button type="primary" plain @click="addSchool">添加banner</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="创建日期"></el-table-column>
                <el-table-column label="banner">
                  <template slot-scope="props">
                    <img :src="props.row.img" alt="" style="width:100px;height:auto;">
                  </template>
                </el-table-column>
                 <el-table-column label="操作">
                   <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                 </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="添加banner" :visible.sync="addVisible" width="500px">
            <el-form ref="form" :model="form" label-width="100px">
                <!-- <el-form-item label="图片">
                  <div class="file-put">

                  </div>
                  <span>选择文件</span>
                </el-form-item> -->
            </el-form>
            <input type="file" id="file" @change="fileChange">
            <!-- <p class="file-name">{{fileName}}</p> -->
            <p @click="uploadImage" style="display: inline-block;color:#ffffff;background:#409EFF;width:100px;text-align: center;border-radius: 10px;cursor:pointer;height:35px !important;line-height:35px;">上传</p>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">添加</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                cur_page: 1,
                fileName:'',
                schoolId:'',
                addVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    atar: '',
                    position: '',
                    hospital: '',
                    department: '',
                    good_at: '',
                    introduction: '',
                    content: '123'
                },
                imageUrl: '',
                deleteId: ''
            }
        },
        created() {
            this.getData();
        },
        computed: {
           token(){
             return {
               Authorization: `bearer ${localStorage.getItem('admin-token')}`
             }
           }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            fileChange(){                                           //选择文件
              this.fileName = document.getElementById("file").files[0].name
            },
            uploadImage(){
               const self = this
               if(this.fileName == ''){
                 self.$message.error('请先选择上传的图片文件')
                 return
               }
               var files = document.getElementById("file").files[0]
               var url = '/api/admin/upload/upload-image'
               var xhr = new XMLHttpRequest()
               var formData = new FormData()
               formData.append('img',files)
               xhr.open('POST', url, true)
               xhr.onreadystatechange = function(response){
                  if(xhr.readyState==4){
                    if(xhr.status==200){
                       let res = JSON.parse(xhr.responseText)
                       console.log('res',res);
                      if(res.code == 200){
                       self.$message.success('上传图片成功')
                       self.form.atar = res.data.url
                       console.log('url',self.form.atar)
                      }else{
                       self.$message.error(res.msg)
                      }
                    }else{
                     self.$message.error(`系统繁忙(code:${xhr.status})`)
                    }
                  }
               }
               xhr.setRequestHeader("Authorization", `bearer ${localStorage.getItem('admin-token')}`)
               xhr.send(formData)
            },
            selectChange(){
              this.getData()
            },
            getData(){
              const self = this
              console.log('sllsglhgl');
              this.$axios({
                method: 'get',
                url: `/api/admin/banner/list/10?page=1`,
                headers: {
                  Authorization: `bearer ${localStorage.getItem('admin-token')}`
                }
              })
              .then((res) => {
                  self.tableData = res.data.data.list
                  console.log('res-zdi',self.tableData);
              })
            },
            addSchool(){
              this.fileName = ''
              this.addVisible = true
            },
            // 保存编辑
            saveEdit() {
              const self = this
              this.$axios({
                method: 'post',
                url: `/api/admin/banner/store`,
                headers: {
                  Authorization: `bearer ${localStorage.getItem('admin-token')}`
                },
                data: {
                  img: self.form.atar,
                  content: '123',
                  type: 1,
                  link:'https://health.hxgtech.com',
                  sort: 1
                }
              })
              .then((res) => {
                if(res.data.code == 200){
                  self.$message.success('添加banner成功')
                  self.addVisible = false
                  self.getData()
                }else{
                  self.$message.error('添加失败')
                }
              })
            },
            handleDelete(row){
               this.deleteId = row.id
               this.delVisible = true
            },
            // 确定删除
            deleteRow(){
              this.delVisible = false
              const self = this
              this.$axios({
                method: 'delete',
                url: `/api/admin/banner/delete/${self.deleteId}`,
                headers: {
                  Authorization: `bearer ${localStorage.getItem('admin-token')}`
                }
              })
              .then((res) => {
                  if(res.data.code == 200){
                    self.$message.success('删除成功')
                    self.delVisible = false
                    self.getData()
                  }else{
                    self.$message.error('删除失败')
                  }
              })

            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 200px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .file-put{
            margin-top:10px;
            margin-left: 20px;
            position: relative;
            width: 90px;
            height: 26px;
            border: 1px solid #99D3F5;
            overflow: hidden;
            color: #ffffff;
            text-decoration: none;
            text-indent: 0;
            line-height: 26px;
            background: #409EFF;
            cursor: pointer;
            text-align: center;
            input{
              position: absolute;
              font-size: 16px;
              right: 0;
              top: 0;
              opacity: 0;
              cursor: pointer;
            }
          }
          .file-name{
            text-indent:20px;
          }
</style>
