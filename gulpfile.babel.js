/*
  =============================
  gulpの設定
  =============================
*/

// ----------------------------
// パッケージの読み込み
// ----------------------------

import gulp from 'gulp';

//- ejs packages
import ejs from 'gulp-ejs';

//- css packages
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass( dartSass );

import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcss from 'gulp-postcss';

//- js packages
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';

//- image packages


//- server packages
import browserSync from 'browser-sync';

// other packages
import plumber from 'gulp-plumber';
import newer from 'gulp-newer';
import rename from 'gulp-rename';
import del from 'del';
import fs from 'fs';


// ----------------------------
// パス設定
// ----------------------------

var root = {
  src: 'src/',
  srcAsset: 'src/assets/',
  dist: 'dist/natural-water/',
  distAsset: 'dist/natural-water/assets/'
}

const paths = {
  html: {
    src: root.src + '**/*.+(html|shtml|htm)',
    dest: root.dist + ''
  },

  ejs: {
    src: root.src + 'ejs/pages/**/*.ejs',
    ignore: root.src + 'ejs/**/_*.ejs',
    dest: root.dist + ''
  },

  json: {
    config: root.src + 'data/config.json',
    src: root.src + '**/*.json',
    ignore: root.src + 'data/*.json',
    dest: root.dist + ''
  },

  css: {
    src: root.srcAsset + 'scss/**/*.scss',
    dest: root.distAsset + 'css'
  },

  jsPlugin: {
    src: root.srcAsset + 'js/vendor/*.+(js|js.map)',
    dest: root.distAsset + 'js/vendor'
  },

  js: {
    src: root.srcAsset + 'js/**/*.js',
    dest: root.distAsset + 'js'
  },

  img: {
    src: root.srcAsset + 'img/**/*',
    dest: root.distAsset + 'img'
  },

  font: {
    src: root.srcAsset + 'font/**/*',
    dest: root.distAsset + 'font'
  },

  server: 'dist/'
}

const other = {
  src: [
    root.src + '**/*.+(woff|woff2|ttf|otf)',
    root.src + '**/*.+(php)',
    root.src + '**/*.+(pdf)',
    root.src + '**/*.+(xml)',
    root.src + '**/*.+(mov|mp4|wmv|mpg)',
    root.src + '**/*.+(ico)'
  ],
  dist: '',
}

// ----------------------------
// 関数定義
// ----------------------------

// html コピー
export function html() {
  return gulp.src(paths.html.src)
  .pipe(plumber())
  .pipe(newer(paths.html.dest))
  .pipe(gulp.dest(paths.html.dest))
}

// ejs コンパイル
export function ejsCompile() {
  const json_path = paths.json.config;
  const conf = JSON.parse(fs.readFileSync(json_path));
  return gulp.src([paths.ejs.src, '!' + paths.ejs.ignore])
  .pipe(plumber())
  .pipe(ejs(
    { conf }
  ))
  .pipe(rename(
    { extname: ".html" }
  ))
  .pipe(gulp.dest(paths.ejs.dest))
}

// scss コンパイルパイル開発用
export function cssDev() {
  const plugins = [
    autoprefixer()
  ]
  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(newer(paths.css.dest))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write(""))
    .pipe(gulp.dest(paths.css.dest)) 
}

// scss トランスパイルビルド用
export function cssBuild() {
  const plugins = [
    autoprefixer(),
    cssnano()
  ]
  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(newer(paths.css.dest))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write(""))
    .pipe(gulp.dest(paths.css.dest)) 
}

// jsプラグイン move
export function jsPlugin() {
  return gulp.src(paths.jsPlugin.src)
  .pipe(plumber())
  .pipe(newer(paths.jsPlugin.dest))
  .pipe(gulp.dest(paths.jsPlugin.dest))
}

// jsトランスパイル開発用
export function jsDev() {
  return gulp.src(paths.js.src)
  .pipe(babel())
  .pipe(plumber())
  .pipe(newer(paths.js.dest))
  // .pipe(rename({
  //   extname: '.min.js'
  // }))
  .pipe(gulp.dest(paths.js.dest));
}

// jsトランスパイルビルド用
export function jsBuild() {
  return gulp.src(paths.js.src)
  .pipe(babel())
  .pipe(plumber())
  .pipe(newer(paths.js.dest))
  .pipe(uglify())
  // .pipe(rename({
  //   extname: '.min.js'
  // }))
  .pipe(gulp.dest(paths.js.dest));
}

// image move
export function images() {
  return gulp.src(paths.img.src)
  .pipe(plumber())
  .pipe(newer(paths.img.dest))
  .pipe(gulp.dest(paths.img.dest))
}

// font move
export function fonts() {
  return gulp.src(paths.font.src)
  .pipe(plumber())
  .pipe(newer(paths.font.dest))
  .pipe(gulp.dest(paths.font.dest))
}

// json move
export function json() {
  return gulp.src([paths.json.src, '!' + paths.json.ignore])
  .pipe(plumber())
  .pipe(newer(paths.json.dest))
  .pipe(gulp.dest(paths.json.dest))
}

// other move
export function copyOther() {
  return gulp.src(other.src, {since: gulp.lastRun(copyOther)})
  .pipe(gulp.dest(root.dist))
}

// dist配下を削除
export function distDel(done) {
  del([root.dist + '**'])
  done();
}

// ローカルサーバー立ち上げ
const createServer = browserSync.create();
export function server(done) {
  createServer.init({
    server: {
      baseDir: paths.server,
      // middleware: [
      //   ssi({
      //     baseDir:root.dist,
      //     ext: '.html'
      //   })
      // ]
    },
    notify: false,
    startPaths: '/natural-water/index.html'
  })
  done();
}

// リロード
export function reload(done) {
  createServer.reload();
  done();
}

//- 監視
export function watch() {
  gulp.watch(paths.html.src, gulp.series(html, reload))
  gulp.watch([paths.ejs.src, paths.ejs.ignore], gulp.series(ejsCompile, reload))
  gulp.watch(paths.css.src, gulp.series(cssDev, reload))
  gulp.watch(paths.jsPlugin.src, gulp.series(jsPlugin, reload))
  gulp.watch(paths.js.src, gulp.series(jsDev, reload))
  gulp.watch(paths.img.src, gulp.series(images, reload))
  gulp.watch(paths.font.src, gulp.series(fonts, reload))
  gulp.watch(other.src, gulp.series(copyOther, reload))
  gulp.watch([paths.json.src, paths.json.ignore, paths.json.config], gulp.series(json, reload))
}

// ----------------------------
// タスク定義
// ----------------------------
const runDev = gulp.series(gulp.parallel(cssDev, jsPlugin, jsDev, fonts, json, copyOther, images, html, ejsCompile), server, watch);
const runBuild = gulp.series(distDel, gulp.parallel(cssBuild, jsPlugin, jsBuild, fonts, images, html, ejsCompile));

exports.default = runDev;
exports.build = runBuild;