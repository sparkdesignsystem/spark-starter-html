const { src, dest, series } = require("gulp");
const fs = require("fs");
const request = require("request");
const hb = require("gulp-hb");

// fetch icons from the cdn, write handlebars partial to be consumed in 'pages' task
function icons(cb) {
  const fileStream = fs.createWriteStream(
    "./src/pages/partials/sparkIcons.hbs"
  );
  request
    .get({
      uri:
        "https://www.rockomni.com/mcds/assets/GlobalContent/NonStockImages/Icons/spark-icons-v14.svg",
      rejectUnauthorized: false,
    })
    .pipe(fileStream)
    .on("finish", cb);
}

// process the handlebars, write out html in dist
function pages(cb) {
  src("./src/pages/*.html")
    .pipe(
      hb()
        .partials("./src/pages/partials/**/*.hbs")
        .helpers("./src/pages/helpers/*.js")
        .data("./src/pages/data/**/*.{js,json}")
    )
    .pipe(dest("./dist"))
    .on("finish", cb);
}

function js(cb) {
  // process js, bundle
}

function styles(cb) {
  // process sass, write css file
}

function clean(cb) {
  // delete the icons file
  // delete the dist dir
}

exports.build = series(icons, pages);
