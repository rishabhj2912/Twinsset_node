const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Template = require("../../models/Template");
//@route   post /template
//@desc    create a template
//@access  Private
router.post('/',[auth,[
    check('template_name','Template name is required').not().isEmpty(),

    ]
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {template_name,subject,body} = req.body;
    try{
        const newTemplate = new Template({
            template_name,
            subject,
            body,
            user:req.user.id
        });
        const template = await newTemplate.save();
        res.json(template);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
);

// //@route   GET api/template
// //@desc    get all templates
// //@access  Private
// router.get("/all",auth, async (req, res)=>{
//     try {
//         const templates = await Template.find().sort({date: -1});
//         res.json(templates);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send("Internal server Error!");
//     }
// });

//@route   GET api/template
//@desc    get all templates of a user
//@access  Private

router.get("/",auth, async (req, res)=>{
    try {
        const templates = await Template.find({user:req.user.id}).sort({date: -1});
        res.json(templates);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server Error!");
    }
}
);

//@route   GET api/template/:id
//@desc    get template by id
//@access  Private
router.get("/:id",auth, async (req, res)=>{
    try {
        const template = await Template.findById(req.params.id);
        if(!template)
        {
            return res.status(404).json({msg:"Template not found"})
        }
        res.json(template);
    } catch (err) {
        console.log(err.message);
        if(err.kind=="ObjectId")
        {
            return res.status(404).json({msg:"Template not found"})
        }
        res.status(500).send("Internal server Error!");
    }
});

//@route   Delete api/template/:id
//@desc    delete template by id
//@access  Private
router.delete("/:id",auth, async (req, res)=>{
    try {
        const template = await Template.findById(req.params.id);
        // Check User
        if(!template)
        {
            return res.status(404).json({msg:"Template not found"})
        }
        if(template.user.toString()!== req.user.id){
            return res.status(401).json({msg:"User not authorized"});
        }
        await template.remove()
        res.json({msg:"Template removed!"})
    } catch (err) {
        console.log(err.message);
        if(err.kind=="ObjectId")
        {
            return res.status(404).json({msg:"Template not found"})
        }
        res.status(500).send("Internal server Error!");
    }
});

//@route   PUT api/template/update/:id
//@desc    update a template
//@access  Private
router.put("/:id", auth, async (req,res)=>{
    try {
        const template = await Template.findById(req.params.id);
        // Check User
        if(!template)
        {
            return res.status(404).json({msg:"Template not found"})
        }
        if(template.user.toString()!== req.user.id){
            return res.status(401).json({msg:"User not authorized"});
        }
        template.template_name=req.body.template_name;
        template.subject=req.body.subject;
        template.body=req.body.body;
        await template.save();
        res.json(template);
    }
    catch (err) {
        console.log(err.message);
        if(err.kind=="ObjectId")
        {
            return res.status(404).json({msg:"Template not found"})
        }
        res.status(500).send("Internal server Error!");
    }

});


module.exports = router;