<template>
  <div class="sidebar">
    <div class="search">
      <el-input v-model.trim="menuFilterWord"
                placeholder="搜索..."
                size="mini"
                maxlength="10"
                clearable></el-input>
    </div>

    <el-scrollbar class="scrollbar">
      <!-- 滚动条 -->
      <el-menu class="menu"
               mode="vertical"
               :default-active="nowSelectIndex"
             background-color="var(--BaseBackgroundColor)"
             text-color="var(--MainTextColor)"
             active-text-color="var(--MainTextActiveColor)"
               unique-opened
               router>
        <el-menu-item-group v-for="(_type,typeIndex) in filterModuleList"
                            v-bind:key="typeIndex">
          <template slot="title">{{_type.name}}</template>
          <el-menu-item v-for="(_module,moduleIndex) in _type.children"
                        v-bind:key="moduleIndex"
                        :disabled="_module.src_path==''"
                        :index="_module.name_en">{{_module.name}}</el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      configFile: require('@/config.json'),
      moduleList: [],

      filterModuleList: [],
      menuFilterWord: '',
    }
  },
  methods: {
    initModuleList () {
      this.moduleList = [];
      for (let _type of this.configFile.typeList) {
        let tempType = {
          name: _type.name,
          name_en: _type.name_en,
          children: []
        }
        for (let moduleKey of _type.children) {
          for (let _module of this.configFile.moduleList) {
            if (_module.name_en === moduleKey) {
              tempType.children.push(_module);
              break;
            }
          }
        }
        this.moduleList.push(tempType);
        this.filterModuleList.push(tempType);
      }
    }
  },
  watch: {
    menuFilterWord (key) {
      key = key.toUpperCase();
      this.filterModuleList = JSON.parse(JSON.stringify(this.moduleList));
      if (key.trim() != '') {
        for (let type of this.filterModuleList) {
          type.children = type.children.filter((moduleItem) => {
            if ((moduleItem.name.toUpperCase().indexOf(key) != -1) ||
              (moduleItem.name_en.toUpperCase().indexOf(key) != -1)) {
              return true;
            }
            for (let words of moduleItem.key_words) {
              if (words.toUpperCase().indexOf(key) != -1) {
                return true;
              }
            }
            return false;
          })
        }
      }
    }
  },
  created () {
    this.initModuleList();
  },
  computed: {
    nowSelectIndex () {
      return this.$route.path.replace('/', '');
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: var(--SideBarWidth);
  height: 100%;
}
.scrollbar {
  height: calc(100% - 100px);
}
.search {
  margin-top: 10px;
  padding: 2px;
  padding-left: 20px;
}
.menu {
  margin-top: 20px;
  border: none;
  height: 100%;
  overflow-x: hidden;
}
.el-menu-item {
  height: 42px;
  line-height: 42px;
}
.el-menu-item-group {
  margin-bottom: 20px;
}
/* .el-menu-item:focus,
.el-menu-item:hover {
  background-color: #fff;
  color: var(--MainTextActiveColor);
} */
</style>
