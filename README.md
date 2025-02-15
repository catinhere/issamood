# issamood ☺️

issamood is a web application where users can find photos that match their mood, upload their own images, and create boards with their favourite images.

![issamood gif](./issamood-gif.gif)

[https://issamood.vercel.app/](https://issamood.vercel.app/)

## Running locally

- Make sure you have node and npm installed
- `git clone` this repository
- `cd` into this directory on your computer
- Inside `server`, set `ATLAS_URI` and `FE_URI` in your environment variables
- Inside `client`, set `REACT_APP_SERVER_URI` and `REACT_APP_CLOUD_NAME` in your environment variables
- Run `npm install` in both the `client` and `server` folder
- Run `node index.js` or `nodemon` in the `server/api` folder and the server will be running at `localhost:5000` (or whatever `PORT` is in your environment variables)
- Run `npm start` in the `client` folder and the web application will be running at `localhost:3000`

## Deployment

- Project was previously deployed to Heroku but they got rid of free tier so it is deployed on Vercel now
- `server/index.js` was moved to `server/api/index.js`
- You should update the header value for `Access-Control-Allow-Origin` inside `vercel.json`
- Create separate projects for the server and the client in Vercel
- Make sure you set the environment variables in Vercel

## About

A full-stack web application where users can find photos that match their mood. This app is kind of a hybrid of Instagram and Pinterest.

### Technologies Used

- React.js
- React Router
- Node.js
- Express
- Mongoose
- MongoDB
- Passport.js
- BCrypt

## Features

- User creation
- Authentication and authorization
- Post creation
- Search posts by mood and tag
- Load more posts on scroll
- Like posts, comment on posts, and view likes
- Create boards and add posts to board
- Upload new profile picture
- Sort all posts by most recent and most popular
- Follow users and boards
- Users have their personalized 'following feed' that shows posts from users and boards they follow
