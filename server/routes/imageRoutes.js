const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const imageController = require("../controllers/imageController");



// Upload

router.post(
    "/upload",
    upload.single("image"),
    imageController.uploadImage
);



// Get all photos

router.get(
    "/photos",
    imageController.getImages
);



// Delete photo

router.delete(
    "/photos/:id",
    imageController.deleteImage
);



module.exports = router;