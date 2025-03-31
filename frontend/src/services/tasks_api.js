import axios from "axios";

const API_URL = "http://localhost:4000/tasks";

export const fetchTasks = async () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = user?.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

export const addTask = async (content) => {
    if (content.trim() === "") return null;
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = user?.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, { content }, config);
    return response.data;
};

export const updateTask = async (id, content, completed) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = user?.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.put(`${API_URL}/${id}`, { content, completed }, config);
    return response.data;
};

export const deleteTask = async (id) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = user?.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    await axios.delete(`${API_URL}/${id}`);
};

