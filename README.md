# ProMan (sprint 1)

## Story

### An email from the client

```
From: Mark Big <ceo@thepartner.com>

Subject: Welcome on board for the ProMan project!

In these days everyone wants to create a new project management tool,
and we're no exception either. We'd like to implement
something similar to Trello, so we can say we have our own tool!

We call it: ProMan

Jacob, our senior full-stack developer already started to work on the project.
He made sure to have a proper backlog, and he started to work on the wireframe
of the application.

Unfortunately Jacob was late one day, he arrived to work at 9:02,
so we had to fire him. Job starts at 9am, he had to learn it.

Now it's your job to finish the project!
Send us the sprint backlog ASAP, and we'll meet at the demo!

Remember, we need completed user stories and quality work!

Mark
```

Oh well, another nice client.

From the attachments you see that they imagine the app as a "one pager" where all
the boards are displayed, and when one is opened then the corresponding cards are shown.
Their [screen plan](media/web-python/proman-screen-plan.png)
is not too sophisticated but seems to be a good staring point.

Of course, the customer would love to have an application which is easy to use at first
glance, functionality is straightforward and looks nice on different screen sizes if possible.
As this is [usually](media/web-python/specification-vs-reality.png) the case.
Let's get this job done.

## What are you going to learn?

- create an advanced Flask project
- practical usage of AJAX
- mastering web development
- planning the development of an advanced product

## Tasks

1. Create an overview page listing the existing boards
    - Given the application server is started, the root url (`/`) shows the list of the already created boards

2. Allow the user to add new boards with public access
    - There is a "Create new board" button after opening the root url (`/`)
    - After clicking the "Create new board" button, the user can give the new board's title in an editable field
    - There's a "Save" button that saves the new board along with its title (it displays on the board's page and the board list)

3. Allow the user to change the title of any board
    - When the user clicks on the board's title, it changes into an input box where the user can input the new title
    - There's a "Save" button that saves the board's new title (displayed on the board's page and the board list page)

4. There are 4 default columns visible after opening the board
    - There are 4 columns (_New_, _In Progress_, _Testing_, _Done_) columns that indicate the statuses of cards
    - The board's title is visible on the top of the page
    - The board closes after clicking on its title
        

5. Allow the user to add any number of columns to the board that can be used as statuses for the cards
    - There is a "Add new column" button after opening a board
    - A new column is added to the board after pressing the "Add new column" button with the title given by the user. The column can be used as a status for the cards
    - The board's title is visible on the top of the page
    - The Board closes after clicking on its title

6. Allow the user to change the title of any column
    - When the user clicks on a columns's title, it changes into an input box where the user can input a new title
    - The column's new title gets saved by pressing Enter
    - The column's original title shows up unchanged after the user clicked out of the input box or pressed Escape

7. Allow the user to add a new card to a board
    - There is a "Create new card" button after opening a board
    - A new card is added to the first column of the board after pressing the "Create new card" with the title given by the user

8. Allow the user to set priorities to the cards
    - Allow the user to drag the cards above or below each other and ensure that the card stays in the new position (its order is updated)

9. Allow the user to change the status of a card (move the card between columns)
    - Allow the user to drag the cards from one column to another and ensure that the card stays in the new position (its status is updated)

10. Allow the user to edit the card's title
    - When the user clicks on the card's title, it changes into an input box where the user can input a new title
    - The card's new title gets saved by pressing Enter
    - The card's original title shows up unchanged after the user clicked out of the input box or pressed Escape

11. Allow the user to access the boards and cards offline like a proper PWA (progressive web app)
    - Allow the user to save the web page as a mobile application, when opened the root url (`/`) from a mobile device, that can be later opened offline

12. Allow the user to register a new account
    - There's a register link on the page after opening the root url (`/`) that leads to the registration page
    - There is a registration form where the user can input a chosen username and password
    - There is a submit button in the registration form. By clicking it, the user's credentials get stored and the user can log in with them later

13. Allow the user to log into the application with his/her username and password
    - There is a "Login" button in the main page's header if the user is not logged in
    - After clicking the "Login" button there is a login page where the user can input his/her username and password
    - After logging in, the user can see the list of the public and private boards

14. Allow the logged-in user to crate private boards that are only visible to him/her
    - There is a "Create new private board" button when the user is logged in
    - After clicking the "Create" button, allow the user to input the new private board's title in an editable field
    - There's a "Save" button that saves the new private board along with its title
    - Ensure that the private board is visible only when the user who created it is logged in

15. Allow the user to logout from the application
    - There is a logout link when the user is logged in
    - After clicking the logout link the user gets logged out and is able to see the public boards only

16. Allow the user to delete existing public boards
    - There is a delete icon associated with every public board
    - After clicking a delete icon, the associated board gets deleted along with its cards

17. Allow the user to delete existing private boards that are associated to his/her account (only when the user is logged in)
    - There is a delete icon associated with every private board that belongs to the logged-in user
    - After clicking a delete icon, the associated Board gets deleted along with its cards

18. Allow the user to delete cards from boards
    - There is a delete icon associated with every card
    - After clicking a delete icon, the associated card gets deleted from the board

19. Allow the user to delete columns from boards
    - There is a delete icon associated with every column
    - After clicking a delete icon, the associated column gets deleted from the board along with its cards

20. Allow the user to archive and restore cards
    - There is an archive icon associated with every card
    - After clicking the archive icon, the associated card gets archived (it disappears from the board)
    - There is an "Archived Cards" button on the board (if it has any archived cards)
    - After clicking the "Archived Cards" button, a list of all archived cards associated with the board appears
    - There is an "Unarchive" icon associated with every archived card in the list
    - The card gets unarchived (it returns to its original status on its associated board) after pressing the "Unarchive" icon

21. Allow the user to see changes made by other users after refreshing the page
    - There is a "Refresh" button on the page
    - After pressing the "Refresh" button, all boards and cards get refreshed, so changes made by other users can be seen

22. Allow the user to collaborate with other users in real-time
    - Whenever any user makes a change to any board or its cards, ensure that other users with access to it get the refresh automatically, so they can immediately see the changes

## General requirements

None

## Hints

None

## Background materials

- <i class="far fa-exclamation"></i> [Callbacks](project/curriculum/materials/pages/javascript/javascript-callbacks.md)
- <i class="far fa-exclamation"></i> [API, AJAX](project/curriculum/materials/pages/web/the-last-missing-piece-api.md)
- <i class="far fa-exclamation"></i> [RESTful](project/curriculum/materials/pages/web/restful.md)
- [Pass by value vs by reference](project/curriculum/materials/pages/javascript/javascript-pass-by-value-vs-reference.md)
- [Modules](project/curriculum/materials/pages/javascript/javascript-modules.md)
- [Keyword this](project/curriculum/materials/pages/javascript/javascript-this.md)
- [Tips & Tricks](project/curriculum/materials/pages/web/web-with-python-tips.md)
