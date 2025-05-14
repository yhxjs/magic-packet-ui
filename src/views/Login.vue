<template>
    <div class="container">
        <div class="screen">
            <div class="screen__content">
                <form class="login">
                    <div class="login__field">
                        <el-input v-model="loginForm.name" placeholder="用户名" size="large" ref="nameRef"
                            class="custom-input" />
                    </div>
                    <div class="login__field">
                        <el-input v-model="loginForm.password" type="password" placeholder="密码" show-password
                            size="large" ref="passwdRef" class="custom-input" />
                    </div>
                    <div class="login__field captcha-field">
                        <el-input v-model="loginForm.imgCode" maxlength="4" placeholder="验证码" @keyup.enter="login"
                            ref="imgCodeRef" class="captcha-input" />
                        <img :src="'/magic/imgCode'" alt="图形验证码" id="imgCode" @click="changeCode" />
                    </div>
                    <button class="login__submit" type="button" @click="login">
                        <span>登录</span>
                    </button>
                </form>
            </div>
            <div class="screen__background">
                <span class="screen__background__shape screen__background__shape4"></span>
                <span class="screen__background__shape screen__background__shape3"></span>
                <span class="screen__background__shape screen__background__shape2"></span>
                <span class="screen__background__shape screen__background__shape1"></span>
            </div>
        </div>
    </div>
</template>

<script>
import userApi from '@/api/user'
import { setToken } from '@/utils/auth'
import debounce from '@/utils/debounce'
import {
    ElMessage
} from 'element-plus'

const imgCodeChange = debounce(() => {
    document.getElementById('imgCode').src = '/magic/imgCode?' + new Date().getTime()
}, 1000, true, () => {
    ElMessage.warning({ message: '请勿频繁点击！', grouping: true })
})

export default {
    data() {
        return {
            name: 'login',
            loginForm: {}
        }
    },
    methods: {
        changeCode() {
            imgCodeChange()
        },
        login() {
            if (this.loginForm.name == "" || !this.loginForm.name) {
                ElMessage({
                    type: 'warning',
                    message: '请输入用户名！'
                })
                this.$refs.nameRef.focus()
                return
            }
            if (this.loginForm.password == "" || !this.loginForm.password) {
                ElMessage({
                    type: 'warning',
                    message: '请输入密码！'
                })
                this.$refs.passwdRef.focus()
                return
            }
            if (this.loginForm.imgCode == "" || !this.loginForm.imgCode) {
                ElMessage({
                    type: 'warning',
                    message: '请输入验证码！'
                })
                this.$refs.imgCodeRef.focus()
                return
            }
            if (this.loginForm.imgCode.length != 4) {
                ElMessage({
                    type: 'error',
                    message: '验证码错误！'
                })
                this.$refs.imgCodeRef.focus()
                return
            }
            userApi.login(this.loginForm).then(response => {
                if (response.code === 201) {
                    ElMessage({
                        type: 'success',
                        message: response.msg
                    })
                    setToken(response.data, 7)
                    this.$router.push('/')
                } else {
                    if (response.code === 220 || response.code === 200) {
                        this.changeCode()
                    }
                    ElMessage({
                        type: 'error',
                        message: response.msg
                    })
                }
            }).catch((msg) => {
                this.changeCode()
                ElMessage({
                    type: 'error',
                    message: msg
                })
            })
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #6C63FF, #3F3D56);
}

.screen {
    background: linear-gradient(90deg, #5D54A4, #7C78B8);
    position: relative;
    height: 600px;
    width: 360px;
    box-shadow: 0px 0px 24px #5C5696;
    border-radius: 20px;
    overflow: hidden;
}

.screen__content {
    z-index: 1;
    position: relative;
    height: 100%;
    padding: 20px;
}

.screen__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    -webkit-clip-path: inset(0 0 0 0);
    clip-path: inset(0 0 0 0);
}

.screen__background__shape {
    transform: rotate(45deg);
    position: absolute;
    animation: float 6s ease-in-out infinite;
}

.screen__background__shape1 {
    height: 520px;
    width: 520px;
    background: #FFF;
    top: -50px;
    right: 120px;
    border-radius: 0 72px 0 0;
}

.screen__background__shape2 {
    height: 220px;
    width: 220px;
    background: #6C63AC;
    top: -172px;
    right: 0;
    border-radius: 32px;
}

.screen__background__shape3 {
    height: 540px;
    width: 190px;
    background: linear-gradient(270deg, #5D54A4, #6A679E);
    top: -24px;
    right: 0;
    border-radius: 32px;
}

.screen__background__shape4 {
    height: 400px;
    width: 200px;
    background: #7E7BB9;
    top: 420px;
    right: 50px;
    border-radius: 60px;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(45deg);
    }

    50% {
        transform: translateY(-20px) rotate(45deg);
    }
}

.login {
    width: 320px;
    padding: 30px;
    padding-top: 156px;
    text-align: center;
}

.login__field {
    padding: 20px 0px;
    position: relative;
}

.captcha-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.captcha-input {
    width: 150px;
}

#imgCode {
    margin-left: 10px;
    width: 130px;
    height: 40px;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-input {
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.login__submit {
    background: linear-gradient(90deg, #6C63FF, #3F3D56);
    font-size: 16px;
    margin-top: 30px;
    padding: 16px 20px;
    border-radius: 26px;
    border: none;
    text-transform: uppercase;
    font-weight: 700;
    align-items: center;
    width: 50%;
    color: #FFF;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
}

.login__submit:hover {
    background: linear-gradient(90deg, #3F3D56, #6C63FF);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
}
</style>