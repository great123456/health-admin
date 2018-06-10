<!-- 专家团队 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 专家团队</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-button type="primary" plain @click="addSchool">添加专家</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="创建日期"></el-table-column>
                <el-table-column prop="name" label="专家姓名"></el-table-column>
                <el-table-column label="头像">
                  <template slot-scope="props">
                    <img :src="props.row.atar" alt="" style="width:60px;height:60px;border-radius:100%;">
                  </template>
                </el-table-column>
                <el-table-column prop="position" label="职级"></el-table-column>
                <el-table-column prop="hospital" label="医院"></el-table-column>
                <el-table-column prop="department" label="科室"></el-table-column>
                <el-table-column prop="good_at" label="擅长"></el-table-column>
                <el-table-column prop="introduction" label="简介"></el-table-column>
                <el-table-column label="内容" type="expand">
                  <template slot-scope="props">
                    <span>内容:</span>
                    <p>{{props.row.content}}</p>
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
        <el-dialog title="添加专家" :visible.sync="addVisible" width="500px">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="专家姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                  <!-- <div class="file-put">

                  </div> -->
                  <span>选择文件</span>
                  <input type="file" id="file" @change="fileChange">
                  <!-- <p class="file-name">{{fileName}}</p> -->
                  <p @click="uploadImage" style="display: inline-block;color:#ffffff;background:#409EFF;width:100px;text-align: center;border-radius: 10px;cursor:pointer;height:35px !important;line-height:35px;">上传</p>
                </el-form-item>
                <el-form-item label="职位">
                    <el-input v-model="form.position"></el-input>
                </el-form-item>
                <el-form-item label="医院">
                    <el-input v-model="form.hospital"></el-input>
                </el-form-item>
                <el-form-item label="科室">
                    <el-input v-model="form.department"></el-input>
                </el-form-item>
                <el-form-item label="擅长">
                    <el-input v-model="form.good_at"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="form.introduction" type="textarea" :autosize="{ minRows:2, maxRows:5}"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="form.content" type="textarea" :autosize="{ minRows:3, maxRows:20}"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
                    atar: 'https://img11.360buyimg.com/mobilecms/s140x140_jfs/t5014/241/1408008171/233173/d593489c/58f083c4N922d05f5.jpg!q90.webp',
                    position: '',
                    hospital: '',
                    department: '',
                    good_at: '',
                    introduction: '',
                    content: ''
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
               formData.append('file',files)
               xhr.open('POST', url, true)
               xhr.onreadystatechange = function(response){
                  if(xhr.readyState==4){
                    if(xhr.status==200){
                       let res = JSON.parse(xhr.responseText)
                      if(res.code == 0){
                       self.$message.success('上传成功')
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
              this.$axios({
                method: 'get',
                url: `/api/admin/doctor/list/10?page=1`,
                headers: {
                  Authorization: `bearer ${localStorage.getItem('admin-token')}`
                }
              })
              .then((res) => {
                  self.tableData = res.data.data.list
                  self.tableData.forEach(function(item){
                    item.atar = 'https://img11.360buyimg.com'+item.atar
                  })
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
                url: `/api/admin/doctor/store`,
                headers: {
                  Authorization: `bearer ${localStorage.getItem('admin-token')}`
                },
                data: {
                  name: self.form.name,
                  atar: self.form.atar,
                  position: self.form.position,
                  hospital: self.form.hospital,
                  department: self.form.department,
                  good_at: self.form.good_at,
                  introduction: self.form.introduction,
                  content: self.form.content,
                  sort: 1,
                  is_recommend: 1
                }
              })
              .then((res) => {
                if(res.data.code == 200){
                  self.$message.success('添加成功')
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
                url: `/api/admin/doctor/delete/${self.deleteId}`,
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
