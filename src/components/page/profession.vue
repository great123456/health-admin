<!-- 订单管理 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 专业管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-select v-model="schoolId" placeholder="选择学校" class="handle-select mr10" @change='selectChange'>
                    <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in schoolList"></el-option>
                </el-select>
              <el-button type="primary" plain @click="addSchool">添加专业</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
               <el-table-column prop="created_at" label="创建日期"></el-table-column>
                <el-table-column prop="major" label="专业名称"></el-table-column>
                <el-table-column prop="tuition" label="学费"></el-table-column>
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
        <el-dialog title="添加专业" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="专业名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="学费">
                    <el-input v-model="form.tuition"></el-input>
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
                schoolList: [],
                tableData: [],
                cur_page: 1,
                schoolId:'',
                addVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    tuition: ''
                },
                deleteId: ''
            }
        },
        created() {
            this.getSchoolData();
        },
        computed: {

        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getSchoolData() {
              const self = this
              this.$axios({
                method: 'get',
                url: '/api/admin/school/list/size/100',
                headers: {
                  Authorization: `bearer ${localStorage.getItem('admin-token')}`
                }
              })
              .then((res) => {
                  self.schoolList = res.data.data.data
              })
            },
            selectChange(){
              this.getData()
            },
            getData(){
              const self = this
              this.$axios({
                method: 'get',
                url: `/api/admin/major/list/school/${self.schoolId}/size/100`,
                headers: {
                  Authorization: `bearer ${localStorage.getItem('admin-token')}`
                }
              })
              .then((res) => {
                  console.log('res',res);
                  self.tableData = res.data.data.data
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
                url: `/api/admin/major/store`,
                headers: {
                  Authorization: `bearer ${localStorage.getItem('admin-token')}`
                },
                data: {
                  school_id: self.schoolId,
                  major: self.form.name,
                  tuition: self.form.tuition
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
                url: `/api/admin/major/delete/${self.deleteId}`,
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
</style>
