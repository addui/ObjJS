var gulp = require("gulp");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var sourcemaps = require('gulp-sourcemaps');

gulp.task("default", function(){
  gulp.src(["node_modules/guidjs/dist/GUID.js", "src/Obj.js"])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('Obj.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist/"))
    .pipe(gulp.dest("docs/"));
});

gulp.task("watch", function(){
  gulp.watch("src/Obj.js", ["default"]);
});
