<template>
  <div id="map">
    <v-map style="height:100%" :zoom="8" :center="mapCenter">
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
    </v-map>
  </div>
</template>

<script>
import { LMap, LTileLayer } from 'vue2-leaflet'

export default {
  name: 'Dashboard',
  components: {
    'v-map': LMap,
    'v-tilelayer': LTileLayer
  },
  data: function () {
    return {
      mapCenter: [1.3671058, 30.0588381]
    }
  }
}
</script>

<style>
#map {
  height: 100%;
  width: 100%;
}
</style>
