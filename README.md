# sails-passport-example

a [Sails](http://sailsjs.org) application

intially based on [blog post](http://www.ghadeerrahhal.com/sails-application-passportjs/) by Ghadeer Rahhal

```
$ sails --version
0.12.3
$ node --version
v4.2.2
$ sails new sails-passport-example
$ cd sails-passport-example
npm install passport passport-local bcrypt --save
```

in `config/model.js`, set `migrate: 'alter'`
in `config/log.js`, set `level: 'verbose'`

modify `User.js` 

```
bcrypt = require('bcrypt')
module.exports = {

  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    },
  },
  beforeCreate: function(user, cb) {
    sails.log.verbose('beforeCreate', user)
    bcrypt.hash(user.password, 10, function (err, hash) {
      user.password = hash;
      sails.log.verbose('hashed password', user)
      cb();
    });
  }
};

```


Check it out in the console:

```
sails c
> User.create({username:'jan', password:'foo'}, function() { console.log('done') } );
 
```


Add `AuthController` 
Add `isAuthenticated` policy
in `config/http`: add passport initialization
in `config/routes`: add register, login and logout


```
sails lift
```


Test routes with curl:

```
# post form data
curl -X POST http://localhost:1337/register -F username=jane -F password=test
curl -X POST http://localhost:1337/login -F username=jane -F password=test


# post JSON data
curl -X POST "http://localhost:1337/register" -d '{"username":"maria","password":"test"}' -H "Content-Type: application/json"

curl -X POST "http://localhost:1337/login" -d '{"username":"maria","password":"test"}' -H "Content-Type: application/json"
```

