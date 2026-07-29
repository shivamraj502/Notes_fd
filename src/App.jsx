/**
Day 114 – Mini Project: Full-Stack Notes App

Task:
Backend (Node + MongoDB)
Connect with frontend (React)
Deploy live
 */


/**
Now flow is:
Frontend (React)
   ↓
Axios
   ↓
Backend (Node)
   ↓
MongoDB Atlas
 */

import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Login from "./Login";

const API = "https://notes-943e.onrender.com";
// const API = "http://localhost:5000";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Helper to build auth header
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`, authHeader());
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;

    try {
      await axios.post(`${API}/notes`, { title: note }, authHeader());
      setNote("");
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`, authHeader());
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setNotes([]);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotes();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app">
      <div className="header-row">
        <h1 className="app-title">Notes App</h1>
        <button className="delete-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="input-row">
        <input
          className="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter notes"
        />
        <button className="add-btn" onClick={addNote}>Add</button>
      </div>

      <div className="notes-list">
        {notes.map((item) => (
          <div className="note-card" key={item._id}>
            <span className="note-text">{item.title}</span>
            <button className="delete-btn" onClick={() => deleteNote(item._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;