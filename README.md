# NodeJS
If you have no experience with bots and want to run the bot yourself, you will need to download this software: https://nodejs.org and please download the one that is recommended for most users.

# MongoDB
- To make sure your bot runs with access to a database, you need to create one! Go to https://www.mongodb.com/ and then click "Try Free".
- You need to sign up or login if you already have an account. Once you are logged in, accept the privacy policy and click submit.
- When you get to the form, copy exactly what this says: [image](https://user-images.githubusercontent.com/64603114/159158205-bfbd7cd3-eb46-44f5-a08c-57819042baf0.png)
- Then click finish.
- When you come to the page "Deploy a cloud database" click the button "Create" below the "Shared" option.
- Keep everything as it is and click "Create Cluster".
- On the section "How would you like to authenticate your connection?" you need to input a username and password. Make sure to remember this password as you will need it  later.
- Click "Create User".
- On the section "Where would you like to connect from?" you need to input a certain IP address. Please input: `0.0.0.0/0`and then click "Add Entry".
- Click "Finish and Close" and click "View Database" on the popup.
- Wait for the cluster to provision or if it is available, click "Connect" then click "Connect you application". Keep all options as they are.
- Go into the bot's code and rename the file `.env.example` to `.env`. Update the option in the file called `MONGO_DB_STRING=` and add the connection string from the MongoDB. The connection string should look something like this: `mongodb+srv://test123:<password>@cluster0.rvtdf.mongodb.net/myFirstDatabase>retryWrites=true&w=majority`.
- Update the `<password>` part in the connection string to the password you inputted for the user you created earlier. MAKE SURE TO REMOVE <password>!
- The `.env` file should look like this: 
```
TOKEN=YOUR_DISCORD_BOT_TOKEN
MONGO_DB_STRING=mongodb+srv://test123:yourpassword@cluster0.rvtdf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

# Creating a Discord Bot
- To create the bot, go to https://discord.com/developers and click "New Application".
- Name the application and when you get redirected to the application page, click the section "Bot" on the left. When you are on there, click "Add Bot".
- Click "Reset Token" and then the "Copy" button.
- Go onto your `.env` file and where it says `TOKEN=` put the copied token after it.
- Your `.env` should look like this:
```
TOKEN=OTU1MDU2MDU1MDE1MDU5NDg2.YjcHQw.HxibWDxU1Hc9TIwJpGWqnhCMmoE
MONGO_DB_STRING=mongodb+srv://test123:yourpassword@cluster0.rvtdf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

# Running the bot
**If it is your first time running the bot, please run `install.bat` first before running `run.bat`!**
All you need to do is open the file `run.bat` and it should open a terminal. You should see: `DB | Connected` and `DISCORD | BotName#1111`
If not, you need to look back on the steps and make sure you did everything.
