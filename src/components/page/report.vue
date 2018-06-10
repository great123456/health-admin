<!-- 报告列表 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>报告列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-select
                v-model="userId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入用户名"
                :remote-method="remoteMethod">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="primary" plain @click="addSchool">添加报告</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="创建日期"></el-table-column>
                <el-table-column prop="auth.name" label="姓名"></el-table-column>
                <el-table-column prop="auth.phone" label="电话"></el-table-column>
                <el-table-column prop="auth.address" label="地址"></el-table-column>
                <el-table-column prop="auth.id_card_no" label="身份证号码"></el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="添加报告" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="病种名称">
                    <el-input v-model="form.name"></el-input>
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
                userId: '',
                userList: [],
                cur_page: 1,
                addVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    department: '',
                    desc: ''
                },
                deleteId: ''
            }
        },
        created() {
            this.getData();
        },
        computed: {

        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            remoteMethod(query) {
              const self = this
              if (query !== '') {
                this.$axios({
                  method: 'get',
                  url: `/api/admin/report/patient/${query}/100`,
                  headers: {
                    Authorization: `bearer ${localStorage.getItem('admin-token')}`
                  }
                })
                .then((res) => {
                    console.log('res',res.data)
                    self.userList = res.data.data.list
                })
              }else{
                this.userList = []
              }
            },
            getData() {
                const self = this
                this.$axios({
                  method: 'get',
                  url: '/api/admin/report/list/10?page=1',
                  headers: {
                    Authorization: `bearer ${localStorage.getItem('admin-token')}`
                  }
                })
                .then((res) => {
                    console.log('res',res.data)
                    self.tableData = res.data.data.list
                })
            },
            addSchool(){
              this.addVisible = true
            },
            // 保存编辑
            saveEdit() {
              const self = this
                this.$axios({
                  method: 'post',
                  url: '/api/admin/specy/store',
                  headers: {
                    Authorization: `bearer ${localStorage.getItem('admin-token')}`
                  },
                  data: {
                    department: self.form.department,
                    name: self.form.name,
                    content: self.form.desc
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
                const self = this
                this.$axios({
                  method: 'delete',
                  url: `/api/admin/specy/delete/${self.deleteId}`,
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
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
