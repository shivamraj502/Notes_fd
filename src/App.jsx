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

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  // Fetch all notes from backend
  const fetchNotes = async () => {
    try {
      const res = await axios.get("https://notes-943e.onrender.com/notes");
      // const res = await axios.get("http://localhost:5000/notes");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add note to backend
  const addNote = async () => {
    if (!note.trim()) return;

    try {
      await axios.post("https://notes-943e.onrender.com/notes", {
        title: note
      });
    // try {
    //   await axios.post("http://localhost:5000/notes", {
    //      title: note 
    //     });

      setNote("");
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete note from backend
  const deleteNote = async (id) => {
    try {
      await axios.delete(`https://notes-943e.onrender.com/notes/${id}`);
      // await axios.delete(`http://localhost:5000/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="app">
      <h1 className="app-title">Notes App</h1>

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