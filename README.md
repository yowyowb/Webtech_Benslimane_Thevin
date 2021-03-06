
# Chat application - final project

## Introduction 
The project creates a Chat application similar to Discord, WhatApps or Keybase with a minimal set of features. The user can securely create channels, invite friends and post messages in a secure manner. By the end, the user will be able:

To authenticate itself using an external provider with Oauth.
Navigate through his channels and the messages associated with the current channel.
Share the channel access with other users.
Access the channel to which he was invited.
Send new messages.
Remove his messages.
Use the user Gravatar if any or provide a default randomly generated Gravatar.
Modify his settings.
Trust the Chat application because it is secured and the resource access is verified.

## Usage

*how to start and use the application, run the tests, ...*

* Clone the project and install the dependencies with the following commands in your terminal

  ```bash
  git clone https://github.com/yowyowb/Webtech_Benslimane_Thevin
  cd Webtech_Benslimane_Thevin
  ```

* Install [Go](https://golang.org/) and [Dex](https://dexidp.io/docs/getting-started/). For example, on Ubuntu, from your project root directory:   
  ```
  # Install Go
  apt install golang-go
  # Download Dex
  git clone https://github.com/dexidp/dex.git
  # Build Dex
  cd dex
  make
  make examples
  ```
  Note, the provided `.gitignore` file ignore the `dex` folder.
* Make a copy of the Dex configuration to `./dex-config/config-private.yaml`, the project is configured to Git ignore this path:
  ```bash
  cp -rp ./dex-config/config.yaml ./dex-config/config-private.yaml
  ```
* Register your GitHub application, get the clientID and clientSecret from GitHub (GitHub/Setting/Developper Settings/OAuth Apps) and report them to your Dex configuration. Modify the provided `./dex-config/config-private.yaml` configuration to look like:
  ```yaml
  - type: github
    id: github
    name: GitHub
    config:
      clientID: xxxx98f1c26493dbxxxx
      clientSecret: xxxxxxxxx80e139441b637796b128d8xxxxxxxxx
      redirectURI: http://127.0.0.1:5556/dex/callback
  ```
* Inside `./dex-config/config-private.yaml`, the frond-end application is already registered and CORS is activated. Now that Dex is built and configured, your can start the Dex server:
  ```yaml
  cd dex
  bin/dex serve ../dex-config/config-private.yaml
  ```
* Start the back-end
  ```bash
  cd back-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Optional, fill the database with initial data
  bin/init
  # Start the back-end
  bin/start
  ```
* Start the front-end
  ```bash
  cd front-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Start the front-end
  yarn start
  ```
  
* Login thanks to OAuth

* Create a new channel(s)

* Send Messages to this/theses channel(s)

* To see each fonctionnality, you have to connect with an other account

* Invite other people to your channel

* Refresh if you cannot see when another users added you

## Authors

Y. Benslimane <br>
youssef.benslimane@edu.ece.fr   Student at [ECE Paris](https://www.ece.fr)

V. J. Thévin <br>
victor.thevin@edu.ece.fr    Student at [ECE Paris](https://www.ece.fr)

## Tasks

Project management

* Naming convention   

* Project structure   
  *We organize our files by use (eg front-end/src/components/channel/MessageForm.js).*
* Code quality   
  *The code is indent and organized, and we did our be to did it understable.*
* Design, UX   
  *It is very simple to use and to understand. Because it is (or close to be) Christmas, we chose to create a Winter Design, for example Santa will be next to the login link.*
* Git and DevOps   
  *We used Git and its tools to do this project, we used many commits and we used the pull request tool. We try to organize our branches by folder (feature).*

Application development

* Welcome screens   
  *As I said we chose to create a Christmas Design with Christmas spirit, enjoy !*
* New channel creation   
  *Available in the channels list, you can create new channels thanks to a little form, by giving a channel name.*
* Channel membership and access   
  *Every request sent to the API server (back-end) contain the user access token in the HTTP header with its identity (email). Once the token is validated by the authentication middleware, the user ID is associated with the created channel (eg owner property). If the user does not yet exist in the database, he is created automatically.*
* Ressource access control   
  *A user only gain access to the channel he created or to the channels he was invited to. The APIs return the appropriate channels. It also prevent unexpected access and intrusion attempts. The HTTP response return an appropriate HTTP response code and message.*
* Invite users to channels   
  *A channel can have one to n members, the creator being the first member. It is possible to invite new members either after the creation of the channel.*
* Message modification   
  *Unavailable*
* Message removal   
  *Available*
* Account settings   
  *Unavailable*
* Gravatar integration   
  *Available*
* Avatar selection   
  *Unavailable*
* Personal custom avatar   
  *Unavailable*
  
## Bonus 
* *You can still write in Markdown in the messages*
