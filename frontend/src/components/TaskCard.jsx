"use client"

import { useState } from "react"
import { updateTask, deleteTask } from "../services/api"

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  })

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      await updateTask(task._id, editedTask)
      onUpdate()
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsLoading(true)
      try {
        await deleteTask(task._id)
        onDelete()
      } catch (error) {
        console.error("Error deleting task:", error)
        setIsLoading(false)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "to do":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "done":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200">
      {isEditing ? (
        <div className="p-4">
          <h4 className="text-lg font-semibold text-black mb-4">Edit Task</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Title</label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Description</label>
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Status</label>
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="flex space-x-2 pt-4">
              <button
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoading || !editedTask.title.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-black">{task.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>

            {task.description && <p className="text-gray-600 text-sm mb-4">{task.description}</p>}

            <div className="text-sm text-gray-500 mb-4">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                  />
                </svg>
                {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50 disabled:opacity-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TaskCard
