/**
Day 114 – Mini Project: Full-Stack Notes App

Task:
Backend (Node + MongoDB)
Connect with frontend (React)
Deploy live
 */


import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("https://notes-943e.onrender.com/notes");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  
  const addNote = async () => {
    if (!note.trim()) return;

    try {
      await axios.post("https://notes-943e.onrender.com/notes", {
        title: note
      });

      setNote("");
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };


  const deleteNote = async (id) => {
    try {
      await axios.delete(`https://notes-943e.onrender.com/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h1>Notes App</h1>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter note"
      />

      <button onClick={addNote}>Add</button>

      {notes.map((item) => (
        <div key={item._id}>
          {item.title}
          <button onClick={() => deleteNote(item._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;


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