<script>
import Chart from 'chart.js'
import { Doughnut, mixins } from 'vue-chartjs'

import 'chartjs-plugin-labels'

export default {
  name: 'DoughnutElement',
  extends: Doughnut,
  mixins: [mixins.reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        cutoutPercentage: 65,
        tooltips: {
          callbacks: {
            label({ index }, { labels, datasets }) {
              return ` ${datasets[0].data[index]} ${labels[index]}`
            },
          },
        },
      },
    }
  },
  mounted() {
    Chart.defaults.global.plugins.labels = {
      render: 'percentage',
      fontSize: 15,
      fontColor: '#fff',
      overlap: false,
    }
    this.renderChart(this.chartData, this.options)
  },
}
</script>
