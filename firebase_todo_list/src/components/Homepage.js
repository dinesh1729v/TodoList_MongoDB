import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import { child, get } from "firebase/database";
import axios from "axios";

import Header from "./Header.js";
import Footer from "./Footer.js";

import "./homepage.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";

export default function Homepage() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [todo, setTodo] = useState("");
  const [date, setDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState({});
  const [pages, setPages] = useState([]);
  const [editId, setEditId] = useState("");
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8000/todo/";
  useEffect(() => {
    auth.onAuthStateChanged(async userr => {
      if (userr) {
        // read
        setTodos([]);
        setUser(userr);
        await getData("");
      } else if (!userr) {
        navigate("/");
      }
    });
  }, []);

  const getData = async p => {
    let path = p ? `getAll?userId=${user.uid}&page=${p}` : `getAll?userId=${user.uid}`;
    let data = await axios.get(baseUrl + path);
    setTodos(data.data?.data);
    let px = [];
    if (data.data?.totalPages) {
      for (let index = 1; index <= data.data?.totalPages; index++) {
        px.push(index);
      }
      setPages(px);
    }
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch(err => {
        alert(err.message);
      });
  };

  // add
  const writeToDatabase = async () => {
    await axios.post(baseUrl + `add/`, { category, todo, description, date, userId: user.uid });
    await getData("");
    setDescription("");
    setCategory("");
    setDate("");
  };

  const [dbvals, setDbVals] = useState("");

  const getTodoByUidd = async uidd => {
    console.log("GetTODOByUidd");
    const snapshot = await get(child(ref(db), `${auth.currentUser.uid}/${uidd}`));
    if (snapshot.exists()) {
      console.log("Success");
      setDbVals(snapshot.val());
      return snapshot.val();
    } else {
      console.log("Hello");
      return null;
    }
  };

  const handleUpdate = async rec => {
    setIsEdit(true);
    // const dbVals = await getTodoByUidd(uid);

    setTodo(rec.todo);
    setDescription(rec.description);
    setCategory(rec.category);
    setDate(rec.date);
    setEditId(rec._id);
  };

  const handleEditConfirm = async () => {
    await axios.put(`${baseUrl}update/${editId}`, { todo, description, category, date, editId });
    setTodo("");
    setDescription("");
    setCategory("");
    setDate("");
    setIsEdit(false);

    await getData();
  };

  // delete
  const handleDelete = async id => {
    let data = await axios.get(`${baseUrl}delete/${id}`);
    await getData();
  };

  return (
    <>
      <div className="header">
        <Header />
      </div>
      <div className="homepage">
        <div className="add-container">
          <input className="add-edit-input" type="text" placeholder="Category..." value={category} onChange={e => setCategory(e.target.value)} />

          <input className="add-edit-input" type="text" placeholder="Add todo Name..." value={todo} onChange={e => setTodo(e.target.value)} />

          <input className="add-edit-input" type="text" placeholder="Description..." value={description} onChange={e => setDescription(e.target.value)} />
          <input className="add-edit-input" type="date" placeholder="Date..." value={date} onChange={e => setDate(e.target.value)} />
          {isEdit ? (
            <div>
              <CheckIcon onClick={handleEditConfirm} className="add-confirm-icon" />
            </div>
          ) : (
            <div className="confirm-icon">
              <AddIcon onClick={writeToDatabase} className="add-confirm-icon" />
            </div>
          )}
        </div>
        {todos.map(todo => (
          <div className="todo">
            <h1>{todo.todo}</h1>
            {/* <h1>{description.description}</h1> */}

            <EditIcon fontSize="large" onClick={() => handleUpdate(todo)} className="edit-button" />
            <DeleteIcon fontSize="large" onClick={() => handleDelete(todo._id)} className="delete-button" />
          </div>
        ))}
        <div className="pages">
          {pages.map(p => (
            <span className="page" onClick={() => getData(p)}>
              {p}
            </span>
          ))}
        </div>
        <LogoutIcon onClick={handleSignOut} className="logout-icon" />
        <div className="bottom-container">
          <Footer />
        </div>
      </div>
    </>
  );
}
