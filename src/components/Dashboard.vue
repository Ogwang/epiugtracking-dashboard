<template>
  <div id="map">
    <v-map style="height:100%" :zoom="8" :center="mapCenter">
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>

      <v-circle v-for="village in villages"  :key="village.id" :lat-lng="village.location" :radius="1000"
      ></v-circle>
    </v-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LCircle } from 'vue2-leaflet'
import Vue from 'vue'

export default {
  name: 'Dashboard',
  components: {
    'v-map': LMap,
    'v-tilelayer': LTileLayer,
    'v-circle': LCircle
  },
  data: function () {
    return {
      mapCenter: [1.3671058, 30.0588381],
      facilities: {},
      villages: []
    }
  },
  created () {
    const db = Vue.$firebase.database()
    db.ref('facilities').once('value').then(snapshot => {
      snapshot.forEach(facility => {
        let id = facility.key
        const val = facility.val()
        this.facilities[id] = val
      })
    }).then(() => {
      db.ref('villages').once('value').then(snapshot => {
        snapshot.forEach(village => {
          let id = village.key
          const val = village.val()
          val.id = id
          val.location = [val.lat, val.lng]
          this.villages.push(val)
        })
      })
    })
  }
}
</script>

<style>
#map {
  height: 100%;
  width: 100%;
}
</style>
