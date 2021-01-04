const fs = require('fs');
const request = require('request');

const loadIcons = (cb) => {
  const fileStream = fs.createWriteStream(
    './src/pages/partials/sparkIcons.hbs',
  );
  request
    .get({
      uri:
        'https://www.rockomni.com/mcds/assets/GlobalContent/NonStockImages/Icons/spark-icons-v14.svg',
      rejectUnauthorized: false,
    })
    .on('error', (error) => {
      console.error(error);
    })
    .pipe(fileStream)
    .on('finish', cb);
};

loadIcons(() => {
  console.log('done fetching icons');
});
