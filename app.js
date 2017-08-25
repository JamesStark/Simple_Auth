var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    path                  = require("path"),
    bodyParser            = require("body-parser"),
    cookieParser          = require("cookie-parser"),
    flash                 = require("connect-flash"),
    expressValidator      = require("express-validator"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require("method-override");

mongoose.connect('mongodb://localhost/project');
var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

var port = 3002;

//USE PACKAGES
app.use(require("express-session")({
  secret:"Secret!!! Yarkittayum Solla Koodathuu",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//EXPRESS VALIDATOR
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//USE FLASH

app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//ROUTES

app.get("/",function(req,res){
  if (req.isAuthenticated) {
    res.redirect("/dashboard");
  }else{
    res.render("index");
  }

});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render('login');
});

// app.get("/secret",isLoggedIn,function(req,res){
// 	res.render("secret", {user: req.user });
// });

// SHOW =>show more info
app.get("/dashboard/:_id", function(req,res){
    res.render("profile", {user: req.user});
    });

var appSchema = new mongoose.Schema({
    projectid : String,
    projectname : String,
    assignedto : String,
    date : String,
    duedate : String,
    amount : String,
    advance : String,
    balance : String,
    customer: String,
    contact : String,
    address: String,
    sellingprice:String,
    sellingadvance:String,
    sellingbalance:String

})

var New = mongoose.model("New",appSchema);

app.get("/dashboard",isLoggedIn,function(req,res){
    New.find({},function(err,all){
        if(err){
            console.log(err);
        } else{
    res.render("dashboard",{all:all,user: req.user});
        }
    });

});


app.get("/assignproject",function(req,res){
    res.render("assignproject");
});


app.get("/developer",function(req,res){
     New.find({},function(err,all){
        if(err){
            console.log(err);
        } else{
    res.render("developer",{all:all});
        }
    });
});


app.get("/developer/:id",function(req,res){

    New.findById(req.params.id,function(err,click){
        if(err){
            console.log(err);
        } else {
    res.render("editassignproject",{passing:click});
        }
   });
});


app.put("/editassignproject/:id",function(req,res){
    New.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updated){
        if(err){
            res.redirect("/developer");
        }  else {
            res.redirect("/developer");
        }
    });

});


app.get("/customer",function(req,res){
     New.find({},function(err,all){
        if(err){
            console.log(err);
        } else{
    res.render("customer",{all:all});
        }
    });
});


app.get("/customer/:id",function(req,res){

    New.findById(req.params.id,function(err,click){
        if(err){
            console.log(err);
        } else {
    res.render("addcustomer",{passing:click});
        }
   });
});


app.put("/addcustomer/:id",function(req,res){
    New.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updated){
        if(err){
            res.redirect("/customer");
        }  else {
            res.redirect("/customer");
        }
    });

});



app.get("/payment",function(req,res){
      New.find({},function(err,all){
        if(err){
            console.log(err);
        } else{
    res.render("payment",{all:all});
        }
    });
});


app.get("/payment/:id",function(req,res){

    New.findById(req.params.id,function(err,click){
        if(err){
            console.log(err);
        } else {
    res.render("editpayment",{passing:click});
        }
   });
});


app.put("/editpayment/:id",function(req,res){
    New.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updated){
        if(err){
            res.redirect("/payment");
        }  else {
            res.redirect("/payment");
        }
    });

});


app.get("/chat",function(req,res){
    res.render("chat");
});


app.get("/adminregisteration",function(req,res){
    res.render("adminregisteration");
});


app.get("/developerregisteration",function(req,res){
    res.render("developerregisteration");
});


app.get("/account",function(req,res){
    res.render("account");
});

app.post("/form",function(req,res){
  var  projectid  = req.body.projectid,
       projectname = req.body.projectname,
      assignedto = req.body.assignedto,
      date = req.body.date,
      duedate = req.body.duedate,
      amount = req.body.amount,
      advance = req.body.advance,
      balance = req.body.balance,
      description = req.body.description

  var every ={projectid:projectid,projectname:projectname,assignedto:assignedto,date:date,duedate:duedate,amount:amount,advance:advance,balance:balance,description:description}

  New.create(every,function(err,every){
      if(err){
          console.log(err);
      } else {
          console.log(every);
          res.redirect("/dashboard");
      }
  });
});

// // CREATE => add new records to Database
// app.post("/chat",function(req,res){
//
// 	var chat = req.body.chat;
// 	var newchat = {chat: chat}
// 	chat.create(newchat, function(err,newlycreated){
// 		if(err){
// 			console.log("Oops... something went wrong");
// 			console.log(err);
// 		}else{
// 			console.log("Newly created: ")
// 			res.redirect("/chat");
// 		}
// 	});
// });
//
// // INDEX => show all Database
// app.get("/chat",function(req,res){
//
// 	chat.find({}, function(err, chats){
// 		if(err){
// 			console.log("Oops... something went wrong");
// 			console.log(err);
// 		}else{
// 			res.render("chat",{chat:chats, user:req.user});
// 		}
// 	});
// });


//AUTHENTICATION

// FOR ADMIN
app.post("/register",function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var phonenumber = req.body.phonenumber;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;


    //    VALIDATION

    req.checkBody("email", "Invalid Email Address").isEmail();
    req.checkBody("password2", "Password does not match").equals(req.body.password);


    var errors = req.validationErrors();

    if(errors){
      console.log(errors[0].msg);
           res.render("register",{
             error:errors[0].msg
           });
           } else {
        User.register(new User({
            name: name,
            email: email,
            phonenumber: phonenumber,
            username: username}),
            req.body.password,function(err,user){
            passport.authenticate("local")(req,res,function(){
                console.log(user);
                req.flash('success','You are Registered and now can LogIn');
                res.redirect("/login");

            });
        });
}});

app.use(function (req, res, next) {
if (req.method == 'POST' && req.url == '/login') {
    if (req.body.remember_me) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
  } else {
    req.session.cookie.expires = false;
  }
}
next();
});

app.post("/login",passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: 'Incorrect Username or Password!',
    successFlash: 'Successfully LoggedIn '
}),function(req,res){
    res.render('/');
});


app.get("/logout",function(req,res){
    req.logout();
    req.flash('success','You are now LoggedOut')
    res.redirect("/login");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
       return next();
       }else {
           req.flash('error', 'You must signedin first');
           res.redirect("/login");
       }
}


//SERVER

app.listen(port, function(req,res){
    console.log("SERVER STARTS AT PORT 3000");
});
