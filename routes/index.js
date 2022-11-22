const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.oidc.isAuthenticated());
  res.render("index", { header: "Auth0 test"  , isAuthenticated :req.oidc.isAuthenticated()  , user : req.oidc.user});
});



module.exports = router;
