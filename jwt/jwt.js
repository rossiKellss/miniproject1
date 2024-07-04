const jwt = require("jsonwebtoken");
const signToken = (id) => {
  const token = jwt.sign({ id }, "secret");
  return token;
};

const verifyToken=(token)=>{
    const data=jwt.verify(token,"secret");
    return data;
}

module.exports={signToken,verifyToken};
