const gulp = require("gulp");
const fs = require('fs');
const request = require('request');

function loadIcons(cb) {
  const fileStream = fs.createWriteStream(
    "./src/templates/spark-core-icons.hbs"
  );
  request
    .get({
      uri: "https://www.rockomni.com/mcds/assets/GlobalContent/NonStockImages/Icons/spark-core-icons-V12.svg",
      rejectUnauthorized: false
    })
    .pipe(fileStream)
    .on("finish", cb);
}

exports.loadIcons = loadIcons;
