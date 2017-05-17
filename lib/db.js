var orm = require('orm');
module.exports = function(app){
  app.use(orm.express("sqlite:blog.db",{
      define:function(db, models, next) {
              models.user = db.define("user", {
                id: {
                    type: 'serial',
                    key: true
                },
                username: String,
                password: String,
                email:String,
                usertype: Number,
                nickname: String,
                lastlogindate: Number,
                lastloginip: String
            });
              models.articles = db.define("articles", {
                id: {
                    type: 'serial',
                    key: true
                },
                title: String,
                content: String,
                userid: {
                    type: 'integer'
                },
                create_date: Number,
                modify_date: Number
            });
              models.comment = db.define("comment", {
                id: {
                    type: 'serial',
                    key: 'true'
                },
                articleid: Number,
                userid: Number,
                comment: String,
                createdate: Number
            });

           models.user.sync(function () {
            // created tables for user model
        });
           models.articles.sync(function () {
            // created tables for articles model
        });
           models.comment.sync(function () {
            // created tables for comment model
        });
next();
      }

  }));
  
}