<template>
  <!-- The Modal -->
  <div id="myModal" class="modal" v-bind:style="{ display: display }">

    <!-- Modal content -->
    <div class="modal-content">
      <span class="close" v-on:click="$emit('hide')">&times;</span>
      <table border="1">
        <tr>
          <th class="facility"><span @click="select(null, 0)">Facility</span></th>
          <th v-for="d in days" :key="d" class="day">
            {{ d }}
          </th>
        </tr>
        <tr v-for="(f, idx) in facilities" :key="f.id">
          <td >
            <span @click="select(f, idx)" style="padding: 2px">{{ f.name }}</span>
          </td>
          <td v-for="d in days" :key="d" class="day">
            <span>
            {{ renderCase(f, d) }}
            </span>
          </td>
        </tr>
      </table>
      <div id="chart-container">
        <my-chart :data="chartData"></my-chart>
      </div>
    </div>

  </div>
</template>

<script>
import chart from './Chart'

export default {
  name: 'case-detail',
  props: ['show'],
  components: {
    'my-chart': chart
  },
  data () {
    return {
      chartData: [0],
      facilities: [
        {
          id: 1,
          name: 'Oyima HC III',
          cases: [0, 1, 2, 3, 4],
          deaths: [0, 0, 0, 0, 1]
        },
        {
          id: 2,
          name: 'Ragem HC II',
          cases: [1, 1, 2, 3, 3],
          deaths: [0, 0, 0, 0, 0]
        },
        {
          id: 3,
          name: 'Pawor HC II',
          cases: [0, 0, 0, 1, 1],
          deaths: [0, 0, 0, 0, 0]
        },
        {
          id: 4,
          name: 'Akino HC II',
          cases: [0, 1, 1, 0, 0],
          deaths: [0, 0, 0, 0, 0]
        },
        {
          id: 5,
          name: 'Pachora HC II',
          cases: [0, 0, 2, 3, 4],
          deaths: [0, 0, 0, 0, 1]
        }
      ],
      days: 10
    }
  },
  mounted () {
    setTimeout(() => {
      this.select()
    }, 800)
  },
  methods: {
    select (facility, idx) {
      if (facility !== null) {
        this.chartData = facility.cases
      } else {
        let acc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (var i = 0; i < 10; i++) {
          for (var j = 0; j < this.facilities.length; j++) {
            acc[i] = acc[i] + this.facilities[j].cases[i]
          }
        }
        this.chartData = acc
      }
      console.log(this.chartData)
    },
    renderCase (facility, day) {
      let c = -1
      if (facility.cases[day - 1] !== undefined) {
        c = facility.cases[day - 1]
      }
      let d = -1
      if (facility.deaths[day - 1] !== undefined) {
        d = facility.deaths[day - 1]
      }
      if (d === -1 && c === -1) {
        return ''
      } else {
        return `${c}/${d}`
      }
    }
  },
  computed: {
    display () {
      if (this.show) {
        return 'block'
      } else {
        return 'none'
      }
    },
    renderdata () {
      return this.testdata[this.testdataIndex]
    }
  }
}
</script>

<style>
/* The Modal (background) */
.modal {
  position: fixed; /* Stay in place */
  z-index: 1000000000; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
}

tr:hover {background-color: #f5f5f5;}

th {
  background-color: #666666;
  color: #fff;
}

td.facility {
  width: 200px;
  text-align: left;
}
td.day {
  width: 4em;
  text-align: center;
}

#chart-container {
  margin-top: 20px;
  width: 800px;
  height: 400px;
}
</style>
