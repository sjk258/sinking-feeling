# sinking-feeling
Group project primary repository


# Getting Started with Meteor

## Windows
1. Install [meteor](https://install.meteor.com/windows) as admin user.
2. Reboot (for some reason it doesn't get added to the path automatically).
3. From git root, start meteor `meteor`

## Linux (Tested on Ubuntu 14.04/16.04)
1. Run setup
    1. Get setup script `curl https://install.meteor.com/ > meteor_setup.sh`
    2. Make executable `chmod +x meteor_setup.sh`
    3. Run Setup `./meteor_setup.sh`
2. From git root, start meteor `meteor`

## Cloud9
1. Create a [cloud9 account](https://c9.io/signup)
2. Get your cloud9 ssh key and import it into github
    1. Go to Account Settings -> [SSH Keys](https://c9.io/account/ssh)
    2. Copy the stuff in the box (this is your public key, it isn't something you need to keep secret)
    3. Login to github and go to Settings -> [SSH and GPG keys](https://github.com/settings/keys)
    4. Click the "New SSH key" button
    5. Enter a title like "Cloud9" and paste your public key in the box. Click the "Add SSH key" button.
3. Create a new [workspace](https://c9.io/new)
    1. Enter project name ("sinking-feeling"?) and Description
    2. Enter your github fork to clone from (git@github.com:YOUR_USERNAME/sinking-feeling.git)
    3. Select the "Meteor" template
    4. Create Workspace
4. Manually switch to the develop branch `git checkout develop`
5. Start meteor `meteor --port $PORT`

