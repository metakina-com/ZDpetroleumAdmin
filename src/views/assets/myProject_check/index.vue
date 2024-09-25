<template>
  <div class="user">
    <div style="min-height:100vh" v-loading="listLoading" element-loading-text="加载中"
      element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <!-- 搜索和操作按钮 -->
      <div class="filter-container" style="padding-bottom: 30px">
        <el-input placeholder="项目名称" v-model.trim="listQuery.projectName" style="width: 140px" class="filter-item" />
        <el-input placeholder="创建者" v-model.trim="listQuery.createBy" style="width: 140px" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" style="margin-right: 5px;"
          @click="reset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addItem">添加项目</el-button>
      </div>

      <!-- 项目列表 -->
      <el-table :data="myProjectData" border tooltip-effect="dark" style="width: 100%">
        <!-- 遍历字段定义数组，生成表格列 -->
        <el-table-column v-for="field in fields" :key="field.prop" :prop="field.prop" :label="field.label"
          min-width="100" align="center">
          <!-- 针对 isShow 字段，显示复选框 -->
          <template v-slot="scope" v-if="field.prop === 'isShow'">
            <el-checkbox v-model="scope.row.isShow" @change="handleIsShowChange(scope.row)">
              {{ scope.row.isShow ? '显示' : '不显示' }}
            </el-checkbox>
          </template>
          <!-- 其他字段直接显示值 -->
          <template v-slot="scope" v-else>
            {{ scope.row[field.prop] }}
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" align="center" fixed="right" min-width="160">
          <template v-slot="scope">
            <el-button size="mini" type="primary" @click="modifyItem(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination v-show="total > 0" background layout="prev, pager, next" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :total="total" @current-change="handleCurrentChange"
        style="margin-top: 20px; text-align: right;" />

      <!-- 添加项目的对话框 -->
      <el-dialog title="添加项目" :visible.sync="addDialogVisible">
        <el-form :model="newProject" label-width="100px">
          <!-- 遍历 fields，生成输入项 -->
          <el-form-item v-for="field in fields" :key="field.prop" :label="field.label"
            v-if="['projectName', 'projectType', 'projectFrom', 'projectUnit', 'projectStatus', 'totalYield', 'totalExchangeCount', 'totalCount', 'buyCount', 'buyPeople', 'projectInformation', 'isShow'].includes(field.prop)">
            <template v-if="field.prop === 'isShow'">
              <el-checkbox v-model="newProject.isShow">
                {{ newProject.isShow ? '显示' : '不显示' }}
              </el-checkbox>
            </template>
            <template v-else>
              <el-input v-model="newProject[field.prop]" />
            </template>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </div>
      </el-dialog>

      <!-- 修改项目的对话框 -->
      <el-dialog title="修改项目" :visible.sync="editDialogVisible">
        <el-form :model="editProject" label-width="100px">
          <!-- 遍历 fields，生成输入项 -->
          <el-form-item v-for="field in fields" :key="field.prop" :label="field.label"
            v-if="['projectId', 'projectName', 'projectType', 'projectFrom', 'projectUnit', 'projectStatus', 'totalYield', 'totalExchangeCount', 'totalCount', 'buyCount', 'buyPeople', 'projectInformation', 'isShow'].includes(field.prop)">
            <template v-if="field.prop === 'isShow'">
              <el-checkbox v-model="editProject.isShow">
                {{ editProject.isShow ? '显示' : '不显示' }}
              </el-checkbox>
            </template>
            <template v-else-if="field.prop === 'projectId'">
              <el-input v-model="editProject[field.prop]" disabled />
            </template>
            <template v-else>
              <el-input v-model="editProject[field.prop]" />
            </template>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectManagement",
  data() {
    return {
      listLoading: false,
      myProjectData: [],
      fields: [
        {
          prop: 'id', label: '项目ID'
        },
        { prop: 'createBy', label: '创建者' },
        { prop: 'publishTime', label: '发布时间' },
        { prop: 'projectName', label: '项目名称' },
        { prop: 'projectType', label: '项目类型' },
        { prop: 'projectFrom', label: '项目来源' },
        { prop: 'projectUnit', label: '项目单价' },
        { prop: 'projectStatus', label: '项目状态' },
        { prop: 'buyPeople', label: '购买人数' },
        { prop: 'buyCount', label: '已购买订单' },
        { prop: 'totalCount', label: '总数量' },
        { prop: 'dailyEarning', label: '每日收益' },
        { prop: 'yesterdayEarning', label: '昨日收益' },
        { prop: 'totalExchangeCount', label: '累计兑换数量' },
        { prop: 'totalYield', label: '总收益率' },
        { prop: 'projectInformation', label: '项目信息' },
        { prop: 'isShow', label: '是否显示' },
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        createBy: '',
      },
      total: 0,
      addDialogVisible: false,
      newProject: {
        projectName: '',
        projectType: '',
        projectFrom: '',
        projectUnit: '',
        projectStatus: '',
        totalYield: '',
        totalExchangeCount: '',
        totalCount: '',
        buyCount: '',
        buyPeople: '',
        projectInformation: '',
        isShow: true,
      },
      editDialogVisible: false,
      editProject: {},
    };
  },
  created() {
    this.getList();
  },

  methods: {
    getList() {
      this.listLoading = true;
      this.$http.get('/moproject/project/queryProject?projectName=DOA')

        // this.$http.get('/moproject/project/queryProject?projectName=DOA', { params: this.listQuery })
        .then((res) => {
          if (res.status === 'SUCCEED') {
            this.myProjectData = res.result.records || [];

            console.log(this.myProjectData, 'this.myProjectDatathis.myProjectData')
            // 格式化数据
            this.myProjectData.forEach((item) => {
              item.isShow = item.isShow === 1;
              item.publishTime = this.formatDate(item.publishTime);
              item.createTime = this.formatDate(item.createTime);
            });
            this.total = res.result.total || 0;
          } else {
            this.$message.error(res.errorMessage || '获取项目列表失败');
          }
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error('获取项目列表失败');
        });
    },
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const Y = date.getFullYear() + '-';
      const M = (date.getMonth() + 1).toString().padStart(2, '0') + '-';
      const D = date.getDate().toString().padStart(2, '0') + ' ';
      const h = date.getHours().toString().padStart(2, '0') + ':';
      const m = date.getMinutes().toString().padStart(2, '0') + ':';
      const s = date.getSeconds().toString().padStart(2, '0');
      return Y + M + D + h + m + s;
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleCurrentChange(page) {
      this.listQuery.pageNum = page;
      this.getList();
    },
    reset() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        createBy: '',
      };
      this.getList();
    },
    addItem() {
      this.newProject = {
        projectName: '',
        projectType: '',
        projectFrom: '',
        projectUnit: '',
        projectStatus: '',
        totalYield: '',
        totalExchangeCount: '',
        totalCount: '',
        buyCount: '',
        buyPeople: '',
        projectInformation: '',
        isShow: true,
      };
      this.addDialogVisible = true;
    },
    confirmAdd() {
      const projectData = {
        projectName: this.newProject.projectName,
        projectFrom: this.newProject.projectFrom,
        projectUnit: this.newProject.projectUnit,
        projectStatus: this.newProject.projectStatus,
        isShow: this.newProject.isShow ? 1 : 0,
        projectType: this.newProject.projectType,
        totalYield: this.newProject.totalYield,
        totalExchangeCount: this.newProject.totalExchangeCount,
        totalCount: this.newProject.totalCount,
        buyCount: this.newProject.buyCount,
        buyPeople: this.newProject.buyPeople,
        projectInformation: this.newProject.projectInformation,
      };
      console.log(projectData, 'projectDataprojectData')



      this.$http.post('/moproject/project/saveProject', JSON.stringify(projectData), {
        headers: {
          'Content-Type': 'application/json',  // 确保请求头的Content-Type为application/json
        },
      })
        .then((res) => {
          if (res.status === 'SUCCEED') {
            this.$message.success(res.result || '项目添加成功');
            this.addDialogVisible = false;
            this.getList();
          } else {
            this.$message.error(res.errorMessage || '添加项目失败');
          }
        })
        .catch((err) => {
          this.$message.error('添加项目失败');
        });
    },

    modifyItem(row) {
      this.editProject = { ...row };
      this.editDialogVisible = true;
    },
    confirmEdit() {
      const projectData = {
        projectId: this.editProject.projectId,
        projectName: this.editProject.projectName,
        projectFrom: this.editProject.projectFrom,
        projectUnit: this.editProject.projectUnit,
        projectStatus: this.editProject.projectStatus,
        isShow: this.editProject.isShow ? 1 : 0,
        projectType: this.editProject.projectType,
        totalYield: this.editProject.totalYield,
        totalExchangeCount: this.editProject.totalExchangeCount,
        totalCount: this.editProject.totalCount,
        buyCount: this.editProject.buyCount,
        buyPeople: this.editProject.buyPeople,
        projectInformation: this.editProject.projectInformation,
      };
      this.$http
        .post('/moproject/project/updateProjectDto', projectData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          if (res.status === 'SUCCEED') {
            this.$message.success(res.result || '项目修改成功');
            this.editDialogVisible = false;
            this.getList();
          } else {
            this.$message.error(res.errorMessage || '修改项目失败');
          }
        })
        .catch((err) => {
          this.$message.error('修改项目失败');
        });
    },
    deleteItem(row) {

      console.log(row.projectId, 'row.projectIdrow.projectId')
      this.$confirm('确定要删除该项目吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          this.$http.delete('/moproject/project/deleteProject', { params: { projectId: row.projectId } }).then((res) => {
            if (res.status === 'SUCCEED') {
              this.$message.success(res.result || '项目已删除');
              this.getList();
            } else {
              this.$message.error(res.errorMessage || '删除项目失败');
            }
          })
            .catch((err) => {
              this.$message.error('删除项目失败');
            });
        })
        .catch(() => {
          // 取消操作
        });
    },
    handleIsShowChange(row) {
      const projectData = {
        projectId: row.projectId,
        projectName: row.projectName,
        projectFrom: row.projectFrom,
        projectUnit: row.projectUnit,
        projectStatus: row.projectStatus,
        isShow: row.isShow ? 1 : 0,
        projectType: row.projectType,
        totalYield: row.totalYield,
        totalExchangeCount: row.totalExchangeCount,
        totalCount: row.totalCount,
        buyCount: row.buyCount,
        buyPeople: row.buyPeople,
        projectInformation: row.projectInformation,
      };
      this.$http
        .post('/moproject/project/updateProjectDto', projectData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          if (res.status === 'SUCCEED') {
            this.$message.success('是否显示已更新');
            this.getList();
          } else {
            this.$message.error(res.errorMessage || '更新是否显示失败');
          }
        })
        .catch((err) => {
          this.$message.error('更新是否显示失败');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.user {
  width: 95%;
  margin: 50px auto;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .filter-item {
    margin-right: 10px;
  }
}
</style>
