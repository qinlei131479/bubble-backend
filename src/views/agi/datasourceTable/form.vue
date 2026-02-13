<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="24" class="mb20">
      <el-form-item label="数据源ID" prop="dsId">
        <el-input v-model="form.dsId" placeholder="请输入数据源ID"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="是否选中，0否1是" prop="checkedFlag">
        <el-input v-model="form.checkedFlag" placeholder="请输入是否选中，0否1是"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="表名" prop="tableName">
        <el-input v-model="form.tableName" placeholder="请输入表名"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="表注释" prop="tableComment">
        <el-input v-model="form.tableComment" placeholder="请输入表注释"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="表注释（自定义）" prop="customComment">
        <el-input v-model="form.customComment" placeholder="请输入表注释（自定义）"/>
      </el-form-item>
      </el-col>

    <el-col :span="24" class="mb20">
      <el-form-item label="表结构 embedding (JSON 数组字符串)" prop="embedding">
        <el-input v-model="form.embedding" placeholder="请输入表结构 embedding (JSON 数组字符串)"/>
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

<script setup lang="ts" name="DatasourceTableDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj, validateExist } from '/@/api/agi/datasourceTable'
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
	  dsId: '',
	  checkedFlag: '',
	  tableName: '',
	  tableComment: '',
	  customComment: '',
	  embedding: '',
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

  // 获取datasourceTable信息
  if (id) {
    form.id = id
    getDatasourceTableData(id)
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
const getDatasourceTableData = (id: string) => {
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