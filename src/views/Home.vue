<template>
    <div class="home-container">
        <el-button @click="logout" type="danger" size="large" circle class="add-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M14 9V5l7 7-7 7v-4h-4v-4h4zM4 3h6v2H4v14h6v2H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z" />
            </svg>
        </el-button>
        <el-button @click="openGenerateWindow" type="info" size="large" circle class="add-button"
            style="margin-right: 20px;">
            <el-icon size="20">
                <i-ep-user-filled />
            </el-icon>
        </el-button>
        <h1 class="home-title">欢迎你，{{ user.name }}</h1>
        <el-card class="home-card">
            <el-button @click="openEditWindow(null)" type="primary" circle class="add-button">
                <el-icon size="20">
                    <i-ep-plus />
                </el-icon>
            </el-button>
            <el-table :data="configList" stripe class="custom-table" v-loading="loading">
                <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" width="140" align="center"></el-table-column>
                <el-table-column prop="desc" label="描述" width="100" align="center"></el-table-column>
                <el-table-column prop="mac" label="mac" width="200" align="center"></el-table-column>
                <el-table-column prop="ip" label="ip" width="160" align="center"></el-table-column>
                <el-table-column prop="mask" label="掩码" width="60" align="center"></el-table-column>
                <el-table-column prop="port" label="端口" width="120" align="center"></el-table-column>
                <el-table-column prop="crtDt" label="创建时间" width="100" align="center"></el-table-column>
                <el-table-column prop="updDt" label="更新时间" width="100" align="center"></el-table-column>
                <el-table-column prop="lastSendTime" label="最后发送时间" width="120" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template v-slot="scope">
                        <el-button @click="openEditWindow(scope.row)" type="primary" circle class="action-button">
                            <el-icon size="20">
                                <i-ep-edit-pen />
                            </el-icon>
                        </el-button>
                        <el-button @click="deleteConfig(scope.row.id)" type="danger" circle class="action-button">
                            <el-icon size="20">
                                <i-ep-delete />
                            </el-icon>
                        </el-button>
                        <el-button @click="wake(scope.row.id)" type="success" circle class="action-button">
                            <el-icon size="20">
                                <i-ep-switch-button />
                            </el-icon>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo"
                :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total" class="custom-pagination"></el-pagination>
        </el-card>
        <el-dialog @close="clearForm" :title="title" v-model="dialogFormVisible" width="400px" center
            class="custom-dialog">
            <el-form :rules="rules" :model="configForm" ref="configFormRef">
                <el-form-item label="名称：" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="configForm.name" autocomplete="off" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="desc" :label-width="formLabelWidth">
                    <el-input v-model="configForm.desc" :rows="3" type="textarea" resize="none"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="mac：" prop="mac" :label-width="formLabelWidth">
                    <el-input v-model="configForm.mac" autocomplete="off" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="ip：" prop="ip" :label-width="formLabelWidth">
                    <el-input v-model="configForm.ip" autocomplete="off" style="width: 260px;" maxlength="15">
                        <template #append>
                            <span style="color: #666;width: 16px;text-align: center;">/</span>
                            <el-input-number v-model="configForm.mask" :min="1" :max="32" style="width: 100px;" />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="端口：" prop="port" :label-width="formLabelWidth">
                    <el-input-number v-model="configForm.port" :min="1" :max="65535" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addConfig">确 定</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog @close="clearGenerateForm" title="生成盐和密码" v-model="generateDialogVisible" width="400px" center
            class="custom-dialog">
            <el-button @click="generate" type="primary" circle style="float: right;">
                <el-icon size="20">
                    <i-ep-plus />
                </el-icon>
            </el-button>
            <el-form :rules="rules" :model="generateForm" ref="generateFormRef">
                <el-form-item label="密码：" prop="password" :label-width="formLabelWidth">
                    <el-input v-model="generateForm.password" type="password" show-password autocomplete="off"
                        style="width: 200px;"></el-input>
                </el-form-item>
            </el-form>
            <p style="margin-bottom: 20px;"><span>盐：</span>{{ generateForm.salt }}</p>
            <p><span>真实密码：</span>{{ generateForm.realpasswd }}</p>
        </el-dialog>
    </div>
</template>

<script>
import userApi from '@/api/user'
import configApi from '@/api/config'
import wakeApi from '@/api/wake'
import {
    ElMessage, ElMessageBox
} from 'element-plus'
import { removeToken } from '@/utils/auth'

function deepCope(obj) {
    let _obj = JSON.stringify(obj), objClone = JSON.parse(_obj)
    return objClone
}

export default {
    name: 'Home',
    data() {
        var isIP = (rule, value, callback) => {
            const parts = value.split('.');
            if (parts.length !== 4) {
                callback(new Error('IP地址必须包含4个部分！'));
                return;
            }
            for (let i = 0; i < 4; i++) {
                const part = parts[i];
                if (part === '' || part.length > 3) {
                    callback(new Error(`第 ${i + 1} 部分长度无效！`));
                    return;
                }
                if (!/^\d+$/.test(part)) {
                    callback(new Error(`第 ${i + 1} 部分包含非数字字符！`));
                    return;
                }
                if (part.startsWith('0')) {
                    callback(new Error(`第 ${i + 1} 部分有前导零！`));
                    return;
                }
                const num = parseInt(part, 10);
                if (num < 0 || num > 255) {
                    callback(new Error(`第 ${i + 1} 部分超出范围（0-255）！`));
                    return;
                }
            }
            callback()
        }
        var isMAC = (rule, value, callback) => {
            var mac = /^[A-F0-9]{2}(-[A-F0-9]{2}){5}|[A-F0-9]{2}(:[A-F0-9]{2}){5}$/
            if (value.length == 17 && mac.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的mac！'))
            }
        }
        return {
            user: {},
            total: 0,
            pageNo: 1,
            pageSize: 10,
            configList: [],
            dialogFormVisible: false,
            generateDialogVisible: false,
            configForm: {},
            generateForm: {},
            loading: false,
            title: "",
            formLabelWidth: "100px",
            rules: {
                name: [
                    { required: true, message: '请输入名称！', trigger: 'blur' }
                ],
                ip: [
                    { required: true, message: '请输入ip！', trigger: 'blur' },
                    { validator: isIP, message: '请输入正确的ip！', trigger: 'blur' }
                ],
                mac: [
                    { required: true, message: '请选择mac！', trigger: 'blur' },
                    { validator: isMAC, message: '请输入正确的mac！', trigger: 'blur' }
                ],
                mask: [
                    { required: true, message: '请输入掩码！', trigger: 'blur' }
                ],
                port: [
                    { required: true, message: '请输入端口！', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码！', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        logout() {
            ElMessageBox.confirm('您将退出登录, 是否继续?', '提示', {
                closeOnClickModal: false,
                closeOnPressEscape: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                type: 'warning'
            }).then(() => {
                userApi.logout().then(response => {
                    if (response.code == 100) {
                        removeToken()
                        this.$router.push({ path: '/login' })
                        ElMessage({
                            type: 'success',
                            message: response.msg
                        })
                    }
                })
            }).catch(() => {
            })
        },
        handleSizeChange(pageSize) {
            this.pageNo = 1
            this.pageSize = pageSize
            this.getConfigList()
        },
        handleCurrentChange(pageNo) {
            this.pageNo = pageNo
            this.getConfigList()
        },
        getConfigList() {
            this.loading = true
            configApi.getConfigList(this.pageNo, this.pageSize).then(response => {
                this.configList = response.data.rows
                this.total = response.data.total
                this.loading = false
            })
        },
        openEditWindow(config) {
            if (config == null)
                this.title = "新增配置"
            else {
                this.title = "修改配置"
                this.configForm = deepCope(config)
            }
            this.dialogFormVisible = true
        },
        openGenerateWindow() {
            this.generateDialogVisible = true
        },
        clearForm() {
            this.$refs.configFormRef.clearValidate()
            this.configForm = {}
        },
        clearGenerateForm() {
            this.$refs.generateFormRef.clearValidate()
            this.generateForm = {}
        },
        addConfig() {
            this.$refs.configFormRef.validate((valid) => {
                if (valid) {
                    if (this.configForm.id) {
                        configApi.updateConfig(this.configForm).then(response => {
                            if (response.code === 241) {
                                ElMessage({
                                    message: response.msg,
                                    type: 'success'
                                })
                                this.dialogFormVisible = false
                                this.getConfigList()
                            } else {
                                ElMessage.error(response.msg || "error")
                            }
                        })
                        return
                    }
                    configApi.addConfig(this.configForm).then(response => {
                        if (response.code === 261) {
                            ElMessage({
                                message: response.msg,
                                type: 'success'
                            })
                            this.dialogFormVisible = false
                            this.getConfigList()
                        } else {
                            ElMessage.error(response.msg || "error")
                        }
                    })
                } else {
                    ElMessage.error("请检查表单是否正确！")
                    return false
                }
            })
        },
        deleteConfig(id) {
            ElMessageBox.confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                configApi.deleteConfig(id).then(response => {
                    if (response.code == 251) {
                        ElMessage({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getConfigList()
                    }
                })
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        generate() {
            this.$refs.generateFormRef.validate((valid) => {
                if (valid) {
                    userApi.getSalt(this.generateForm.password).then(response => {
                        if (response.code == 231) {
                            this.generateForm.salt = response.data.salt
                            this.generateForm.realpasswd = response.data.password
                        } else {
                            ElMessage.error(response.msg || "error")
                        }
                    })
                } else {
                    ElMessage.error("请检查表单是否正确！")
                    return false
                }
            })
        },
        wake(id) {
            ElMessageBox.confirm('即将发送幻包, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                wakeApi.send(id).then(response => {
                    if (response.code == 100) {
                        ElMessage({
                            message: '发送成功',
                            type: 'success'
                        })
                        this.getConfigList()
                    } else {
                        ElMessage.error(response.msg || "error")
                    }
                })
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '已取消发送'
                })
            })
        },
    },
    mounted() {
        userApi.info().then(response => {
            this.user = response.data
        })
        this.getConfigList()
    }
}
</script>

<style>
.el-input-group__append {
    padding: 0;
}

.home-container {
    text-align: center;
    width: 80%;
    min-width: 1080px;
    height: 800px;
    padding: 20px;
    background-color: #f9f9f9;
    margin: 50px auto;
}

.home-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.home-card {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    height: 700px;
}

.add-button {
    float: right;
    margin-bottom: 10px;
}

.custom-table {
    border: 1px solid #ebeef5;
    border-radius: 8px;
    overflow: hidden;
}

.action-button {
    margin: 0 5px;
}

.custom-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.custom-dialog {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.dialog-footer {
    text-align: right;
}
</style>