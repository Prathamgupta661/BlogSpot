const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const Blog = require("../models/blog");
const comment = require("../models/comments");
const router = Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


router.get("/", (req, res) => {
  res.render("addblog", { user: req.user });
});

router.get("/:id", async (req, res) => {
  const dbblog = await Blog.findById(req.params.id).populate("CreatedBy");
  const comments = await comment
    .find({ blogid: req.params.id })
    .populate("createdby");
  res.render("blog", { user: req.user, blog: dbblog, comment: comments });
});

const storage = multer.diskStorage({
  // destination: function(req,file,cb){
  //     cb(null,path.resolve("./public/uploads"))
  // },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, body } = req.body;
    const file = req.file.path;
    const cloudinaryresponse = await cloudinary.uploader.upload(
      file,
      {
        folder: "Blogspot",
      }
    );
    const blog = await Blog.create({
      title,
      body,
      ImagePathUrl: cloudinaryresponse.secure_url,
      cloudinaryPublicId: cloudinaryresponse.public_id,
      CreatedBy: req.user._id,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.log(error);
    res.redirect("/blog");
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    const blogdata=await Blog.findByIdAndDelete(req.params.id);
    const result=await cloudinary.uploader.destroy(blogdata.cloudinaryPublicId,{invalidate:true});
    console.log(result);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
  
});

router.post("/comment/:id", async (req, res) => {
  const content = req.body.content;

  await comment.create({
    comment: content,
    createdby: req.user._id,
    blogid: req.params.id,
  });
  res.redirect(`/blog/${req.params.id}`);
});

module.exports = router;
