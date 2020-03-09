<template>
  <div id="app">
    <router-view v-if="routerAlive" />
  </div>
</template>
<script></script>
<script>
export default {
  name: "App",
  data() {
    return {
      routerAlive: true
    };
  },
  provide() {
    return {
      routerRefresh: this.routerRefresh
    };
  },
  methods: {
    routerRefresh() {
      this.routerAlive = false;
      this.$nextTick(() => {
        this.routerAlive = true;
      });
    }
  }
};
</script>
