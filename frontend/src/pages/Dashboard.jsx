"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { getTasks, createTask } from "../services/api"
import TaskCard from "../components/TaskCard"
import GanttChart from "../components/GanttChart"

const Dashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks()
        setTasks(response.data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const response = await createTask(newTask)
      setTasks([...tasks, response.data])
      setNewTask({
        title: "",
        description: "",
        status: "To Do",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      })
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const handleTaskUpdate = async () => {
    try {
      const response = await getTasks()
      setTasks(response.data)
    } catch (error) {
      console.error("Error updating tasks:", error)
    }
  }

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter((task) => task._id !== taskId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-gray-700">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Welcome, {user?.username}</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Create Task */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-black mb-6">Create New Task</h2>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                    placeholder="Task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none transition-colors"
                    placeholder="Task description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newTask.startDate}
                      onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">End Date</label>
                    <input
                      type="date"
                      value={newTask.endDate}
                      onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Task
                </button>
              </form>
            </div>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-black mb-6">Your Tasks</h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onUpdate={handleTaskUpdate}
                      onDelete={() => handleTaskDelete(task._id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No tasks found</p>
                    <p className="text-gray-400 text-sm mt-1">Create your first task to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-black mb-6">Project Timeline</h2>
              <div className="h-96 overflow-auto">
                <GanttChart tasks={tasks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
