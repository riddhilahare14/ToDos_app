import React, { useEffect, useState } from 'react'
import '../App.css'
import { fetchTasks, addTask, updateTask, deleteTask } from '../services/tasks_api.js'

const Tasks = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Current user in Tasks component:", user);
    if (user && !user.token) {
      console.error("User object doesn't contain token!");
    }
  }, [user]);

	useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user || !user.token) {
        throw new Error("Missing authentication token");
      }
      console.log("Using token:", user.token.substring(0, 10) + "...");
      
      const data = await fetchTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.success === false) {
        setError(data.message || "Failed to load tasks");
        console.error("API error:", data);
      } else {
        setTasks([]);
        console.warn("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      if (error.message && error.message.includes("token")) {
        setError("Authentication error: " + error.message);
      } else {
        setError("Failed to load tasks. Please try refreshing.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const task = await addTask(newTask);
      if (task) {
        setTasks((prevTasks) => [...prevTasks, task]);
        setNewTask("");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      if (error.message && error.message.includes("token")) {
        alert("Authentication error. Please log in again.");
        handleLogout();
      } else {
        alert("Failed to add task. Please try again.");
      }
    }
  };

  const handleUpdateTask = async (id, content, completed) => {
    try {
      const result = await updateTask(id, content, completed);
      if (result.success && result.updatedTask) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? result.updatedTask : task))
        );
      } else if (result.id) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? result : task))
        );
      } else {
        console.error("Update returned unexpected format:", result);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      if (error.message && error.message.includes("token")) {
        alert("Authentication error. Please log in again.");
        handleLogout();
      } else {
        alert("Failed to update task. Please try again.");
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.message && error.message.includes("token")) {
        alert("Authentication error. Please log in again.");
        handleLogout();
      } else {
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  console.log("Tasks component rendering with user:", user);

  if (isLoading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-[#ffffff]'>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-[#ffffff]'>
        <div className='w-full max-w-md shadow-2xl rounded-lg bg-[#fee9e8] p-6'>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={loadTasks}
            className='bg-[#b29bb8] text-[#ffffff] px-5 py-2 mt-4 rounded-lg'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-[#ffffff]'>
      <h2 className="text-2xl absolute top-7 left-10 font-semibold text-[#453837] mb-4">
        {`Heyy! ${user?.username || "User"}`}
      </h2>
      <button 
        onClick={handleLogout}
        className='absolute top-7 right-10 bg-[#b29bb8] text-[#ffffff] px-5 py-1 rounded-lg text-1xl transition-transform duration-300 hover:scale-105 hover:bg-[#79627e] shadow-[2px_2px_5px_#332936] active:bg-[#b29bb8]'
      >
        Logout
      </button>
      <div className='w-full max-w-md shadow-2xl rounded-lg bg-[#fee9e8] p-6'>
        <h1 className='text-3xl font-bold text-center text-[#453837]'>
          To-Do List
        </h1>
        <div className='flex gap-4 my-4'>
          <input 
            type="text"
            placeholder='Add a task...'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className='w-full border-2 border-[#685654] rounded-lg px-3 py-2 text-1xl focus:outline-none focus:ring-1 focus:ring-[#453837]'
          />
          <button
            onClick={handleAddTask}
            className='bg-[#b29bb8] text-[#ffffff] px-5 rounded-lg text-1xl transition-transform duration-300 hover:scale-105 hover:bg-[#79627e] shadow-[2px_2px_5px_#332936] active:bg-[#b29bb8]'
          >
            Add
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 my-4">No tasks yet. Add one above!</p>
        ) : (
          <ul className='space-y-2'>
            {tasks.map((task) => (
              <li
                key={task.id}
                className='flex items-center justify-between'
              >
                <div className='flex items-center space-x-2'>
                  <input 
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleUpdateTask(task.id, task.content, !task.completed)}
                    className='h-7 w-7'
                  />
                  <input
                    type="text"
                    value={task.content}
                    onChange={(e) => {
                      handleUpdateTask(task.id, e.target.value, task.completed)
                    }}
                    className={`border-none outline-none bg-transparent text-[#453837] text-1xl ${task.completed ? "line-through" : ""}`}
                  />
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className='bg-white border border-red-500 rounded-lg hover:bg-red-400 active:bg-red-700 px-2 py-1 m-1'
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Tasks;
