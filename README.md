# Alert System Gatherer

This project has been created by an EWU senior project team. The purpose of this project is to provide a a single web app that provides information and push notifications for local alerts in the Spokane area. Alerts include WSDOT traffic alerts such as road closures, traffic incidents, road conditions, and severe weather warnings through NWS. The future goal of the project is too include other alert services like fires, crime, and school closures.

## Getting Started

To get the web app running locally on your system you will first need to install the following components:

* [Nodejs](https://nodejs.org/en/download/)
* [MongoDB](https://www.mongodb.com/download-center#community)
* [AngularJS](https://angular.io/)
* [Express](http://expressjs.com/)

These are the four key components of [MEAN stack](http://meanjs.org/)

Once you have these components installed you have a few more steps to run the program.

1. In your projects directory enter in the command npm install. This will install all of the node [modules](https://www.w3schools.com/nodejs/nodejs_modules.asp) needed to run this project.
2. Activate MongoDB
3. In the command line navigate to the CronUpdater folder in your project directory then run the command:"node autoUpdater.js" (without the quotes). This will fill the database with the current alerts. If you leave it running it will update the data every 5 minutes.
4. In the command line navigate to the projects main folder and run the command: npm start

You can now access the site locally at [localhost:3000](http://localhost:3000/)

