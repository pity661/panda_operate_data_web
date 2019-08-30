<template>
	<div class="reset-password-container">
		<h3 class="title">修改登录密码</h3>
        <el-steps :space="400" :active="active" finish-status="success" class="steps">
            <el-step title="输入旧密码"></el-step>
            <el-step title="设置新密码"></el-step>
        </el-steps>
		<el-form :model="resetPasswpordForm" :rules="rules2" ref="resetPasswpordForm" label-position="top" label-width="80px" class="demo-ruleForm reset-password-form">
            <el-form-item label="用户名">
                <span class="account">{{sysUserName}}</span>
			</el-form-item>
			<el-form-item v-if="active === 0" prop="oldPass" label="输入旧密码">
				<el-input size="large" type="password" v-model="resetPasswpordForm.oldPass" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item v-if="active === 1" prop="newPass" label="输入新密码">
				<el-input size="large" type="password" v-model="resetPasswpordForm.newPass" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item  v-if="active === 1" prop="newPassConfirm" label="确认新密码">
				<el-input size="large" type="password" v-model="resetPasswpordForm.newPassConfirm" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item style="width:100%;">
                <el-button v-if="active === 0" size="large" style="width:100%;" @click="next">下一步</el-button>
                <el-button v-if="active === 1" size="large" style="width:100%;" @click="submit">提交</el-button>
				<!-- <el-button size="large" style="width:100%;" @click.native.prevent="toLogin">去登录</el-button> -->
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import resources from '../resources'

export default {
	data() {
		// 必须定义在return之前
		var validatePass = (rule, value, callback) => {
			if (value.trim() === '') {
			callback(new Error('请再次输入密码'));
			} else if (value.trim() !== this.resetPasswpordForm.newPass.trim()) {
			callback(new Error('两次输入密码不一致!'));
			} else {
			callback();
			}
		};
		return {
			sysUserName: '',
            active:0,
			logining: false,
			resetPasswpordForm: {
				oldPass: '',
				newPass: '',
				newPassConfirm: ''
			},
			rules2: {
				oldPass: [
					{ required: true, message: '请输入旧密码', trigger: 'blur' },
				],
                newPass: [
					{ required: true, message: '请输入新密码', trigger: 'blur' },
				],
                newPassConfirm: [
					{ validator: validatePass, trigger: 'blur' }
				]
			}
		};
	},
	methods: {
        submit(){
			let _this = this;
			// 密码输入校验
			if (_this.resetPasswpordForm.newPass != _this.resetPasswpordForm.newPassConfirm) {
				return;
			}
			let resetPassForm = {
				newPass: _this.resetPasswpordForm.newPass.trim(),
				oldPass: _this.resetPasswpordForm.oldPass.trim()
			};
			var qs = require('qs');
			_this.$ajax.post(`${resources.resetPass()}`, qs.stringify(resetPassForm),{
				// timeout: 20000
			})
			.then((res) => {
				// 接口响应成功
				console.log(res);
				// 修改密码成功,刷新token
				if (res.data) {
					_this.$ajax.get(`${resources.refresh()}`,{})
						.then((res) => {
							console.log(res)
							let token = "Bearer " + res.data.token;
							sessionStorage.setItem('token', token);
							_this.$message.success('修改成功');
							// 1.5秒延时跳到主页
							setTimeout(function (){
								window.location.href = resources.homeWeb;
							},1500)
						})
				} else {
					// 修改密码失败
					_this.$message.error({
						showClose: true,
						message: '修改密码失败'
					});
				}
			}, (resolve, reject, response) => {
				// 接口请求失败
				console.log(resolve, reject, response)
			});
        },
		toLogin(ev) {
            this.$router.push({ path: '/login' });
		},
        next() {
            this.active++;
        }
	},
	mounted() {
		this.sysUserName = sessionStorage.getItem("sysUserName");
	}
}

</script>

<style lang="scss" scoped>
.reset-password-container {
	/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
	-webkit-border-radius: 5px;
	border-radius: 5px;
	-moz-border-radius: 5px;
	background-clip: padding-box;
	margin-top: 140px;
	.reset-password-form{
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
    .steps{
		margin: 0px auto 30px auto;
        width: 422px;
    }
    .account{
        font-size: 26px;
        font-weight: bold;
    }
    .el-button+.el-button{
        margin: 10px 0 0 0;
    }
}
</style>