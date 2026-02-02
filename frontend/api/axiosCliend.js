import axios from 'axios';

// ⚠️ สำคัญมาก: เปลี่ยนตรงนี้เป็น IP Address เครื่องคุณ!
// ห้ามใช้ localhost เพราะมือถือจะมองไม่เห็น
const BASE_URL = 'http://172.29.60.46:3000';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;