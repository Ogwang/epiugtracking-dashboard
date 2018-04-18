<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import "../node_modules/leaflet/dist/leaflet.css";
#app {
  height: 800px;
  width: 100%;
}
</style>
