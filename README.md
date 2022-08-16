# Sign Up & Log In app - React, NodeJS and SQL Server

I wanted to know the basic use of Authorization process for users to future projects. Also, I wanted to use MongoDB but I'd never used SQL Server with NodeJS (Only SQL Server alone) so, In this time I used a relational Database. 

__If it works for you, give me a star! ⭐__

## SQL User Table Model

```
id: <String>

username: <String>

password: <String - VARCHAR(60)>
```

## .env file variables
All String variables goes without "" or ''.
```
DB_USER=<string>
DB_PASSWORD=<string>
DB_NAME=<string>
DB_USERNAME_TABLE=<string>
DB_SERVER=localhost

JWT_SECRET=<string > 30 chars without spaces>
JWT_EXPIRES_IN=<string> --> ex(Only one of this): 1d, 2d, 3d, ... , 90d (See jsonwebtoken documentation for more info)
JWT_COOKIE_EXPIRES_IN=<number> (See express-cookies for more info)
```

## Technologies used

- React
- SQL Server w/mssql package
- NodeJS
- ExpressJS
- dotenv
- bcryptjs
- jsonwebtoken
- nanoid(For the ID)

## Notes

- To the table where we save the users, We will need for a real application another column to know when the user changed his/her password to prevent that if a user changes his/her password, the previous token generated with the old password will not be valid anymore.

- We can grab the "async" functions in another function to omit the "try-catch" blocks. By doing this, we can "ignore" these blocks. I didn't implement it for a simple app example.

- A Global Error Handler wasn't implemented for the simplicity of the app but, If you do it, your code will be simpler.

- For the ID I used an npm package(nanoid) but the server itself must provide a unique ID to be **sure** that a new user will not have a duplicate ID.
