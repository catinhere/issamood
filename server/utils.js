export function isAuthenticated(req, res, next) {
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    if (req.user.authenticated)
        return next();
  
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
  }