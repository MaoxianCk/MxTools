<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box"
         :class="{'content-collapse':collapse}">
      <div class="content">
        <transition name="move"
                    mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import bus from '@/assets/js/bus.js';
export default {
  data () {
    return {
      screenWidth: document.body.clientWidth, // 屏幕尺寸

      collapse: false,
      role: ''
    }
  },
  components: {
    vHead, vSidebar
  },
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg;
    });
    this.$store.state.screenWidth = document.body.clientWidth;
  },
  mounted () {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
        that.$store.state.screenWidth = document.body.clientWidth;
      })()
    };
  },
}
</script>
