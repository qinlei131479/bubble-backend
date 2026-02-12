<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="服务器名称（唯一标识）" prop="name">
        <el-input v-model="form.name" placeholder="请输入服务器名称（唯一标识）"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="请输入描述"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="传输类型：sse/streamable_http/stdio" prop="transport">
          <el-select v-model="form.transport" placeholder="请选择传输类型：sse/streamable_http/stdio">
            <el-option label="请选择">0</el-option>
          </el-select>
        </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="服务器 URL（sse/streamable_http）" prop="url">
        <el-input v-model="form.url" placeholder="请输入服务器 URL（sse/streamable_http）"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="命令（stdio）" prop="command">
        <el-input v-model="form.command" placeholder="请输入命令（stdio）"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="命令参数数组（stdio）" prop="args">
        <el-input v-model="form.args" placeholder="请输入命令参数数组（stdio）"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="HTTP 请求头" prop="headers">
        <el-input v-model="form.headers" placeholder="请输入HTTP 请求头"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="HTTP 超时时间（秒）" prop="timeout">
        <el-input v-model="form.timeout" placeholder="请输入HTTP 超时时间（秒）"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="SSE 读取超时（秒）" prop="sseReadTimeout">
        <el-input v-model="form.sseReadTimeout" placeholder="请输入SSE 读取超时（秒）"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="标签数组" prop="tags">
        <el-input v-model="form.tags" placeholder="请输入标签数组"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="图标（emoji）" prop="icon">
        <el-input v-model="form.icon" placeholder="请输入图标（emoji）"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="是否启用：0=否,1=是" prop="enabledFlag">
        <el-input v-model="form.enabledFlag" placeholder="请输入是否启用：0=否,1=是"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="禁用的工具名称列表" prop="disabledTools">
        <el-input v-model="form.disabledTools" placeholder="请输入禁用的工具名称列表"/>
      </el-form-item>
      </el-col>

			</el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="loading">确 认</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts" name="McpServersDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj, validateExist } from '/@/api/agi/mcpServers'
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
		id:'',
	  name: '',
	  description: '',
	  transport: '',
	  url: '',
	  command: '',
	  args: '',
	  headers: '',
	  timeout: '',
	  sseReadTimeout: '',
	  tags: '',
	  icon: '',
	  enabledFlag: '',
	  disabledTools: '',
});

// 定义校验规则
const dataRules = ref({
    name: [{required: true, message: '服务器名称（唯一标识）不能为空', trigger: 'blur'}, {
      validator: (rule: any, value: any, callback: any) => {
        validateExist(rule, value, callback, form.id !== '');
      },
      trigger: 'blur',
    }],
    transport: [{required: true, message: '传输类型：sse/streamable_http/stdio不能为空', trigger: 'blur'}],
    url: [{required: true, message: '服务器 URL（sse/streamable_http）不能为空', trigger: 'blur'}],
    enabledFlag: [{required: true, message: '是否启用：0=否,1=是不能为空', trigger: 'blur'}, { validator: rule.number, trigger: 'blur' }],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取mcpServers信息
  if (id) {
    form.id = id
    getMcpServersData(id)
  }
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
    loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
    loading.value = false;
  }
};


// 初始化表单数据
const getMcpServersData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj({id: id}).then((res: any) => {
    Object.assign(form, res.data[0])
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>