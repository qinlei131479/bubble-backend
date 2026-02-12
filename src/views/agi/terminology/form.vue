<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="24" class="mb20">
      <el-form-item label="父级ID" prop="parentId">
        <el-input v-model="form.parentId" placeholder="请输入父级ID"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="术语名称" prop="word">
        <el-input v-model="form.word" placeholder="请输入术语名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="术语描述" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="请输入术语描述"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="是否指定数据源，0否；1是" prop="specificDs">
            <el-radio-group v-model="form.specificDs">
           <el-radio label="是否指定数据源，0否；1是" border>是否指定数据源，0否；1是</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="术语向量数据（pgvector VECTOR 类型，支持动态维度）" prop="embedding">
        <el-input v-model="form.embedding" placeholder="请输入术语向量数据（pgvector VECTOR 类型，支持动态维度）"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="数据源ID列表(JSON)" prop="datasourceIds">
        <el-input v-model="form.datasourceIds" placeholder="请输入数据源ID列表(JSON)"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="是否启用，0否；1是" prop="enabledFlag">
            <el-radio-group v-model="form.enabledFlag">
           <el-radio label="是否启用，0否；1是" border>是否启用，0否；1是</el-radio>
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

<script setup lang="ts" name="TerminologyDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj, validateExist } from '/@/api/agi/terminology'
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
	  parentId: '',
	  word: '',
	  description: '',
	  specificDs: '',
	  embedding: '',
	  datasourceIds: '',
	  enabledFlag: '',
});

// 定义校验规则
const dataRules = ref({
    word: [{ validator: rule.duplicate, trigger: 'blur' }],
    specificDs: [{ validator: rule.number, trigger: 'blur' }],
    enabledFlag: [{ validator: rule.number, trigger: 'blur' }],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取terminology信息
  if (id) {
    form.id = id
    getTerminologyData(id)
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
const getTerminologyData = (id: string) => {
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