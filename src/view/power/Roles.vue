<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
       <el-table :data="rolelist" border stripe>
         <!-- 展开列 -->
         <el-table-column type="expand">
           <template slot-scope="scope">
             <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'','vcebter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
               <!-- 渲染一级权限 -->
               <el-col :span="5">
                 <el-tag closable  @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                 <i class="el-icon-caret-right"></i>
               </el-col>
               <!-- 渲染二级和三级权限 -->
               <el-col :span="19">
                 <!-- 通过 for 循环 嵌套渲染二级权限 -->
                 <el-row :class="[i2 === 0 ? '':'bdtop','vcebter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                   <el-col :span="6">
                      <el-tag closable type="success"  @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i></el-col>
                   <el-col :span="12">
                     <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                   </el-col>
                 </el-row>
               </el-col>
             </el-row>
           </template>
         </el-table-column>
         <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" >
         <template slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
           <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
           <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDiaog(scope.row)">分配权限</el-button>
         </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRIghrDialogVisible"
      width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRIghrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Roles',
  data() {
    return {
      //所有角色的列表数据
      rolelist:[],
      //控制分配权限对话框的显示与隐藏
      setRIghrDialogVisible:false,
      //所有权限的数据
      rightslist:[],
      //树形控件的属性绑定对象
       treeProps: {
          children: 'children',
          label: 'authName'
        },
        //默认选中的节点Id值
        defkeys:[],
        //当前即将分配权限的角色id
        roleId:''

    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList(){
      const { data: res } = await this.$http.get('roles')
       if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.rolelist = res.data
    },
    //根据id删除对用的权限
    async removeRightById(role,rightId){
      //弹框
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      //如果用户确认删除，则返回值为字符串 confirm
      //如果用户取消了删除，则返回值为字符串 cancel
     if(confirmResult !== 'confirm') {
       return this.$message.info('取消了删除！')
     }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        }
        this.$message.success('删除权限成功！')
        role.children = res.data

    },
    //展示分配权限的对话框
    async showSetRightDiaog(role){
       this.roleId= role.id
       const { data: res } = await this.$http.get('rights/tree')
       if (res.meta.status !== 200) {
          return this.$message.error('获取权限数据失败！')
        }
        //把获取到的权限数据保存到data中
        this.rightslist = res.data

        //递归获取三级节点的id
        this.getLeafKeys(role,this.defkeys)

        this.setRIghrDialogVisible = true
    },
    //通过递归的形式，获取角色下所有的三级权限的id，并保存到defkeys 数组中
    getLeafKeys(node,arr){
      //如果当前 node 节点不包含 children 属性，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }

      node.children.forEach(item =>
        this.getLeafKeys(item, arr)
      )

    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed(){
      this.defkeys = []
    },
    //点击为角色分配权限
    async allotRights(){
      const keys =[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})

       if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
         this.$message.success('分配权限成功！') 
         this.getRolesList()
          this.setRIghrDialogVisible = false
    }
  },
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{border-top:1px solid #eee}
.bdbottom{
  border-bottom:1px solid #eee
}
.vcebter{
  display: flex;
  align-items: center;
}
</style>