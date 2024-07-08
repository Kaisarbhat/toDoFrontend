import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/todos', { text: newTodo }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setTodos([...todos, res.data]);
      setNewTodo('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, 
        { completed: !todo.completed }, 
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <form onSubmit={addTodo}>
        <input 
          type="text" 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
          placeholder="New todo" 
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <input 
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => toggleTodo(todo._id)} 
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;