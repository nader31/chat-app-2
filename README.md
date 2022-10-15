# Chat Application

Welcome to my chat application

- To __install__ the project, clone the git repository to your local machine

- To __run__ the backend, open the integrated terminal of the backend folder, then run the following command : `npm start`

- To __run__ the frontend, open the integrated terminal of the frontend folder, then run the following command : `ng start`

## GIT

The git repository holds the __chat-app-2__ folder which contains the backend and the frontend.
For each big feature, a different branch was created when implementing them:

- __user authentication__
- __socket.io__
- __image-handling__
- __testing__

Every time I got a small feature working, I would commit my work with a message explaining the changes I made. This helped keeping track of the progress and saving/secure the project along the way.
When a big feature was complete, I would push my code and make a pull request to merge the branch with the __main branch__, allowing to have a main branch updated, but only when everything is working correctly.

## Data Structures

Group Schema | User Schema (for Groups) | Room Schema (Channels) |
------------ | ------------ | ------------ |
name (String) | userId (ObjectId ref User) | name (String) |
users (userSchema) | userId (ObjectId ref User) |
rooms (roomSchema) | role (String) |

Message Schema | User Schema |
------------ | ------------ |
text (String) | name (String) |
date (Date) | email (String) |
creator (ObjectId ref User) | password (String) |
creator (ObjectId ref User) | role (String) |
group (String) | image (String) |
image (String) |

## Client - Server
The __server__ handles the REST API, user authentication, sockets on the server side, and the MongoDB connection.
The REST API allows the server to make calls to the the MongoDB database with requests which are in the form of urls. Depending on the path, they will return different JSON objects accordingly.
For user authentication, the server will receive the data sent by the client and return a JWT which will allow the client to stay authenticated for a specific period of time.
Sockets are also handled by the server which will receive and emit socket calls to the client, and respond accordingly.

The __client__ manages all the frontend tasks, whether it is making requests to the Node js server and displaying the reponse to the user. It will also send the user input to the server, as well as handling sockets on the client side, allowing the reception and emission of sockets.

3 main __routes__ are provided:
- __/api/user__
- __/api/group__
- __/api/chat__

### __User routes:__

Method | Route | Description |
---- | -------- | ---------------- |
GET | /api/user/ | Get all users |
POST | /api/user/signup | Creates a user |
POST | /api/user/login | Send login info and returns back a JWT token |
GET | /api/user/:id | Get user’s info by Id |
GET | /api/user/:id/role | Get user's role by id |
GET | /api/user/:username/username | Get user's info by username |
PUT | /api/user/:id | Update user’s info |

### __User routes:__

Method | Route | Description |
---- | -------- | ---------------- |
GET | /api/group/ | Get all groups |
POST | /api/group/ | Creates a group |
GET | /api/group/:id | Get group info by id |
GET | /api/group/user/:id | Get all groups which a user is a part of |
GET | /api/group/user/:id/user/:userId | Get user group info from a specific group (role in the group) |
PUT | /api/group/ | Update group’s info |

__Chat route:__
The chat only allows requests from api/chat. This path will allow emission and reception of sockets between the server and the client through all the different rooms (channels).

## Angular architecture

The Angular app is divided into 3 main sections: __components__, __models__, and __services__.

The components are reponsible of displaying the app sections to the user. With the Angular Routing Module, we can create routes which will display those components according to the url.

The models holds the types information of the main data structures, they help keeping track of the types of each variable.

Services handles the main logic of the app and will send these functions to the components which will use them to work correctly. They are also responsible of all the REST API calls, by doing the http requests. These requests are then used by the components with calls to the service functions.

## Client - server interaction

All the requests sent to the servers are sent from the client, in the angular services. These requests will be stored in observables which will keep track of any changes being made when we subscribe to them in a component. Once a change is made on the server api, the server will notify the client which will notify the component and make the change. This allows constant reactive changes throughout the app,  so we are able to have instant feedback when we send messages or do any kind of interaction.
