<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="24" class="mb20">
      <el-form-item label="数据源ID" prop="dsId">
          <el-select v-model="form.dsId" placeholder="请选择数据源ID">
            <el-option label="请选择">0</el-option>
          </el-select>
        </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="问题描述" prop="question">
        <el-input v-model="form.question" placeholder="请输入问题描述"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="示例SQL" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="请输入示例SQL"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="向量数据" prop="embedding">
        <el-input v-model="form.embedding" placeholder="请输入向量数据"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="是否启用，0否；1是" prop="enabledFlag">
            <el-radio-group v-model="form.enabledFlag">
             <el-radio :label="item.value" v-for="(item, index) in common_status" border :key="index">{{ item.label }}
            </el-radio>
            </el-radio-group>
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

<script setup lang="ts" name="SqlTrainDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj, validateExist } from '/@/api/agi/sqlTrain'
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典
const { common_status } = useDict('common_status')

// 提交表单数据
const form = reactive({
		id:'',
	  dsId: '',
	  question: '',
	  description: '',
	  embedding: '',
	  enabledFlag: '',
});

// 定义校验规则
const dataRules = ref({
    dsId: [{required: true, message: '数据源ID不能为空', trigger: 'blur'}, { validator: rule.number, trigger: 'blur' }],
    question: [{required: true, message: '问题描述不能为空', trigger: 'blur'}],
    enabledFlag: [{required: true, message: '是否启用，0否；1是不能为空', trigger: 'blur'}, { validator: rule.number, trigger: 'blur' }],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取sqlTrain信息
  if (id) {
    form.id = id
    getSqlTrainData(id)
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
const getSqlTrainData = (id: string) => {
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