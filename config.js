exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://lbv:chiefandzoe@ds245518.mlab.com:45518/whereabouts';
exports.TEST_DATABASE_URL = (process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-whereabouts');
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || global.CLIENT_ORIGIN || 3000;
exports.PORT = process.env.PORT || 8080;