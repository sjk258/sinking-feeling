
Note this project is for team members of the Penn State Software Enginnering 500, Summer 2016, Team 5 group. If you are not one of those team members, any pull requests, bug reports, etc will be rejected until the end of August, 2016. 

# Repositories

There are going to be several levels of source control in use. 

Starting at the top will be the main repository's "release" branch. This is the code that will run on the production web server. Assuming we can get everything working correctly, when we merge to this branch, it will automatically go to the web server and become live.

The next level down will be the main repository's "develop" branch. This should be similar to master, except instead of automatically going to the production server, it will go to the development server. Anything that goes into the release branch must go through here first as the only way to merge to the release branch is to merge from develop. The way to get changes into the develop branch is to submit a pull request and have the maintainer accept that request.

The last level is each user's individual repository. This is where we write our code and put in fixes and it must be a fork of the main repository. The recommended method of operation is to never make commits to the release or develop branches, instead for each item that you write, create a branch off of an up-to-date copy of the develop branch (see below for how to keep your copy of develop up to date) make your change there and submit a pull request from that branch to the master repository's develop branch.

To keep your copy of release and develop up to date, each user should add a second remote to the repository on their computer. By default, when you clone, the place you cloned from is added as a remote called 'origin'. You can add another remote (call it something like 'group') and make your release and develop branches track that instead of your forked repository.

## Command Line Instructions
From the local repository you created off of your fork... i.e. created by 
`git clone git@github.com:username/sinking-feeling`. 

(One time only) Setup a remote for the main repository: 
`git remote add main https://github.com/PSU-SW500-SU16-T5/sinking-feeling`
This will create a "remote" that you can track called "main". When you cloned
your fork, git automatically made a remote called "origin" that tracks your
fork on github.

Each time you want to make a branch, pull all the changes (from both your
forked repository but especially main) into your local repository.
`git fetch --all`

Then make a banch to do development on.
`git checkout -b branch_name main/develop`

Modify your files, then add them to the staged area.
`git add file1.txt file2.js path/to/file3.html`

Once you have all the files you need for this change, commit them.
`git commit`

You will be prompted to enter a commit message. The first line should be a
phrase that describes the commit. Then there should be a blank line, then a 
paragraph describing the change in more detail. Finally there should be a
blank line followed by `Fixes #[issue number]`. 

    Fast file parser

    Added a very speedy file parser for files of type alpha, beta, and
    charlie. This will only be activated if the gamma condition exceedes the
    threshold set by the checker.

    Fixes #123

Then you need to push your changed branch up to your forked repo.
`git push`

Finally, you need to submit a pull request in github from the branch on your
forked repo to the main repo. If you browse to either repo shortly after
pushing your change, you should see a message asking if you want to create
the pull request for the just pushed change. If you don't see that, you need
to select the branch from the drop down (in your fork) and click the "New pull 
request" button. It should have automatically picked up your commit message 
and matched it with the correct issue. Just click submit.


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
