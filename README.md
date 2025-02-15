# issamood ☺️
issamood is a web application where users can find photos that match their mood, upload their own images, and create boards with their favourite images.

![issamood gif](./issamood-gif.gif)

[https://issamood.herokuapp.com/](https://issamood.herokuapp.com/)

## Running locally
* Make sure you have node and npm installed
* `git clone` this repository
* `cd` into this directory on your computer
* Set `ATLAS_URI` in your environment variables
* Set your cloud name in `constants.js`
* Run `npm install` in both the `client` and `server` folder
* Run `node index.js` or `nodemon` in the `server` folder and the server will be running at `localhost:5000`
* Run `npm start` in the `client` folder and the web application will be running at `localhost:3000`

## About
A full-stack web application where users can find photos that match their mood. This app is kind of a hybrid of Instagram and Pinterest.

### Technologies Used
* React.js
* React Router
* Node.js
* Express
* Mongoose
* MongoDB
* Passport.js
* BCrypt

## Features
* User creation
* Authentication and authorization
* Post creation
* Search posts by mood and tag
* Load more posts on scroll
* Like posts, comment on posts, and view likes
* Create boards and add posts to board
* Upload new profile picture
* Sort all posts by most recent and most popular
* Follow users and boards
* Users have their personalized 'following feed' that shows posts from users and boards they follow