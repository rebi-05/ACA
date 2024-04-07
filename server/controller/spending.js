const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/spending/getAbl");
const ListAbl = require("../abl/spending/listAbl");
const CreateAbl = require("../abl/spending/createAbl");
const UpdateAbl = require("../abl/spending/updateAbl");
//const DeleteAbl = require("../abl/spending/deleteAbl");

router.get("/get", (req, res) => {
  GetAbl(req, res);
});

router.get("/list", (req, res) => {
  ListAbl(req, res);
});

router.post("/create", (req, res) => {
  CreateAbl(req, res);
});

router.post("/update", (req, res) => {
  UpdateAbl(req, res);
});

//router.post("/delete", (req, res) => {
//  DeleteAbl(req, res);
//});

module.exports = router;