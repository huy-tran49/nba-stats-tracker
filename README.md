# Description
NBA stats tracker is a simple app that will let you track all your favorite players and team stats. No need to search the stats for each individual players. Just login and add your favorite players to the tracker to see their stats.

# User Story
As a user you will be able to:
- Create account
- Login/Logout
- Search for a player
- Search for a team
- Add a player to begin tracking their stats
- Add a team to begin tracking their stats
- Remove a player from the tracker
- Remove a team from the tracker

# Routes
## User
| URL | HTTP | Action | Description
| ----------- | ----------- | ----------- | ----------- |
| /users/signup | Post | Create | Create user
| /users/login | Post | Show | User log in
| /users/logout | Delete | Destroy | User log out

## Tracker
| URL | HTTP | Action | Description
| ----------- | ----------- | ----------- | ----------- |
| /tracker | Get | Index | Tracker main page after logged in
| /tracker/remove/:playerID | Delete | Destroy | remove player from tracker 
| /tracker/remove/:teamID | Delete | Destroy | remove team from tracker
| /tracker/search | Post | New | show search form
| /tracker/:playerID | Get | Show | show a player by ID
| /tracker/:teamID | Get | Show | show a team by ID

# Wire Frame

![home](https://user-images.githubusercontent.com/23158353/213958810-35978d65-696f-4c0d-a536-847b78e8c11d.PNG)
![signup-login](https://user-images.githubusercontent.com/23158353/213958853-16b9d5e3-0f64-4e43-9543-e1663091ad1c.PNG)
![tracker](https://user-images.githubusercontent.com/23158353/213958893-03e8e414-9790-4969-999a-5bc49e850897.PNG)
![search](https://user-images.githubusercontent.com/23158353/213958900-b9409707-d081-4583-bb62-5755c4e6f78e.PNG)
![find](https://user-images.githubusercontent.com/23158353/213958906-8343cbfd-268a-45e6-a26a-260c1b0aac47.PNG)

# ERD

![ERD](https://user-images.githubusercontent.com/23158353/213958911-16eb891d-c480-4b79-8dca-2fce159941c3.PNG)
