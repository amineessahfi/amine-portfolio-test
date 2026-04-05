import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { createDiscussUrl } from '../constants/routes'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function CostCalculator() {
  const [ec2Instances, setEc2Instances] = useState(10)
  const [s3Storage, setS3Storage] = useState(1000) // GB
  const [rdsInstances, setRdsInstances] = useState(3)
  const [dataTransfer, setDataTransfer] = useState(500) // GB
  const [optimizationLevel, setOptimizationLevel] = useState(30) // Percentage
  const beforeTrend = [0.94, 0.98, 1.01, 1.03, 1.08, 1.05, 1.02, 0.99, 1.04, 1.08, 1.1, 1.06]
  const afterTrend = [0.96, 0.98, 0.99, 1.0, 1.02, 1.01, 0.99, 0.98, 1.0, 1.01, 1.03, 1.02]

  // Calculate costs
  const calculateCosts = () => {
    const baseCost = 
      (ec2Instances * 73) + // $73/month per t3.medium
      (s3Storage * 0.023) + // $0.023/GB-month
      (rdsInstances * 115) + // $115/month per db.t3.medium
      (dataTransfer * 0.09) // $0.09/GB out
    
    const optimizedCost = baseCost * (1 - optimizationLevel / 100)
    const monthlySavings = baseCost - optimizedCost
    const annualSavings = monthlySavings * 12
    
    return {
      baseCost: Math.round(baseCost),
      optimizedCost: Math.round(optimizedCost),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings)
    }
  }

  const costs = calculateCosts()

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Before Optimization',
        data: beforeTrend.map((multiplier) => Math.round(costs.baseCost * multiplier)),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'After Optimization',
        data: afterTrend.map((multiplier) => Math.round(costs.optimizedCost * multiplier)),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9ca3af'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}/month`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return '$' + value.toLocaleString()
          }
        }
      }
    }
  }

  return (
    <section id="aws-cost-calculator" className="scroll-mt-28">
      <div className="terminal-window card-hover">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">aws-cost-optimizer — interactive</div>
        </div>

        <div className="terminal-content">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-white">AWS Cost Optimization Calculator</h3>
            <p className="max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Model the upside first, then use the discuss route to turn the estimate into a targeted infrastructure review.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-6">
          {/* Input Controls */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                EC2 Instances: <span className="text-primary-400">{ec2Instances}</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={ec2Instances}
                onChange={(e) => setEc2Instances(parseInt(e.target.value))}
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                S3 Storage: <span className="text-primary-400">{s3Storage.toLocaleString()} GB</span>
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={s3Storage}
                onChange={(e) => setS3Storage(parseInt(e.target.value))}
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                RDS Instances: <span className="text-primary-400">{rdsInstances}</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={rdsInstances}
                onChange={(e) => setRdsInstances(parseInt(e.target.value))}
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data Transfer: <span className="text-primary-400">{dataTransfer.toLocaleString()} GB</span>
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={dataTransfer}
                onChange={(e) => setDataTransfer(parseInt(e.target.value))}
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          {/* Optimization Level */}
          <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Optimization Level: <span className="text-primary-400">{optimizationLevel}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={optimizationLevel}
              onChange={(e) => setOptimizationLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Basic</span>
              <span>Aggressive</span>
            </div>
          </div>
          
          {/* Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="metric-card p-4">
              <div className="text-2xl font-bold gradient-text">${costs.baseCost.toLocaleString()}</div>
              <div className="mt-1 text-sm text-gray-400">Current Monthly</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-bold text-green-400">${costs.optimizedCost.toLocaleString()}</div>
              <div className="mt-1 text-sm text-gray-400">Optimized Monthly</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-bold text-cyan-400">${costs.monthlySavings.toLocaleString()}</div>
              <div className="mt-1 text-sm text-gray-400">Monthly Savings</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-bold text-purple-400">${costs.annualSavings.toLocaleString()}</div>
              <div className="mt-1 text-sm text-gray-400">Annual Savings</div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
            <div className="h-72">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
          
          {/* CTA */}
            <div className="rounded-2xl border border-primary-800 bg-primary-900/20 p-5">
              <p className="text-sm leading-7 text-gray-300">
                <span className="font-semibold">If the estimate feels real,</span> use the platform&apos;s discuss route and I&apos;ll turn it into a sharper savings plan with the right technical starting point.
              </p>
              <Link
                to={createDiscussUrl('cloud-cost-optimization')}
                className="mt-4 inline-flex justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-700"
              >
                Turn this into an AWS review
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CostCalculator
