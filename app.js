const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const health = require('@cloudnative/health-connect');
const zipkin = require('appmetrics-zipkin')(
    {
        host: 'jagger-collector.jaeger.svc.cluster.local',
        port: 9411,
        serviceName: 'cloud-native-sample-app'
    });
const prom = require('appmetrics-prometheus')
    .attach();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const healthcheck = new health.HealthChecker();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const pingCheck = new health.PingCheck('example.com');

//Liveness endpoint
app.use('/live', health.LivenessEndpoint(healthcheck));
// healthcheck.registerLivenessCheck(pingCheck);

//Readiness endpoint
app.use('/ready', health.ReadinessEndpoint(healthcheck));
healthcheck.registerReadinessCheck(pingCheck);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
