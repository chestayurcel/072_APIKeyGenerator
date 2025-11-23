const pool = require('../config/db');
const crypto = require('crypto');

// Menampilkan halaman utama (form user)
const showHomePage = (req, res) => {
    const message = req.query.message;
    res.render('public/home', { 
        title: 'Generator API Key',
        message: message 
    });
};

// Memproses penyimpanan user dan API key
const saveUserAndKey = async (req, res) => {
    const { firstname, lastname, email, api_key } = req.body;

    if (!firstname || !lastname || !email || !api_key) {
        return res.redirect('/?message=Error: Semua field harus diisi');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const userQuery = 'INSERT INTO `user` (firstname, lastname, email) VALUES (?, ?, ?)';
        const [userResult] = await connection.execute(userQuery, [firstname, lastname, email]);
        
        const newUserId = userResult.insertId;

        const apiKeyQuery = 'INSERT INTO `apikey` (`key`, user_id, created_at, out_of_date) VALUES (?, ?, ?, ?)';
        await connection.execute(apiKeyQuery, [api_key, newUserId, startDate, endDate]);

        await connection.commit();
        res.redirect('/?message=Sukses! Data dan API Key berhasil disimpan.');

    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error saving data:', err); 
        let errorMsg = 'Gagal menyimpan data. Coba lagi.';
        
        if (err.code === 'ER_DUP_ENTRY') { 
            errorMsg = 'Email atau API Key ini sudah terdaftar.';
        }
        res.redirect(`/?message=Error: ${errorMsg}`);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    showHomePage,
    saveUserAndKey
};