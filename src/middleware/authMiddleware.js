// Middleware ini untuk memproteksi halaman admin

function checkAuth(req, res, next) {
    if (req.session.isAdmin) {
        // Jika sudah login, lanjutkan
        next();
    } else {
        // Jika belum, lempar ke halaman login
        res.redirect('/admin');
    }
}

module.exports = { checkAuth };