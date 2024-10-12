import express, { Router, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import settings from './common/settings/settings';
import session from 'express-session';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './router';
import './modules/auth/passport-local';
import './modules/auth/passport-google';
import './modules/auth/passport-jwt';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mr. Policeman API',
      version: '1.0.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
    },
    servers: [
      {
        url: settings.selfUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer sjdfhjdghkdfj',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/modules/**/*.router.ts'],
};

const specs = swaggerJsdoc(options);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
    origin: settings.clientUrl,
  })
);

app.use(
  '/docs',
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    const swaggerOptions = {
      swaggerOptions: {
        authAction: {
          bearerAuth: {
            name: 'bearerAuth',
            schema: {
              type: 'http',
              in: 'header',
              name: 'Authorization',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
            value: req?.cookies?.access_token,
          },
        },
      },
    };
    swaggerUi.setup(specs, swaggerOptions)(req, res, next);
  }
);

app.use(
  session({
    secret: settings.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const apiRouter = Router();
routes.appRouter(apiRouter);
app.use('/', apiRouter);

app.get('/', (req, res) => {
  res.redirect('/docs');
});

app.listen(settings.port, () => {
  console.log(`Server is running on port http://localhost:${settings.port}`);
});
