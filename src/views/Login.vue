<template>
	<div class="login-container">
		<h3 class="title">数据系统</h3>
		<el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="top" label-width="80px" class="login-form">
			<el-form-item prop="username" label="账号">
				<el-input size="large" type="text" v-model="loginForm.username" placeholder="手机号/邮箱"></el-input>
			</el-form-item>
			<el-form-item prop="password" label="密码">
				<el-input size="large" type="password" v-model="loginForm.password" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item style="width:100%;">
				<el-button size="large" type="primary" style="width:100%;" @click.native.prevent="login" :loading="logining">登录</el-button>
				<!-- <router-link to="/password">设置登录密码</router-link>
				<router-link to="/resetpass">修改登录密码</router-link> -->
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import md5 from 'js-md5'
	import resources from '../resources'
	const navbarListQuery = `
	{ 
		userInfo {
			id
			username
			email
			enabled
			navbar { 
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
	}`;

	export default {
		data() {
			return {
				logining: false,
				loginForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [
						{ required: true, message: '请输入账号', trigger: 'blur' },
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
					]
				},
			};
		},
		methods: {
			login() {
				let _this = this;
				_this.logining = true;
				let loginParams = {
					username: _this.loginForm.username,
					password: _this.loginForm.password
				};
				var qs = require('qs');
				_this.$ajax.post(`${resources.auth()}`, qs.stringify(loginParams),{
					timeout: 2000 // 请求超时时间2秒
                }).then((res) => {
					// 接口响应成功
					console.log(res);
					_this.logining = false;
					let token = "Bearer " + res.data.token;
					sessionStorage.setItem('token', token);
					sessionStorage.setItem('sysUserName',_this.loginForm.username);
					_this.gainNavbar();
				}, (resolve, reject, response) => {
					// 接口请求失败
					console.log(resolve, reject, response)
					_this.logining = false;
				});
			},

			gainNavbar() {
				let _this = this;
				_this.$ajax.post(`${resources.graphQlApi}`,{
                    'query': `${navbarListQuery}`
                }).then(res => {
                    console.log(res.data.data)
					sessionStorage.setItem("navbar",JSON.stringify(res.data.data.userInfo.navbar));
					window.location.href = resources.homeWeb;
					//_this.$router.push({ path: '/realTime/landing' });
                })
				
			}
		},
		mounted: function () {

		}
	}

</script>

<style lang="scss" scoped>
	.login-container {
		-webkit-border-radius: 5px;
		border-radius: 5px;
		-moz-border-radius: 5px;
		background-clip: padding-box;
		margin-top: 140px;
		.login-form {
			margin: 0 auto;
			width: 350px;
			padding: 35px 35px 15px 35px;
			background: #fff;
			border: 1px solid #eaeaea;
			box-shadow: 0 0 25px #cac6c6;
		}
		.title {
			font-size: 28px;
			margin: 0px auto 30px auto;
			text-align: center;
			color: #505458;
		}
		.remember {
			margin: 0px 0px 35px 0px;
		}
		.el-select {
			width: 100%;
		}
	}
</style>