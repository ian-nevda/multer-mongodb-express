//prerequisite: create a /uploads directory inside your /public

//add these dependancies

var multer = require("multer"),
    path = require("path"),
    fs = require("fs");

//define image sore location and image name scheme

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({
    storage: storage
});

//make sure images are defines as an array of strings in your Mongoose Schema
var portfolioSchema = new mongoose.Schema({
    title: String,
    image: [String],
});

//post route (allowing up to 12 image uploads at a time, feel free to change this as you see fit)
app.post("/portfolio/new", upload.array('image', 12), function(req, res) {

    //req.file returns an object, here we are creating a variable extracting only the paths to the files.
    //we are also removing public/ from the path as we previously defined /public to be out static directory. When pushing images to your HTML, public/ is added by the static route automatically so we wan't to avoid duplication.
    var images = req.files.map(a => a.path.replace('public/', '/'));

    //getting the result together
    var project = { title: req.body.title, image: images }

    Portfolio.create(project, function(err, newProject) {
        if (err) {
            console.log(err);
        }
        res.redirect("/portfolio");


    });

});