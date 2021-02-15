const axios = require("axios");
const qs = require("qs");

const paypalUrl = process.env.paypalUrl

const getAccessToken = async() => {
  const url = `${paypalUrl}v1/oauth2/token`;
  const oldData = {
    grant_type: "client_credentials"
  };
  const auth = {
    username: process.env.paypalUserName,
    password: process.env.paypalPassword
  };

  const options = {
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Credentials": true
    },
    data: qs.stringify(oldData),
    auth: auth,
    url
  };
  let res

  try{
   res = await axios(options);
  } catch(error){
    console.log(error)
  }

  let access_token
  if (res){
    access_token = res.data.access_token
  }
  return access_token
}

module.exports = {getAccessToken}