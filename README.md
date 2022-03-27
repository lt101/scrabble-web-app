# Scrabble Web App

## About
This is a basic chat application using React and Socket.io. Users log in with a username and join a room. Users of a same room see the other participants can send each other messages.

The application is made for a local environnement (see Client and Server sections) and has no data persistance. 

## How To Use
Before running the application, run the `npm ci` script in the client and server folders to install necessary dependencies.

To run the client, run the `npm start` script in the terminal in the project directory. The client will run on **http://localhost:4200/**

To run the server, run the `npm run dev` script in the terminal in the 
*server* folder. The server will run on port 3000 by default.

## Gameplay


## Client
The frontend is written in Javascript using the React framework. It makes use of a few React hooks, such as useState, useEffect, useContext, useRef and useCallback. The client implements socket.io-client to interact with the server, which is what allows them to communicate with other clients.
Styling is done with react-bootstrap.

## Server
The server is an Express server that implements Socket.io. It listens to client connections and manages client-side emitted events. It also keeps a temporary list of all connected users (their associated socket id, username, and room) which only lasts for the duration of the server activation.
