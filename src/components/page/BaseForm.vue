<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 房源管理</el-breadcrumb-item>
                <el-breadcrumb-item>发布房源</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="房源名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="房型选择">
                        <el-select v-model="form.region" placeholder="请选择房型">
                            <el-option key="bbk" label="一室一厅一卫" value="bbk"></el-option>
                            <el-option key="xtc" label="二室一厅一卫" value="xtc"></el-option>
                            <el-option key="imoo" label="三室二厅一卫" value="imoo"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期选择">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="区域选择">
                        <el-cascader :options="options" v-model="form.options"></el-cascader>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="large" @click="onSubmit">发布</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                options:[
                    {
                        value: 'guangdong',
                        label: '广东省',
                        children: [
                            {
                                value: 'guangzhou',
                                label: '广州市',
                                children: [
                                    {
                                        value: 'tianhe',
                                        label: '天河区'
                                    },
                                    {
                                        value: 'haizhu',
                                        label: '海珠区'
                                    },
                                    {
                                        value: 'panyu',
                                        label: '番禺区'
                                    },
                                    {
                                        value: 'yuexiu',
                                        label: '越秀区'
                                    },
                                    {
                                        value: 'liwan',
                                        label: '荔湾区'
                                    },
                                    {
                                        value: 'huangpu',
                                        label: '黄埔区'
                                    },
                                    {
                                        value: 'foshan',
                                        label: '佛山'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    desc: '',
                    options: []
                }
            }
        },
        methods: {
            onSubmit() {
                this.$message.success('提交成功！');
            }
        }
    }
</script>