<template>
    <div class="login-wrap">
        <div class="ms-title">健康管理后台系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '1301180334@qq.com',
                    password: '123123'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(self.ruleForm.username == '1301180334@qq.com' && self.ruleForm.password == '123123'){
                          self.$axios.post('/api/admin/user/login', {
                              email: '1301180334@qq.com',
                              password: '123123'
                            })
                            .then(function (res) {
                              console.log('res',res)
                              if(res.data.code == 200){
                                self.$message.success('登录成功')
                                localStorage.setItem('admin-token',res.data.data.token)
                                localStorage.setItem('ms_username',self.ruleForm.username);
                                self.$router.push('/table');
                              }else{
                                self.$message.error('登录失败')
                              }
                            })
                        }else{
                            self.$message.error('登录失败')
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
