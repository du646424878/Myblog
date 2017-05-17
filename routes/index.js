var express = require('express');
var router = express.Router();

/*主页处理*/
router.all("/", function(req, res, next) {
    res.redirect("/index");
});

router.all("/index", function(req, res, next) {
    req.models.articles.find({},{},10,['modify_date','Z'],function(err,articles_){
        res.render("index",{
            articles : articles_,
            sessionuser : req.session.user
        });   

    });

});

/*登录处理*/
router.get("/login", function(req, res, next) {
    res.render("login",{
         sessionuser : req.session.user
    });
});

router.post("/login", function(req, res, next) {
     uname = req.body.username;
     pwd = req.body.password;
    req.models.user.find({
        username: uname,
        password: pwd
    }, function(err, people) {
        if (err)
            throw err;
        var auth = false;
        if (people.length > 0) {
            auth = true;
            people[0].lastlogindate = Date.now();
            people[0].lastloginip = req.ip;
            people[0].save(function(err) {
                if (err) throw err;
            });
        };
        if (auth) {
            req.session.islogin = true;
            req.session.user = people[0];
            res.send("success");
        } else {
            res.send("failed");
        }
    });
    
});
//登出处理
router.all("/logoff",function(req,res,next){
    req.session.user = "";
    req.session.islogin =false;
    res.redirect("/index");
});
//注册页面
router.get("/register", function(req, res, next) {
    res.render("register",{
         sessionuser : req.session.user
    });
});

//注册请求
router.post("/register", function(req, res, next) {
    name = req.body.username;
    req.models.user.find({
        username: name
    }, function(err, people) {
        if (people.length > 0) {
            res.send("hasuser");
        } 
        else{
    adduser = req.body;
    if (adduser) {
        adduser.usertype = 1;
       req.db.driver.execQuery("insert into user (username,password,usertype,email,nickname) values(?,?,?,?,?)", [adduser.username,adduser.password,adduser.usertype,adduser.email,adduser.nickname], function(err) {
              if(err)
              console.log(err);
              else
               res.send("success");
              });
           }  
        }
    });
  
});

module.exports = router;
