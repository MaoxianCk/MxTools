<template>
  <div class="header">
    <div class="logo"
         @click="goTo('/')">MxTools</div>
    <div class="logo-cn"
         @click="goTo('/')">毛线的工具箱</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen"
             @click="handleFullScreen">
          <el-tooltip effect="dark"
                      :content="fullscreen?`取消全屏`:`全屏`"
                      placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div v-if="this.$store.state.screenWidth>768"
         class="header-soup">
      {{soupToday}}
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      fullscreen: false,
      powerSoup: require('@/powerSoup.json').soup,
      soupToday: ''
    }
  },
  methods: {
    // 全屏事件
    handleFullScreen () {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    getSoup () {
      let now = new Date();
      let mask =
        now.getFullYear() +
        now.getMonth() +
        now.getDate() +
        now.getDay() +
        now.getHours() +
        now.getMinutes()
      this.soupToday = this.powerSoup[mask % this.powerSoup.length];
      // this.soupToday = this.powerSoup[0];
      this.soupToday = this.soupToday.replace('#{year}', now.getFullYear());
    }
  },
  created () {
    this.getSoup();
  }
}
</script>
<style scoped>
.header {
  background-color: var(--BaseBackgroundColor);
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: var(--MainTextColor);
  z-index: 999;
  box-shadow: 0 1px 5px var(--BaseBorderColor);
}
.header .logo {
  margin-left: 20px;
  float: left;
  width: 90px;
  line-height: 70px;
  cursor: pointer;
}
.header .logo-cn {
  float: left;
  width: 100px;
  font-size: 14px;
  line-height: 70px;
  cursor: pointer;
}
.header .logo:hover,
.logo-cn:hover {
  color: var(--MainTextActiveColor);
  transition: 0.3s;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-soup {
  max-width: 368px;
  height: 70px;
  float: right;
  padding-right: 50px;
  padding-top: 25px;
  line-height: 17px;
  font-size: 14px;
  color: #9c9c9c;
  word-wrap: break-word;
  word-break: normal;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: var(--BaseBackgroundColor);
}
.btn-bell .el-icon-bell {
  color: var(--MainTextColor);
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: var(--MainTextColor);
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
