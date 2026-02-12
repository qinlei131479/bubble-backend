<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="ai供应商表(ai_supplier)的Id" prop="supplierId">
        <el-input v-model="form.supplierId" placeholder="请输入ai供应商表(ai_supplier)的Id"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="模型名称（供应商名称）" prop="name">
        <el-input v-model="form.name" placeholder="请输入模型名称（供应商名称）"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="模型名称（别名）" prop="baseModel">
        <el-input v-model="form.baseModel" placeholder="请输入模型名称（别名）"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="模型类型: 1:聊天, 2:推理, 3:向量，4：排序，5：图片，6：视觉" prop="modelType">
        <el-input v-model="form.modelType" placeholder="请输入模型类型: 1:聊天, 2:推理, 3:向量，4：排序，5：图片，6：视觉"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="模型上下文长度" prop="contextLength">
        <el-input v-model="form.contextLength" placeholder="请输入模型上下文长度"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="模型描述" prop="description">
        <el-input v-model="form.description" placeholder="请输入模型描述"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="默认模型，0：否，1：是" prop="defaultFlag">
        <el-input v-model="form.defaultFlag" placeholder="请输入默认模型，0：否，1：是"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="模型扩展配置" prop="extConfig">
        <el-input v-model="form.extConfig" placeholder="请输入模型扩展配置"/>
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

<script setup lang="ts" name="SupplierModelDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj, validateExist } from '/@/api/agi/supplierModel'
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
	  supplierId: '',
	  name: '',
	  baseModel: '',
	  modelType: '',
	  contextLength: '',
	  description: '',
	  defaultFlag: '',
	  extConfig: '',
});

// 定义校验规则
const dataRules = ref({
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取supplierModel信息
  if (id) {
    form.id = id
    getSupplierModelData(id)
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
const getSupplierModelData = (id: string) => {
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