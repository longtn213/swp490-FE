import { Paper } from '@mui/material'

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  plugins: {
    title: {
      display: true,
      text: 'Mật độ lịch hẹn trong ngày (theo giờ)'
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      title:{
        display: true,
        text: "Thời gian"
      }
    },
    y: {
      stacked: true,
      title:{
        display: true,
        text: "Số lượng"
      },
      ticks: {
        beginAtZero: true,
        callback: function(value) {if (value % 1 === 0) {return value;}}
      }
    },
  }
}

const ProductivityInDayChart = props => {
  const { data } = props

  const chartData = {
    labels: data?.map((item) => `${item.hour}:00`),
    datasets: [
      {
        label: 'Chờ thực hiện',
        data: data?.map((item) => item.totalReady),
        backgroundColor: 'rgb(255, 99, 132)'
      },
      {
        label: 'Đang thực hiện',
        data:  data?.map((item) => item.totalInprocess),
        backgroundColor: 'rgb(75, 192, 192)'
      },
      {
        label: 'Hoàn thành',
        data: data?.map((item) => item.totalClosed),
        backgroundColor: 'rgb(53, 162, 235)'
      }
    ]
  }

  return (
    <>
      <Bar options={options} data={chartData} />
    </>
  )
}

export default ProductivityInDayChart
