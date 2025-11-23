const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Menampilkan halaman login admin
const showLoginPage = (req, res) => {
    if (req.session.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    const error = req.query.error;
    res.render('admin/login', { 
        title: 'Admin Login',
        error: error 
    });
};

// Memproses login admin
const processLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.execute('SELECT * FROM `admin` WHERE `email` = ?', [email]);
        
        if (rows.length === 0) {
            return res.redirect('/admin?error=Email tidak ditemukan');
        }

        const admin = rows[0];

        const inputPassword = password.trim();
        const dbHash = admin.password_hash.trim();
        const match = await bcrypt.compare(inputPassword, dbHash);

        if (match) {
            req.session.isAdmin = true;
            req.session.adminEmail = email;
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/admin?error=Password salah');
        }
    } catch (err) {
        console.error('Login error:', err);
        res.redirect('/admin?error=Terjadi kesalahan server');
    }
};

// Proses logout
const processLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
};

// Menampilkan dashboard
const showDashboard = async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT u.id, u.firstname, u.lastname, u.email
            FROM \`user\` u
            JOIN \`apikey\` a ON u.id = a.user_id
            ORDER BY u.id;
        `;
        const [users] = await pool.query(query);
        
        res.render('admin/dashboard', { 
            title: 'Admin Dashboard',
            users: users
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).send('Terjadi kesalahan saat mengambil data');
    }
};

// Menampilkan detail user
const showUserDetail = async (req, res) => {
    const userId = req.params.id;

    try {
        const query = `
            SELECT
                u.firstname,
                u.lastname,
                u.email,
                a.key,
                a.created_at AS start_date,
                a.out_of_date AS end_date,
                CASE
                    WHEN CURRENT_DATE > a.out_of_date THEN 'Invalid'
                    ELSE 'Valid'
                END AS status
            FROM \`user\` u
            JOIN \`apikey\` a ON u.id = a.user_id
            WHERE u.id = ?;
        `;
        
        const [details] = await pool.execute(query, [userId]);

        if (details.length === 0) {
            return res.status(404).send('User tidak ditemukan');
        }
        
        res.render('admin/detail', { 
            title: `Detail User - ${details[0].firstname}`,
            userDetails: details,
            user: details[0]
        });

    } catch (err) {
        console.error('Detail user error:', err);
        res.status(500).send('Terjadi kesalahan saat mengambil data');
    }
};

module.exports = {
    showLoginPage,
    processLogin,
    processLogout,
    showDashboard,
    showUserDetail
};