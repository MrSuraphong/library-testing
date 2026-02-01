const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Import ตัว API ของเรามาเทส

// ตัวแปรสำหรับเก็บค่า ID เพื่อส่งต่อระหว่าง Test Case
let userId;
let bookId;
let transactionId;

// ก่อนเริ่มเทสทั้งหมด ให้เคลียร์ Database ก่อนเพื่อให้ชัวร์ว่าเทสจะไม่เพี้ยน
beforeAll(async () => {
    // ลบข้อมูลเก่าทิ้ง
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// หลังจบเทสทั้งหมด ให้ตัดการเชื่อมต่อเพื่อจบ Process
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Library API Unit Tests (10 Cases)', () => {

    // --- Group 1: User & Auth ---

    // Case 1: สมัครสมาชิกสำเร็จ
    it('(1) POST /register - Should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'password123',
                role: 'member'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('user');
        userId = res.body.user._id; // เก็บ ID ไว้ใช้ตอนยืม
    });

    // Case 2: สมัครสมาชิกซ้ำ (ต้อง Error)
    it('(2) POST /register - Should fail for duplicate username', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(400);
    });

    // Case 3: เข้าสู่ระบบสำเร็จ
    it('(3) POST /login - Should login successfully', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Login successful');
    });

    // Case 4: เข้าสู่ระบบผิด (ต้อง Error)
    it('(4) POST /login - Should fail with wrong password', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(401);
    });

    // --- Group 2: Books ---

    // Case 5: เพิ่มหนังสือสำเร็จ
    it('(5) POST /books - Should create a new book', async () => {
        const res = await request(app)
            .post('/books')
            .send({
                title: 'Jest Testing Guide',
                author: 'Facebook',
                quantity: 1 // มีแค่ 1 เล่ม
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        bookId = res.body._id; // เก็บ ID ไว้ใช้ตอนยืม
    });

    // Case 6: ดูรายชื่อหนังสือ
    it('(6) GET /books - Should return all books', async () => {
        const res = await request(app).get('/books');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // --- Group 3: Borrow & Return ---

    // Case 7: ยืมหนังสือสำเร็จ
    it('(7) POST /borrow - Should borrow a book successfully', async () => {
        const res = await request(app)
            .post('/borrow')
            .send({
                user_id: userId,
                book_id: bookId
            });
        expect(res.statusCode).toEqual(201);
        transactionId = res.body.transaction._id; // เก็บ Transaction ID ไว้คืน
    });

    // Case 8: ยืมหนังสือซ้ำ/ของหมด (ต้อง Error เพราะเมื่อกี้มี 1 เล่ม ยืมไปแล้ว)
    it('(8) POST /borrow - Should fail when book is out of stock', async () => {
        const res = await request(app)
            .post('/borrow')
            .send({
                user_id: userId,
                book_id: bookId
            });
        // คาดหวัง 400 (Out of stock)
        expect(res.statusCode).toEqual(400);
    });

    // Case 9: คืนหนังสือสำเร็จ
    it('(9) POST /return - Should return a book successfully', async () => {
        const res = await request(app)
            .post('/return')
            .send({
                transaction_id: transactionId
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.transaction.status).toEqual('returned');
    });

    // Case 10: คืนหนังสือซ้ำ (ต้อง Error)
    it('(10) POST /return - Should fail if already returned', async () => {
        const res = await request(app)
            .post('/return')
            .send({
                transaction_id: transactionId
            });
        expect(res.statusCode).toEqual(400);
    });

});