const express = require("express");
const router = express.Router();
const post = require("../models/Post");


router.get("/", async (req, res) => {
    try {
        const data = await post.find();
        res.render("index", { data });
    } catch (error) {
        console.log(error);
    }
});

router.post("/search", async (req, res) => {

    try {
        const data = {
            title: "search",
        };
        let searchTerm = req.body.searchTerm
        const results = await post.find({
            $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { body: { $regex: searchTerm, $options: "i" } }
            ]
        });
        if (results.length > 0) {
            res.render("search", { data, searchTerm, results })
        } else {
            res.render("search", { data, searchTerm, results: [] })
        }
    } catch (error) {
        console.log(error)

    }
});
router.get("/post/:id", async (req, res) => {
    const data = await post.findById(req.params.id);

    res.render("posts", { data });
});

module.exports = router;
