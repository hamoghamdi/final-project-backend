[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# Mad Hat Group Chat 


Fourth and final project in General Assembly's course 'Web Development Immersive'.
This project requirments were building a full stack web application, using React as a front end framework interacting an backend Express.js api along with building the database using MongoDb.

## Web Application Description 

This web application offers the service of live chatting in more than one chat rooms with the other apps users.

[Client-side](https://github.com/hamoghamdi/final-project-frontend)

---
## Prerequisites

npm  
```
$ npm install
```

Run server
```
$npm start
```

---
## Data Modeling

`Users` -|--< `Chatrooms`

<table style="display:inline">
  <th colspan="2" style="text-align:center">Users</th>
  <th colspan="2" style="text-align:center">
  Chatrooms
  </th>
  <tr>
    <td>id</td>
    <td>primary key</td>
    <td>id</td>
    <td>primary key</td>
  </tr>
  <tr>
    <td>email</td>
    <td></td>
    <td>title</td>
    <td>string</td>
  </tr>
    <tr>
    <td>password</td>
    <td>hashed</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>_id</td>
    <td>Foriegn key</td>
    <td>owner</td>
    <td>Foriegn key</td>
  </tr>
  <tr>
    <td>created_at</td>
    <td>datetime</td>
    <td>created_at</td>
    <td>datetime</td>
  </tr>
  <tr>
    <td>updated_at</td>
    <td>datetime</td>
    <td>updated_at</td>
    <td>datetime</td>
  </tr>
</table>


## Technologies
- Express.js
- Node.js
- Socket.io
- Mongoose
- Passport


## Demo
- [Mad Hat Group Chat](https://hamoghamdi.github.io/final-project-frontend/#/)

## Resourses 
- Socket.io
