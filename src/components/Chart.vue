<script>
import { Bar } from 'vue-chartjs'
window.pok = Bar
// Exporting this so it can be used in other components
export default {
  extends: Bar,
  props: ['data'],
  data () {
    return {
      // Chart.js options that controls the appearance of the chart
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  watch: {
    data (newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.$data._chart.destroy()
      this.renderChart(this.data, this.options)
    }
  },
  mounted () {
    // renderChart function renders the chart with the datacollection and options object.
    console.log('.>>>>')
    console.log(this.data)
    this.renderChart(this.data, this.options)
  },
  methods: {
    createChartData () {
      const base = {
        labels: ['day 1', 'day 2', 'day 3', 'day 4', 'day 5'],
        datasets: [
          {
            label: 'Cases',
            backgroundColor: '#f87979',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            // Data to be represented on y-axis
            data: [40, 20, 30, 50, 90]
          }
        ]
      }
    }
  }
}
</script>
