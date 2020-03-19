const express = require("express");
const router = express.Router();
const Bill = require('../../models/Bill');
const passport = require("passport");

const validateBillInput = require('../../validation/bill')

router.get("/test", (req, res) => res.json({ msg: "This is the bills route" }));

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateBillInput(req.body);

    console.log(errors);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newBill = new Bill({
      title: req.body.title,
      amount: req.body.amount,
      title: req.body.title,
      user: req.user.id,
      household: req.user.household
    });
    newBill
      .save()
      .then(bill => res.json(bill))
      .catch(err => console.log(err));
  }
);


router.get('/', (req, res) => {
  Bill.find()
    .then(bills => res.json(bills))
    .catch(err => 
      res.status(404)
        .json({ nobillsfound: "No bills found" }));

}
)


module.exports = router;