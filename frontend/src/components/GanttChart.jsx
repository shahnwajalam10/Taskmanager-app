"use client"

import { useEffect, useState } from "react"

const GanttChart = ({ tasks }) => {
  const [timeRange, setTimeRange] = useState({ min: 0, max: 0 })

  useEffect(() => {
    if (tasks.length > 0) {
      const minDate = new Date(Math.min(...tasks.map((t) => new Date(t.startDate))))
      const maxDate = new Date(Math.max(...tasks.map((t) => new Date(t.endDate))))
      setTimeRange({
        min: minDate,
        max: maxDate,
        range: maxDate - minDate,
      })
    }
  }, [tasks])

  const getTaskPosition = (task) => {
    if (!timeRange.range) return { left: 0, width: 0 }
    const start = ((new Date(task.startDate) - timeRange.min) / timeRange.range) * 100
    const end = ((new Date(task.endDate) - timeRange.min) / timeRange.range) * 100
    const width = Math.max(1, end - start)
    return { left: start, width }
  }

  const getTodayPosition = () => {
    if (!timeRange.range) return 0
    const today = new Date()
    return ((today - timeRange.min) / timeRange.range) * 100
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "to do":
        return "bg-gray-400 hover:bg-gray-500"
      case "in progress":
        return "bg-blue-500 hover:bg-blue-600"
      case "done":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-400 hover:bg-gray-500"
    }
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No tasks to display</p>
        <p className="text-gray-400 text-sm mt-1">Create some tasks to see your timeline</p>
      </div>
    )
  }

  const todayPosition = getTodayPosition()

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">Project Timeline</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span className="text-gray-600">To Do</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Done</span>
          </div>
        </div>
      </div>

      <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Today Line */}
        {todayPosition >= 0 && todayPosition <= 100 && (
          <div className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-10" style={{ left: `${todayPosition}%` }}>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-sm">Today</div>
            </div>
          </div>
        )}

        {/* Task Bars */}
        <div className="relative">
          {tasks.map((task, index) => {
            const { left, width } = getTaskPosition(task)
            const statusColor = getStatusColor(task.status)

            return (
              <div
                key={task._id}
                className="flex items-center py-3 px-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors group"
                style={{ minHeight: "50px" }}
              >
                <div className="w-24 flex-shrink-0 pr-4">
                  <div className="text-sm font-medium text-black truncate">{task.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{task.status}</div>
                </div>

                <div className="flex-1 relative h-6">
                  <div
                    className={`absolute h-4 rounded ${statusColor} transition-colors flex items-center px-2`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                  >
                    {width > 15 && (
                      <span className="text-white text-xs font-medium truncate">
                        {new Date(task.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                        {new Date(task.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-0 top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-gray-300">
                        {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-gray-300">Status: {task.status}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
        <div>
          <span className="font-medium">{tasks.length}</span> task{tasks.length !== 1 ? "s" : ""} total
        </div>
        {timeRange.min && timeRange.max && (
          <div>
            {timeRange.min.toLocaleDateString()} - {timeRange.max.toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default GanttChart
