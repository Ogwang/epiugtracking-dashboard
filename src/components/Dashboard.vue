<template>
  <div id="map">
    <v-map style="height:100%" :zoom="8" :center="mapCenter">
      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>

      <f-marker v-for="f in facilitiesAll" :key="f.uid" :lat-lng="f.location" :radius="500" color="#666" :tooltip="f.name"></f-marker>

      <f-marker v-for="event in events"  :key="event.id" :lat-lng="event.location" :radius="1000" color="#ef9504"
                :tooltip="eventInfo(event)"
      ></f-marker>

      <v-circle v-for="c in cases"  :key="c.id" :lat-lng="c.location" :radius="c.radius" color="#ed0b0b" @click="select(c)"
      ></v-circle>

      <wink v-for="event in winks" :key="event.id" :lat-lng="event.location"></wink>
    </v-map>

    <case-detail :show="showCaseDetail" v-on:hide="hideCaseDetail()"></case-detail>
  </div>
</template>

<script>
import { LMap, LTileLayer, LCircle, LGeoJson } from 'vue2-leaflet'
import Vue from 'vue'
import Wink from './Wink'
import CaseDetail from './CaseDetail'
import CircleMarker from './CircleMarker'

const facilityGeoJson = require('../assets/facility.json')

export default {
  name: 'Dashboard',
  components: {
    'v-map': LMap,
    'v-tilelayer': LTileLayer,
    'v-circle': LCircle,
    'f-marker': CircleMarker,
    'v-geo-json': LGeoJson,
    'wink': Wink,
    'case-detail': CaseDetail
  },
  data: function () {
    return {
      mapCenter: [1.3671058, 30.0588381],
      winks: [],
      facilitiesAll: '',
      geoJsonOptions: {
        style: function () {
          return {
            weight: 2,
            color: '#999',
            opacity: 1,
            fillColor: '#e4ce7f',
            fillOpacity: 0.4
          }
        }
      },
      facilities: [],
      villages: [],
      events: [],
      facilityMap: {},
      cases: [],
      showCaseDetail: true
    }
  },
  methods: {
    select (item) {
      console.log(item)
      this.showCaseDetail = true
    },
    hideCaseDetail () {
      console.log('close me')
      this.showCaseDetail = false
    },
    eventInfo (event) {
      return `PhoneNumber: ${event.phoneNumber} Symptom: ${event.symptom} Number of cases/deaths ${event.numberOfCases}/${event.numberOfDeaths}`
    }
  },
  mounted () {
    setTimeout(() => {
      this.showCaseDetail = false
    }, 500)
  },
  created () {
    this.facilitiesAll = facilityGeoJson.features.map(f => {
      const p = f.properties
      p.location = [p.Lat, p.Lon]
      return p
    })

    const db = Vue.$firebase.database()
    db.ref('facilities').once('value').then(snapshot => {
      snapshot.forEach(facility => {
        let id = facility.key
        const val = facility.val()
        val.location = [val.lat, val.lng]
        this.facilities.push(val)
        this.facilityMap[id] = val
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
    }).then(() => {
      db.ref('events').on('child_added', (snapshot) => {
        const event = snapshot.val()
        const facility = this.facilityMap[event.facility]
        if (facility) {
          if (event.resolve === undefined || event === false) {
            event.location = facility.location
            this.events.push(event)
            this.winks.push(event)
            setTimeout(() => {
              this.winks.splice(this.winks.indexOf(event), 1)
            }, 10000)
          }
        } else {
          console.log(`missing facility code ${event.facility}`)
        }
      })
    }).then(() => {
      db.ref('cases').on('child_added', (snap) => {
        const c = snap.val()
        c.id = snap.key
        const facility = this.facilityMap[c.facility]
        c.location = facility.location
        this.cases.push(c)
        this.winks.push(c)
        setTimeout(() => {
          this.winks.splice(this.winks.indexOf(c), 1)
        }, 10000)
      })
    })
    db.ref('events').on('child_changed', snap => {
      const event = snap.val()
      event.id = snap.key

      if (event.resolve) {
        // find index in events and remove it
        const idx = this.events.findIndex(item => item.id === event.id)
        if (idx >= 0) {
          console.log(`remove at index ${idx}`)
          this.events.splice(idx, 1)
        }
      }
    })

    db.ref('cases').on('child_removed', snap => {
      const c = snap.val()
      c.id = snap.key
      const idx = this.cases.findIndex(item => item.id === c.id)
      if (idx >= 0) {
        console.log(`remove at index ${idx}`)
        this.cases.splice(idx, 1)
      }
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
