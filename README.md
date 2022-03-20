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
