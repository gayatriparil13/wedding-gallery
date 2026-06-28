const fs = require("fs");
const { 
    PutObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const s3 = require("../config/s3");
const Photo = require("../models/Photo");


// Upload Image

exports.uploadImage = async (req, res) => {

    try {

        const fileContent = fs.readFileSync(req.file.path);

      const params = {

    Bucket: process.env.AWS_BUCKET_NAME,

    Key: Date.now() + "-" + req.file.originalname,

    Body: fileContent,

    ContentType: req.file.mimetype

};

        await s3.send(
            new PutObjectCommand(params)
        );


        fs.unlinkSync(req.file.path);


        const imageUrl =
        `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;


        // Save in MongoDB

        await Photo.create({

            filename: params.Key,
            url: imageUrl

        });


        res.status(201).json({

            message:"Image uploaded successfully",
            imageUrl:imageUrl

        });


    } catch(error){

        res.status(500).json({

            message:"Upload failed",
            error:error.message

        });

    }

};





// Get All Images

exports.getImages = async(req,res)=>{


    try{

        const photos = await Photo.find()
        .sort({createdAt:-1});


        res.json(photos);


    }catch(error){

        res.status(500).json({

            message:"Failed to fetch images",
            error:error.message

        });

    }

};






// Delete Image

exports.deleteImage = async(req,res)=>{


    try{


        const photo = await Photo.findById(req.params.id);


        if(!photo){

            return res.status(404).json({
                message:"Image not found"
            });

        }



        await s3.send(

            new DeleteObjectCommand({

                Bucket:process.env.AWS_BUCKET_NAME,

                Key:photo.filename

            })

        );



        await Photo.findByIdAndDelete(req.params.id);



        res.json({

            message:"Image deleted successfully"

        });



    }catch(error){


        res.status(500).json({

            message:"Delete failed",
            error:error.message

        });

    }

};