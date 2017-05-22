
var express = require('express');
var router = express.Router();

router.all("/newblog", function(req, res, next) {
    res.render("newblog", {
        sessionuser : req.session.user
    });
});
// 添加blog API
router.post("/addblog", function(req, res, next) {
    req.models.articles.create({
        title: req.body.title,
        content: req.body.content,
        userid: req.session.user.id,
        create_date: Date.now(),
        modify_date: Date.now()
    }, function(err) {
        if (err)
            throw err;
    });
    var a = Date.now();
    res.send("success");
});
//博客详情
router.all("/blog/:blogid", function(req, res, next) {

    req.models.articles.get(req.params.blogid, function(err, article_) {
        try {
            if (err) throw err;
            req.models.user.get(article_.userid, function(err, user_) {
                if (err) throw err;
              req.db.driver.execQuery("select comment.*,user.nickname from comment left join user on user.id = comment.userid where comment.articleid  = ? order by createdate desc", [article_.id], function(err, comments_) {
              console.log(comments_);
              res.render("blogdetail",{
                    sessionuser: req.session.user,
                    article : article_,
                    user :user_ ,
                    comments : comments_
              });
            });
          });
        } catch (e) {
            next(e);
        }
    });

});
//获取所有博客
router.all("/allblogs/page/:pageid", function(req, res, next) {
    var pageid = req.params.pageid;
    req.models.articles.find({}, { offset: (pageid - 1) * 15 }, 15, ['create_date', 'Z'],
        function(err, articles) {
            req.models.articles.count({}, function(err, count) {
                page = {
                    pageid: pageid,
                    count: count,
                    singlepagecount: 15,
                    totalpage: Math.ceil(count / 15),
                    pageurl: "/articles/allblogs/page/"
                };
                res.render('allblogs', {
                    sessionuser:req.session.user,
                    articles: articles,
                    page: page
                });
            })
        });
});
//获取某作者所有博客
router.all("/allblogs/user/:userid/page/:pageid", function(req, res, next) {
    var userid = req.params.userid;
    var pageid = req.params.pageid;
    req.models.articles.find({ userid: userid }, { offset: (pageid - 1) * 15 }, 15, ['create_date', 'Z'],
        function(err, articles) {
            req.models.articles.count({ userid: userid }, function(err, count) {
                page = {
                    pageid: pageid,
                    count: count,
                    singlepagecount: 15,
                    totalpage: Math.ceil(count / 15),
                    pageurl: "/artilces/allblogs/user/" + userid + "/page/"
                };
                res.render('allblogs', {
                    sessionuser:req.session.user,
                    articles: articles,
                    page: page
                });
            })
        });
});
// 删除博客
router.all("/deleteblog/:blogid", function(req, res, next) {
    req.models.articles.find({
        id: req.params.blogid
    }).remove(function(err) {
        if (err) throw err;
    });
    req.models.comment.find({
        articleid : req.params.blogid
    }).remove(function(err){
        if (err) throw err;
    });
    res.send("success");
});
// 提交评论
router.post("/comment/add/:blogid", function(req, res, next) {
    acomment = req.body;
    acomment.userid = req.session.user.id;
    acomment.createdate = Date.now();
    acomment.articleid = req.params.blogid;
    req.db.driver.execQuery("insert into comment (articleid,userid,comment,createdate) values(?,?,?,?)", [acomment.articleid,acomment.userid,acomment.comment,acomment.createdate], function(err) {
              if(err)
              console.log(err);
              else
               res.send("success");
    });
});
//删除评论
router.post("/comment/delete/:commentid", function(req, res, next) {
    req.models.comment.find({
        id: req.params.commentid
    }).remove(function(err) {
        if (err) throw err;
    });
});
module.exports = router;