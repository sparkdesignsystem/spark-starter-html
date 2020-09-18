const gulp = require("gulp");
const fs = require('fs');
const request = require('request');

function loadIcons(cb) {
  const fileStream = fs.createWriteStream(
    "./src/spark-icons.hbs"
  );
  request
    .get({
      uri: "https://www.rockomni.com/mcds/assets/GlobalContent/NonStockImages/Icons/spark-icons-v14.svg",
      rejectUnauthorized: false
    })
    .pipe(fileStream)
    .on("finish", cb);
}

exports.loadIcons = loadIcons;
