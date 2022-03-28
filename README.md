# Scrabble Web App

## About
This is a web app version of the popular board game Scrabble created in the context of an academic project. The application is made with Angular and written in Typescript. It implements Socket.io for client-server communication. 
The current version allows only a single player mode. It is made for a local environnement (see Client and Server sections) and has no data persistance. 

## How To Use
Before running the application, run the `npm ci` script in the client and server folders to install necessary dependencies.

To run the client, run the `npm start` script in the terminal in the *client* folder. The client will run on **http://localhost:4200/**

To run the server, run the `npm run dev` script in the terminal in the *server* folder. The server will run on port 3000 by default.

## Gameplay
To start a single player game, click on *Scrabble classique*, then *Jouer une partie solo*. Enter a username in *Nom d'utilisateur* and choose the length of each turn in *délai dans le jeu*. The version currently only has a beginner level, so choose *Débutant*. Click on *Initialiser La Partie* when you are ready to start the game.

Each turn, the player can either place letters to form a word, exchange letters or pass the turn.
- Placing letters: The first word has to touch the H8 tile.
    - Method 1: Click on the tile where you want to place the first letter. An arrow appears showing the direction of your placement. Click again to change direction if needed. Press the letters on the keyboard to place the letters in the right sequence.
    - Method 2: In the textbox, type !placer YXD ..., where Y is the Y coordinate (from A to O), X is the X coordinate (from 1 to 15), D is the direction (v for vertical or h for horizontal) followed by the letters. Example: *!placer h8h test* will place the letters *t* on H8, *e* on H9, *s* on H10 and *t* on H11.
- Exchanging letters: 
    - Method 1: Right click on the letters you would like to exchange. Selected letters for an exchange are highlighted in blue. Press the *Echanger* button that appears to confirm the exchange, or press *Annuler* to cancel the exchange. 
    - Method 2: In the textbox, type !echanger ..., where ... are the letters you would like to exchange. Example: !echanger abc will exchange the letters a, b, and c.
- Passing turn:
    - Method 1: Press the *Passer tour* button.
    - Method 2: In the textbox, type !passer.

Players may also ask for a hint by typing !indice in the textbox. 

The game ends when neither player has any letters left AND the reserve is empty, OR when players pass 6 turns in a row (each player passes 3 turns in a row).

## Client
The client side of the app is written with Angular in Typescript. Navigation between pages in done using the Angular Router. Game parameters (username, length of each turn) are set in an Angular Form using Validators. The game board itself is created with Canvas API.

## Server
The server is an Express server. It implements Socket.io to handle client requests. It will also allow real-time chatting between clients of a same game it an upcoming version.

