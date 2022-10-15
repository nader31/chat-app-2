# Chat Application

Welcome to my chat application

- To __install__ the project, clone the git repository to your local machine

- To __run__ the backend, open the integrated terminal of the backend folder, then run the following command : `npm start`

- To __run__ the frontend, open the integrated terminal of the frontend folder, then run the following command : `ng start`

# GIT

The git repository holds the __chat-app-2__ folder which contains the backend and the frontend.
For each big feature, a different branch was created when implementing them:

- __user authentication__
- __socket.io__
- __image-handling__
- __testing__

Every time I got a small feature working, I would commit my work with a message explaining the changes I made. This helped keeping track of the progress and saving/secure the project along the way.
When a big feature was complete, I would push my code and make a pull request to merge the branch with the __main branch__, allowing to have a main branch updated, but only when everything is working correctly.

# Data Structures

Group Schema |
------------ |
name (String) |
users (userSchema) |
rooms (roomSchema) |

User Schema (for Groups) |
------------ |
userId (ObjectId ref User) |
role (String) |

Room Schema (Channels) |
------------ |
name (String) |

Message Schema |
------------ |
text (String) |
date (Date) |
creator (ObjectId ref User) |
creator (ObjectId ref User) |
group (String) |
image (String) |

User Schema |
------------ |
name (String) |
email (String) |
password (String) |
role (String) |
image (String)