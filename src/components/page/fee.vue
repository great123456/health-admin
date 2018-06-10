<!-- 费用列表 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>费用列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <!-- <el-button type="primary" plain @click="addSchool">添加病种</el-button> -->
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="创建日期"></el-table-column>
                <el-table-column prop="type" label="费用类型"></el-table-column>
                <el-table-column prop="fee" label="费用"></el-table-column>
                 <el-table-column label="操作">
                   <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="addSchool(scope.row)">修改</el-button>
                    </template>
                 </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="修改费用" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="费用">
                    <el-input v-model="form.fee"></el-input>
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
                addVisible: false,
                delVisible: false,
                form: {
                    fee: ''
                },
                updateId: '',
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
            getData() {
                const self = this
                this.$axios({
                  method: 'get',
                  url: '/api/admin/fee/list',
                  headers: {
                    Authorization: `bearer ${localStorage.getItem('admin-token')}`
                  }
                })
                .then((res) => {
                    console.log('res',res.data)
                    self.tableData = res.data.data
                    self.tableData.forEach(function(item){
                       item.type = item.type == '1'?'住院费用':'心电图费用'
                    })
                })
            },
            addSchool(row){
              console.log('fee',row);
              this.updateId = row.id
              this.form.fee = row.fee
              this.addVisible = true
            },
            // 保存编辑
            saveEdit() {
              const self = this
                this.$axios({
                  method: 'post',
                  url: '/api/admin/fee/save',
                  headers: {
                    Authorization: `bearer ${localStorage.getItem('admin-token')}`
                  },
                  data: {
                    fee: self.form.fee,
                    id: self.updateId
                  }
                })
                .then((res) => {
                    if(res.data.code == 200){
                      self.$message.success('修改成功')
                      self.addVisible = false
                      self.getData()
                    }else{
                      self.$message.error('修改失败')
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
