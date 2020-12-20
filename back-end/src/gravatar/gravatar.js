const avatar = require('gravatar');

let user = {
  email: 'youssef.benslimane17@gmail.com'

};

let avatarURL = avatar.url(user.email ,  {
  s: 300,
  r: 'pg',
  d: '404'
});

let updatedUser = {
  ...user,
  avatar: avatarURL
};
console.log(updatedUser);
