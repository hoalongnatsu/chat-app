const moment = require('moment');

const generateMessage = (from, text) => {
   return {
      from,
      text,
      createAt: moment.valueOf(),
   }
};

const generateLocation = (from, lat, long) => {
   return {
      from,
      url: `https://www.google.com/maps?q=${lat},${long}`,
      createAt: moment.valueOf(),
   }
};

module.exports = {
   generateMessage,
   generateLocation
};
