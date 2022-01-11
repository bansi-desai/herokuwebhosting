const router = require("express").Router();
const { body } = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");

const {
    launchPage,   
    emp_addPage,  
    save,
    emp_updatePage,
    update,
    deleteemp,   
    register,
    registerPage,
    login,
    loginPage,
    aboutusPage,
    contactusPage,
    contact,
} = require("./controllers/userController");

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.userID){
        return res.redirect('/login');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.userID){
        return res.redirect('/');
    }
    next();
}
router.get('/', ifNotLoggedin, launchPage);
router.get("/add",emp_addPage);
router.get("/update/:id",emp_updatePage);
router.post("/save",
[
    body("email", "Invalid Email Address")
        .notEmpty()
        .escape()
        .trim()
        .isEmail(),
    body("salary", 'Please Enter Salary In Numbers')  
    .isNumeric()
    .escape()
    .trim(),
    body("phone", 'Enter Valid Phone Number')
    .isMobilePhone()
    .escape()
    .trim()
    .isLength({ min: 10 }),
    body("name", 'Only Characters Allow In Name')
    .isString()
    .escape()
    .trim(),
    body("position", 'Only Characters Allow In position')
    .isString()
    .escape()
    .trim(),
],
save
);
router.post("/update",
[
    body("email", "Invalid email address")
        .notEmpty()
        .escape()
        .trim()
        .isEmail(),
    body("salary", 'Numbers Only')  
    .isNumeric()
    .escape()
    .trim(),
    body("phone", 'Enter valid Phone Number')
    .isMobilePhone()
    .escape()
    .trim()
    .isLength({ min: 10 }),
    body("name", 'Only Characters Allow In Name')
    .isString()
    .escape()
    .trim(),
    body("position", 'Only Characters Allow In position')
    .isString()
    .escape()
    .trim(),
],
update
);

router.get("/deleteemp/:id",deleteemp);
router.get('/aboutus', aboutusPage);
router.get('/contactus', contactusPage);
router.post('/contact',
[
    body("name", "The name must be of minimum 3 characters length")
        .notEmpty()
        .isString()
        .escape()
        .trim()
        .isLength({ min: 3 }),
    body("email", "Invalid email address")
        .notEmpty()
        .escape()
        .trim()
        .isEmail(),    
],
 contact);
router.get("/login", ifLoggedin, loginPage);
router.post("/login",
ifLoggedin,
    [
        body("_email", "Invalid email address")
            .notEmpty()
            .escape()
            .trim()
            .isEmail(),
        body("_password", "The Password must be of minimum 4 characters length")
            .notEmpty()
            .trim()
            .isLength({ min: 4 }),
    ],
    login
);

router.get("/signup", ifLoggedin, registerPage);
router.post(
    "/signup",
    ifLoggedin,
    [
        body("_name", "The name must be of minimum 3 characters length")
            .notEmpty()
            .escape()
            .trim()
            .isLength({ min: 3 }),
        body("_email", "Invalid email address")
            .notEmpty()
            .escape()
            .trim()
            .isEmail(),
        body("_password", "The Password must be of minimum 4 characters length")
            .notEmpty()
            .trim()
            .isLength({ min: 4 }),
    ],
    register
);

router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        next(err);
    });
    res.redirect('/login');
});

module.exports = router;