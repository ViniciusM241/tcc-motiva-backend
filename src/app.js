const { createContainer } = require('awilix');
const express = require('express');
const helmet = require('helmet');
const Router = require('./bootstrap/Router');
const utils = require('./utils');
const bootstrap = require('./bootstrap');
const Tasks = require('./tasks');

class App {
  constructor() {
    this.app = express();
    this.container = createContainer();

    this.configure();
    this.configureTasks();
  }

  init() {
    const port = process.env.PORT || 3000;

    this.app.listen(port, console.log(`Running on port ${port}`));
  }

  configure() {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    utils(this.container);
    bootstrap(this.container);

    const router = new Router(this.app, this.container);
    router.registerRoutes();
  }

  configureTasks() {
    const tasks = new Tasks(this.container.cradle);

    tasks.init();
  }

}

module.exports = new App();
// HNnqCCN2
