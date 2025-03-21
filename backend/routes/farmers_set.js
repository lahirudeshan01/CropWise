const express = require("express");

const router = express.Router();

const Farmers = require("../models/farmers");

//test
router.get("/test", (req, res) => res.send("routes working..."));

//post metod
router.post("/", (req, res) => {
  Farmers.create(req.body)
    .then(() => res.json({ msg: "harvest add complete" }))
    .catch(() => res.status(400).json({ msg: "harvest add fail" }));
});

//get metod
router.get("/", (req, res) => {
    Farmers.find()
        .then((Farmers) => res.json(Farmers))
        .catch(() => res.status(404).json({ msg: "No Farmers found" }));
});


//find by id
router.get("/:id", (req, res) => {
    Farmers.findById(req.params.id)
        .then(Farmers => {
            if (!Farmers) {
                return res.status(404).json({ msg: "Farmers not found" });
            }
            res.json(Farmers);
        })
        .catch(() => res.status(400).json({ msg: "Invalid Farmers ID" }));
});

//update using id
router.put("/:id", (req, res) => {
    Farmers.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.json({ msg: "Update successfully" });
        })
        .catch(() => res.status(400).json({ msg: "Update failed" }));
});

//delete
router.delete("/:id", (req, res) => {
    Farmers.findByIdAndDelete(req.params.id)
        .then((Farmers) => {
            if (!Farmers) {
                return res.status(404).json({ msg: "Farmers not found" });
            }
            res.json({ msg: "Farmers deleted successfully" });
        })
        .catch(() => res.status(400).json({ msg: "Delete failed" }));
});


module.exports = router;
