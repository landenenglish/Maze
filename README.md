Maze Game Project

Link: https://landenenglish.github.io/Maze/

Description:

This project takes an image of a maze and makes it into an interactive game with the cursor and HTML Canvas data stored in a 2d array of pixels.

User Instructions:

The user follows the directions to first click to mark an entrance on the maze image in green, then an exit in red. Then the user is instructed to draw a path through the maze by clicking and dragging. The user can only begin drawing from the green entrance marker or from a path they've already drawn in blue. The user cannot draw through black pixels, which are walls in the maze.

When the user begins drawing after marking the starting and ending locations, a seconds counter begins. When the user reaches the ending location, counter stops and a completion message is displayed.

Features:

New maze button cycles through 10 maze images

Reset/Clear button resets the game for that image

Save score button is displayed after the user completes the maze. High (low) score is stored in local storage and can be re displayed.

Use Own Image feature

Error message displayed at small screen sizes since this game only works with the cursor

Known Bugs: This may be fixed, but use Own Image sometimes isn't consistent with maintaining its aspect ratio with the uploaded image, and refreshing the page or uploading the image a few times usually fixes it. Use a square image for testing if wide or very large images don't work for now. CSS and scaling isn't yet optimized to handle larger uploaded images, so use medium size images for testing for now. I treated Use Own Image feature as a bonus and implemented it last, so it still has some kinks to be worked out, but the main maze functionality works.

You sometimes have to scribble a bit on the red marker to complete the maze.

Development Process:

I wanted to challenge my problem solving skills with a topic I have no experience with, and I chose my project after taking inspiration from looking at several maze and canvas projects online. I liked some painting app projects with canvas that I came across, and I also liked projects with collision detection with pixel data, which were usually used with an object moved with the keyboard, and I decided to combine both painting and collision detection with the cursor based on pixel data. I chose my approach specifically because it's cooler since it works with any image, and using the mouse to draw a path through it seemed the most intuitive and like drawing a path through a maze paper in real life.

The main problem I ran into was trying to figure out how to properly remove event listeners when I wanted to, and getting my logic to work with uploaded maze images. My solution to allowing my logic to work with any maze image was to force it to pure black and white with a function that loops through and changes every pixel to either black and white if it's above or below the RBG threshold since my logic only works with pure black and white.
