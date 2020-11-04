const { src, dest, series, watch } = require("gulp");
const fs = require("fs");
const request = require("request");
const hb = require("gulp-hb");
const sass = require("gulp-sass");
const browserify = require("browserify");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

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

// run js through babel and browserify
function js(cb) {
  browserify("./src/js/main.js")
    .transform("babelify", { presets: ["@babel/preset-env"] })
    .bundle()
    .pipe(fs.createWriteStream("./dist/main.js"))
    .on("finish", cb);
}

// process sass, write css file
function styles(cb) {
  src("./src/styles/main.scss")
    .pipe(sass({ includePaths: ["node_modules"] }).on("error", sass.logError))
    .pipe(dest("./dist"))
    .on("finish", cb);
}

// start a browser-sync server and file watchers
function browsersync(cb) {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  watch(["./src/pages/**/*.html"], (cb) => {
    pages(cb);
    reload();
  });
  watch(["./src/js/**/*.js"], (cb) => {
    js(cb);
    reload();
  });
  watch(["./src/styles/**/*.scss"], (cb) => {
    styles(cb);
    reload();
  });
}

exports.build = series(icons, styles, js, pages);
exports.serve = series(exports.build, browsersync);
