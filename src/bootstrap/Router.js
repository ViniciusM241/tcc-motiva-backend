const fs = require('fs');
const path = require('path');
const uncaptalizeFirstLetter = require('../utils/uncaptilizeFirstLetter');
const { asClass } = require('awilix');
const Response = require('../bootstrap/Response');
const Request = require('../bootstrap/Request');
const Error = require('../bootstrap/Error');
const errorHandler = require('../middlewares/errorHandler');

class Router {
  constructor(app, container) {
    this.allRoutes = this.getAllRoutes();
    this.app = app;
    this.container = container;

    this.registerAppFiles();
  }

  registerAppFiles() {
    const dir = path.resolve(__dirname, '..', 'app');
    const filesDirs = fs.readdirSync(dir);

    filesDirs.forEach(fileDir => {
      const path = `${dir}/${fileDir}`;
      const files = fs.readdirSync(path);

      const filteredFiles = files.filter(fileName => !fileName.match(/Routes/));

      filteredFiles.forEach(fileName => {
        const handledFileName = uncaptalizeFirstLetter(fileName.replace('.js', ''));
        const _class = require(`${path}/${fileName}`).default;

        this.container.register(handledFileName, asClass(_class));
      })
    })
  }

  getAllRoutes() {
    const appPathDir = path.resolve(__dirname, '..', 'app');
    const appDir = fs.readdirSync(appPathDir);

    return appDir.reduce((acc, dir) => {
      const filePathDir = path.resolve(appPathDir, dir, `${dir}Routes.js`);
      const routeFileExist = fs.existsSync(filePathDir);

      if (!routeFileExist) return acc;

      const routes = require(filePathDir);

      if (!Array.isArray(routes)) return acc;

      const newRoutes = routes.map(route => ({
        ...route,
        resource: dir,
      }));

      return acc = [ ...acc, ...newRoutes ];
    }, []);
  }

  registerRoutes() {
    this.allRoutes.forEach(route => {
      const beforeMiddlewares = route.beforeMiddlewares || [];
      const afterMiddlewares = route.afterMiddlewares || [];
      const actions = [ ...beforeMiddlewares, this.routeAction(route), ...afterMiddlewares ];

      this.app.route(`/api${route.path}`)[route.method](...actions);
    });

    this.registerNotFoundRoute();
    this.registerErrorHandlerMiddleware();
  }

  registerNotFoundRoute() {
    this.app.use('*', () => {
      throw new Error('Not found', 404);
    });
  }

  registerErrorHandlerMiddleware() {
    this.app.use((err, req, res, next) => errorHandler(
      err,
      new Request(req, res),
      new Response(req, res),
      next,
    ));
  }

  routeAction(route) {
    return async (req, res, next) => {
      try {
        const controller = this.container.resolve(uncaptalizeFirstLetter(`${route.resource}Controller`));
        await controller[route.action](
          new Request(req, res),
          new Response(req, res),
          next,
        );
      } catch(e) {
        next(e);
      }
    }
  }
}

module.exports = Router;
