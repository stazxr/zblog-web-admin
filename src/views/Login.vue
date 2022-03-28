<template>
	<div>
		<el-form ref="loginForm" :rules="loginRules" :model="loginForm" class="loginContainer">
			<h3 class="loginTitle">系统登录</h3>
			<el-form-item prop="username">
				<el-input
					type="text"
					ref="username"
					v-model="loginForm.username"
					autocomplete="on"
					tabindex="1"
					placeholder="请输入用户名">
				</el-input>
			</el-form-item>

			<el-form-item prop="password">
				<el-input
					type="password"
					ref="password"
					v-model="loginForm.password"
					autocomplete="off"
					placeholder="请输入密码">
				</el-input>
			</el-form-item>
			<el-form-item prop="verifyCode">
				<el-input
					type="text"
					v-model="loginForm.verifyCode"
					autocomplete="off"
					placeholder="点击图片刷新验证码"
					style="width: 250px; margin-right: 5px">
				</el-input>
				<img :src="captchaUrl" alt="" @click="updateCaptcha" />
			</el-form-item>
			<el-checkbox v-model="loginForm.rememberMe" class="loginRememberMe">记住我</el-checkbox>
			<el-button type="primary" @click="submitLogin" style="width: 100%">登录</el-button>
		</el-form>
	</div>
</template>

<script>

export default {
	name: "Login",
	data() {
		return {
			randomNum: "",
			loginForm: {
				username: "",
				password: "",
				verifyCode: "",
				rememberMe: false,
				codeCacheKey: ""
			},
			loginRules: {
				username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
				password: [{ required: true, message: "请输入密码", trigger: "blur" }],
				verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
			}
		}
	},
	methods: {
		submitLogin() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					let param = {
						// json login
						loginType: "1",
						username: this.loginForm.username,
						password: this.loginForm.password,
						verifyCode: this.loginForm.verifyCode,
						rememberMe: this.loginForm.rememberMe,
						codeCacheKey: this.loginForm.codeCacheKey
					}
					this.$mapi.communal.login(param).then(res => {
						if (res && res.code === 200) {
							// set cache
						}
					})
				}
			});
		},
		updateCaptcha() {
			this.randomNum = new Date().getTime();
		}
	},
	computed: {
		captchaUrl: function () {
			return "/numCode?cacheKey=" + this.loginForm.codeCacheKey + "&_t=" + this.randomNum;
		}
	},
	mounted() {
		if (this.loginForm.username === '') {
			this.$refs.username.focus()
		} else if (this.loginForm.password === '') {
			this.$refs.password.focus()
		}
	}
}
</script>

<style>
	.loginContainer {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 180px auto;
		width: 350px;
		padding: 15px 35px 15px 35px;
		background: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}
	.loginTitle {
		margin: 0 auto 40px auto;
		text-align: center;
	}
	.loginRememberMe {
		text-align: left;
		margin: 0 0 15px 0;
	}
	.el-form-item__content {
		display: flex;
		align-items: center;
	}
</style>
