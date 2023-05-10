const jwt = require("jsonwebtoken");
const config = require("config");

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  // const token = ""
  console.log(req.body)
  console.log("Token " , token)

  if (!token) {
    return res.status(400).json({ msg: "Token not present" });
  }
  try {
    jwt.verify(token, config.get("SECRET"), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = auth;
