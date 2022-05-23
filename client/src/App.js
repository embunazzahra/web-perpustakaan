import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [todo, setTodo] = useState([]);

  useEffect(() => {
    fetchToDos();
  }, []);

  const fetchToDos = async () => {
    const response = await fetch("http://localhost:4000/anggota");
    const data = await response.json();
    setTodo(data);
  };

  return (
    <div>
      <div>ANGGOTA PERPUS:</div>
      <div>
        {todo.map((t) => (
          <div key={t.id_anggota}>{t.nama_anggota}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
