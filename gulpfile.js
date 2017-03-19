var gulp = require("gulp");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");

gulp.task("default", function(){
  gulp.src(["node_modules/guidjs/GUID.js", "src/Obj.js"])
    .pipe(uglify())
    .pipe(concat('Obj.js'))
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function(){
  gulp.watch("src/Obj.js", ["default"]);
});
