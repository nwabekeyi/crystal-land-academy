import axios from "axios";


const url = process.env.REACT_APP_BASE_URL
console.log(url)
// Use localhost:5002 for local development
// const serverApi = "http://localhost:5002/api";
const serverApi = `${url}/api`; // Production URL

export const getRoomExists = async (roomId) => {
    const response = await axios.get(`${serverApi}/room-exists/${roomId}`);

    return response.data;
};

export const getTURNCredentials = async () => {
    const response = await axios.get(`${serverApi}/get-turn-credentials`);

    return response.data;
};
