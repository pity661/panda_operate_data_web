<template>
    <div class="page-container">
            <div class="main-panel">
                <el-col class="table-panel">
                    <el-col :span="24">
                        <el-form :inline="true">
                            <el-form-item label="用户名">
                                <el-autocomplete
                                    class="inline-input"
                                    v-model="username"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入用户名"
                                    @select="getUserList()">
                                </el-autocomplete>
                            </el-form-item>
                        </el-form>
                    </el-col>

                    <el-table :data="userList">
                        <el-table-column label="编号" min-width="8%">
                            <template slot-scope="scope">
                                {{(pageNumber - 1) * pageSize + scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="username" label="用户名称" min-width="12%">
                        </el-table-column>
                        <el-table-column prop="email" label="邮箱" min-width="35%">
                        </el-table-column>
                        <el-table-column label="激活状态" min-width="25%">
                            <template slot-scope="scope">
                                <el-switch v-model= "scope.row.enabled" active-color="#13ce66" 
                                    inactive-color="#ff4949" on-text="激活" off-text="禁用"
                                    @change="changeSwitch(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" style="width:40" min-width="25%">
                            <template scope="scope">
                                <el-button type="text" @click="deleteTemplate(scope.row.key)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="page">
                        <el-pagination  @current-change="getUserList()" 
                            :current-page.sync="pageNumber" 
                            :page-size="pageSize" layout="prev, pager, next, jumper"
                            :total="dataCount">
                        </el-pagination>
                    </div>
                </el-col>
            </div>
        </div>
</template>

<script>
    import resources from '../../resources'
    import { rejects } from 'assert';
    const navbarListQuery = `
		{ 
			navbarList { 
				path 
				component 
				name 
				iconCls 
				leaf 
				hidden 
				meta 
				children { 
					path 
					component 
					name 
					hidden 
					meta 
				}
			} 
		}
	`;

    const userListQuery = `
        query(
            $username: String
            $pageNumber: Int
            $pageSize: Int
        ){ 
			userList(
                username: $username
                pageSize: $pageSize
                pageNumber: $pageNumber
			){ 
                pageNumber
                pageSize
                pagesCount
                dataCount
                data {
                    id
                    username
                    email
                    enabled
                    navbar {
                        id
                        name 
                        children { 
                            id 
                            name 
                        }
                    }
                }
			} 
		}
	`;
    export default {
        data() {
            return {
                pageNumber:1,
                pageSize:10,
                dataCount:0,

                // 接口返回的原始用户信息
                originalUser: [],
                // 可能会在业务中被修改
                userList: [],
                usernameList: [],
                username: ''
            }
        },
        watch: {
        },
        methods: {
            /** 用户姓名搜索框开始 **/
            querySearch(queryString, cb) {
                if (this.usernameList.length == 0) {
                    for (var x of this.originalUser) {
                        let a = new Object();
                        a.value = x.username;
                        this.usernameList.push(a);
                    }
                }
                // console.log(this.usernameList)
                let usernameList = this.usernameList;
                var results = queryString ? usernameList.filter(this.createFilter(queryString)) : usernameList;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (usernameList) => {
                    return (usernameList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            /** 用户姓名搜索框结束 **/
            
            // 初始化用户列表/根据条件筛选用户
            getUserList() {
                let params = {
                    "pageSize": this.pageSize,
                    // jpa分页从0开始,初始化参数为0时组件有问题,必须要设置成1
                    "pageNumber": this.pageNumber - 1,
                    "username": this.username
                }
                this.$ajax.post(`${resources.graphQlApi}`,{
                    'query': `${userListQuery}`,
                    variables: params
                }).then(res => {
                    //console.log(res)
                    this.userList = res.data.data.userList.data
                    console.log(this.userList)
                    // 深拷贝对象
                    this.originalUser = JSON.parse(JSON.stringify(this.userList));
                    this.dataCount = res.data.data.userList.dataCount
                })
            },
            // 修改用户激活状态
            changeSwitch(data) {
				let resetEnabledParams = {
					enabled: data.enabled,
					id: data.id
				};
				var qs = require('qs');
				this.$ajax.post(`${resources.resetEnabled()}`, qs.stringify(resetEnabledParams),{
					timeout: 2000 // 请求超时时间2秒
                }).then((res) => {
                    //console.log(res)
                    if (res.data) {
                        // 接口响应成功
                        this.$message.success('修改成功');
                    } else {
                        // 修改失败状态回置
                        for (var i in this.userList) {
                            if (data.id === this.userList[i].id) {
                                this.userList[i].enabled = this.originalUser[i].enabled;
                            }
                        }
                        this.$message.error('修改失败');
                    }
				}, (resolve, reject, response) => {
                    // 修改失败状态回置
                    for (var i in this.userList) {
                        if (data.id === this.userList[i].id) {
                            this.userList[i].enabled = this.originalUser[i].enabled;
                        }
                    }
				    this.$message.error('修改失败');
				});
            },
            // 获取所有菜单信息
            queryNavbarList() {
                let params = {}
                this.$ajax.post(`${resources.graphQlApi}`,{
                    'query': `${navbarListQuery}`,
                    variables: params
                }).then(res => {
                    console.log(res)
                })
            }
        },
        mounted: function () {
            this.getUserList();
            this.queryNavbarList();
        }
    }

</script>
<style lang="scss" scoped>

    .my-input{
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: 0;
        padding: 3px 10px;
    }
    .page-container {
        color: #666;
        min-width: 1200px;
        .sm {
            width: 105px;
        }
        .table-panel {
            width: 80%;
            margin-top: 20px;
            .add-new{
                height: 50px;
                width: 80px;
                text-align: center;
                //margin-left: 500px;
            }
            .sort{
                height: 50px;
                width: 100px;
                text-align: center;
            }
        }
        .title {
            line-height: 2.5;
            font-weight: bold;
            font-size: 14px;
        }
        .page {
            text-align: center;
            margin: 10px;
        }
        .el-input {
            width: 145px;
        }
        .el-date-editor {
            width: 280px;
        }
        .pointer {
            cursor: pointer;
            color: #29b6f6;
        }
        .success {
            color: #13CE66;
        }
        .error {
            color: #FF4949;
        }
        #container {
            width: 650px;
            height: 500px;
            margin: 0px;
        }
        .avatar-uploader .el-upload {
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #20a0ff;
        }
        .avatar-uploader-icon {
            border: 1px dashed #d9d9d9;
            font-size: 28px;
            color: #8c939d;
            width: 200px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 200px;
            height: 200px;
            display: block;
        }
        .pic {
            width: 60px;
            height: 60px;
            display: block;
        }
    }
</style>