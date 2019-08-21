module.exports = function(req, res, next) {
    console.info('req.user: ', req.user);
    if (!req.user) {
        return res.redirect('/login');
    }
    next();
}