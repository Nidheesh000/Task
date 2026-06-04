import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import StudyLoginPage from './StudyLoginPage'
import StudyNavbar from './StudyNavbar'
import TaskCard from './TaskCard'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [tasks, setTasks] = useState([]);

  const [subject, setSubject] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [deadline, setDeadline] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://task-55yk.onrender.com/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  // Add task
  const addTask = async () => {
    if (!subject || !taskDetails || !deadline) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("https://task-55yk.onrender.com/tasks", {
        subject,
        taskDetails,
        deadline,
      });

      setTasks([...tasks, response.data]);

      setSubject("");
      setTaskDetails("");
      setDeadline("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://task-55yk.onrender.com/tasks/${id}`);

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Login page
  if (!isLoggedIn) {
    return <StudyLoginPage setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div
      className={
        isDarkMode
          ? "bg-dark text-light min-vh-100"
          : "bg-light min-vh-100"
      }
    >
      <StudyNavbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setIsLoggedIn={setIsLoggedIn}
      />

      <div className="container">
        {/* Add Task Form */}
        <div
          className={
            isDarkMode
              ? "card bg-secondary text-light p-4 mb-4"
              : "card p-4 mb-4 shadow-sm"
          }
        >
          <h3 className="mb-3">Add Study Task</h3>

          <input
            type="text"
            placeholder="Subject"
            className="form-control mb-3"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <textarea
            placeholder="Task Details"
            className="form-control mb-3"
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
          />

          <input
            type="date"
            className="form-control mb-3"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button className="btn btn-success" onClick={addTask}>
            Add Task
          </button>
        </div>

        {/* Task Cards */}
        <div className="row">
          {tasks.map((task) => (
            <div className="col-md-4" key={task._id}>
              <TaskCard
                subject={task.subject}
                taskDetails={task.taskDetails}
                deadline={task.deadline}
                isDarkMode={isDarkMode}
                deleteTask={() => deleteTask(task._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;