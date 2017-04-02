const simpleOauth2 = require('simple-oauth2');

if (process.argv.length < 6) {
  console.error('You have to specify the HOSTNAME client_id username and password');
}

const hostname = process.argv[2];
const client_id = process.argv[3];
const username = process.argv[4];
const password = process.argv[5];

const oauth2 = simpleOauth2.create({
  client: {
    id: client_id,
    secret: password,
  },
  auth: {
    tokenHost: hostname
  }
);

oauth2.ownerPassword.getToken({
  username, password
}
.then((result) => {
  const token = oauth2.accessToken.create(result);

  console.log(token);
})
.catch(console.error);
