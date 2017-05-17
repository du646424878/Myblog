module.exports = function auth(app) {
    // 通过Session记录认证信息
    app.use(function(req, res, next) {
        if (!req.session.isinit) {
            req.session.isinit = true;
            req.session.islogin = false;
            req.session.user = "";
        };
        next();
    });
}