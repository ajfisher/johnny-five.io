require("es6-shim");
require("copy-paste");
var inspect = require("util").inspect;
var fs = require("fs");
var Remarkable = require("remarkable");
var markdown = new Remarkable({
  html: true
});

module.exports = function(grunt) {

  var task = grunt.task;
  var file = grunt.file;
  var log = grunt.log;
  var verbose = grunt.verbose;
  var fail = grunt.fail;
  var option = grunt.option;
  var config = grunt.config;
  var template = grunt.template;
  var _ = grunt.util._;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    gitclone: {
      "johnny-five": {
        options: {
          repository: "https://github.com/rwaldron/johnny-five.git",
          directory: "src/johnny-five",
          depth: 1
        }
      },
      "johnny-five.wiki": {
        options: {
          repository: "https://github.com/rwaldron/johnny-five.wiki.git",
          directory: "src/johnny-five.wiki",
          depth: 1
        }
      }
    },
    clean: {
      build: [
        "public/css",
        "public/js",
        "public/docs"
      ],
      deps: [
        "src/johnny-five",
        "src/johnny-five.wiki"
      ]
    },
    copy: {
      type: {
        nonull: true,
        src: "src/sass/type.css",
        dest: "public/css/type.css"
      },
      anchorcss: {
        nonull: true,
        src: "src/sass/anchor.css",
        dest: "public/css/anchor.css"
      },
      programs: {
        nonull: true,
        src: "src/johnny-five/programs.json",
        dest: "public/js/programs.json"
      },
      breadboards: {
        nonull: true,
        expand: true,
        flatten: true,
        src: "src/johnny-five/docs/breadboard/**",
        dest: "public/img/breadboard/"
      },
      images: {
        nonull: true,
        expand: true,
        cwd: "src/img",
        src: "**",
        dest: "public/img/"
      }
    },
    sass: {
      dev: {
        files: {
          "public/css/styles.css": "src/sass/styles.scss"
        },
        options: {
          update: true
        }
      },
      dist: {
        files: {
          "public/css/styles.css": "src/sass/styles.scss"
        },
        options: {
          style: "compact",
          sourcemap: "none"
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 1337,
          base: "public",
          livereload: true
        }
      }
    },
    examples: {
      files: ["src/johnny-five/programs.json"]
    },
    watch: {
      regen: {
        files: "src/**/*.*",
        tasks: ["regen"],
        options: {
          livereload: true
        },
      },
      css: {
        files: "src/sass/*.scss",
        tasks: ["sass:dev"],
        options: {
          livereload: true
        },
      },
      html: {
        files: "public/*.html",
        tasks: [],
        options: {
          livereload: true
        }
      },
      js: {
        files: ["src/js/**/*.js", "Gruntfile.js"],
        tasks: ["jsbeautifier", "jshint", "jscs", "uglify"],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: false,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        strict: false,
        esnext: true,
        globals: {
          exports: true,
          document: true,
          $: true,
          Radar: true,
          WeakMap: true,
          window: true,
          copy: true
        }
      },
      files: {
        src: [
          "Gruntfile.js",
          "src/js/**/*.js",
          "!src/js/jquery.js",
          "!src/js/tablesaw.stackonly.js",
          "!src/js/es6-shim.js"
        ]
      }
    },
    jscs: {
      files: {
        src: [
          "Gruntfile.js",
          "src/js/**/*.js",
          "!src/js/anchor.min.js",
          "!src/js/jquery.js",
          "!src/js/tablesaw.stackonly.js",
          "!src/js/es6-shim.js"
        ]
      },
      options: {
        config: ".jscsrc",
        requireCurlyBraces: [
          "if",
          "else",
          "for",
          "while",
          "do",
          "try",
          "catch",
        ],
        disallowNewlineBeforeBlockStatements: true,
        requireSpaceBeforeBlockStatements: true,
        requireParenthesesAroundIIFE: true,
        requireSpacesInConditionalExpression: true,
        // requireSpaceBeforeKeywords: true,
        requireSpaceAfterKeywords: [
          "if", "else",
          "switch", "case",
          "try", "catch",
          "do", "while", "for",
          "return", "typeof", "void",
        ],
        // validateQuoteMarks: {
        //   mark: "\"",
        //   escape: true
        // }
      }
    },
    jsbeautifier: {
      files: ["src/js/**/*.js"],
      options: {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0
        }
      }
    },
    uglify: {
      my_target: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: "src/js",
          src: "**/*.js",
          dest: "public/js"
        }]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-git");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Default task(s).
  // grunt.registerTask("default", ["uglify"]);
  grunt.registerTask("install", ["clean:deps", "gitclone"]);
  grunt.registerTask("dev", ["connect", "copy", "watch"]);
  grunt.registerTask("regen", ["copy", "uglify", "examples-list", "examples", "api-docs", "platform-support"]);
  grunt.registerTask("default", ["clean:build", "regen", "copy", "sass:dist", "uglify"]);


  grunt.registerTask("examples-list", "generate examples list", function() {
    var templates = {
      examples: _.template(file.read("tpl/.examples.html")),
    };

    var examples = extract("examples", file.read("src/johnny-five/README.md")).map(function(extraction) {
      return extraction.map(function(line) {
        return line
          .replace("https://github.com/rwaldron/johnny-five/blob/master/docs/", "/examples/")
          .replace(".md", ".html");
      }).join("\n");
    });

    file.write("public/examples.html", templates.examples({
      list: markdown.render(examples[0])
    }));
  });

  grunt.registerMultiTask("examples", "generate examples", function() {
    var templates = {
      exampleContent: _.template(file.read("tpl/.example-content.html")),
    };

    var entries = JSON.parse(file.read(file.expand(this.data)));
    var titles = JSON.parse(file.read("src/titles.json"));

    entries.forEach(function(entry) {
      entry.files.forEach(function(value) {
        var title = titles[value];
        var outpath = "public/examples/" + value.replace(".js", ".html");
        var inpath = "src/johnny-five/docs/" + value.replace(".js", ".md");
        var example = markdown.render(
          // open file
          // eliminate sections marked for removal
          // modify image path
          // modify displayed fzz
          remove(file.read(inpath))
            .replace(/\]\(breadboard\//g, "](../img/breadboard/")
            .replace(/docs\/breadboard\//g, "")
        );

        if (!title) {
          console.log("Missing title.json entry: ", value);
        }
        // Place it into our html template
        file.write(outpath, templates.exampleContent({
          title: title,
          contents: example
        }));
      });
    });
  });


  grunt.registerTask("api-docs", "generate api docs", function() {
    var templates = {
      api: _.template(file.read("tpl/.api.html")),
      apiContent: _.template(file.read("tpl/.api-content.html")),
    };

    var source = file.read("src/johnny-five.wiki/Home.md");
    var api = extract("api", source)[0].join("\n");
    var matches = api.match(/\(https:\/\/github.com\/rwaldron\/johnny-five\/wiki\/(.*)\)/g).map(function(match) {

      var result = match.slice(1, -1);
      var lastIndex = result.lastIndexOf("/");
      var title = result.slice(lastIndex + 1);

      return {
        title: title,
        source: "src/johnny-five.wiki/" + title + ".md",
        target: "api/" + title.toLowerCase() + ".html"
      };
    }, {});

    var list = markdown.render(matches.reduce(function(accum, match) {
      accum += "- [" + match.title + "](/" + match.target + ")\n";
      return accum;
    }, ""));

    matches.forEach(function(match) {
      file.write("public/"+ match.target, templates.apiContent({
        title: match.title,
        list: list,
        contents: markdown.render(file.read(match.source))
      }));
    });

    file.write("public/api.html", templates.api({
      list: list
    }));
  });

  grunt.registerTask("platform-support", "generate platform support", function() {
    var garbage = ["<thead>","<tr><th>_</th><th>_</th></tr>","</thead>"];
    var templates = {
      platformSupport: _.template(file.read("tpl/.platform-support.html")),
      platformVariant: _.template(file.read("tpl/.platform-variant.html")),
    };

    var plugins = JSON.parse(file.read("src/platforms-plugins.json"));
    var glossary = plugins.glossary;
    var contents = "";

    plugins.platforms.forEach(function(platform) {
      var plugin = platform.plugin;
      var env = platform.environment;

      platform.variants.forEach(function(variant, index) {
        if (variant.enabled) {
          // console.log(variant, variant.capabilities);
          var first = variant.capabilities.table[0].join("|");
          var header = "|" + first + "|";
          var bounds = "|" + first.replace(/([A-Z ])\w+/g, "-") + "|";
          var capabilities = "|" + variant.capabilities.table[2].join("|") + "|";
          var capabilitiesA = [header, bounds, capabilities].join("\n");
          var capabilitiesB = ["|_|_|", "|-|-|"].concat(Object.keys(variant.capabilities.keyed).map(function(key, index) {
            return "|" + key + "|" + variant.capabilities.keyed[key] + "|";
          })).join("\n");

          contents += templates.platformVariant({
            capabilitiesA: markdown.render(capabilitiesA),
            capabilitiesB: strip(markdown.render(capabilitiesB), garbage),
            image: variant.image,
            name: variant.name,
            pluginName: plugin.name,
            pluginUrl: plugin.url,
            pluginInstructions: plugin.instructions,
            envName: env.name,
            envUrl: env.url,
            envInstructions: env.instructions,
            envRelationship: strip(markdown.render(glossary[env.relationship]), ["<p>", "</p>"]),
          });
        }
      });
    });


    file.write("public/platform-support.html", templates.platformSupport({
      contents: contents
    }));
  });

  function extract(name, source) {
    var lines = !Array.isArray(source) ? source.split("\n") : source;
    var extraction = 0;
    var extractions = [];
    var isExtraction = false;
    var isNewExtraction = false;

    lines.forEach(function(line) {
      if (line.includes("extract-end") && line.includes(name)) {
        isExtraction = false;
        extraction++;
      }

      if (isExtraction) {
        if (isNewExtraction) {
          isNewExtraction = false;
          extractions[extraction] = [];
        }

        extractions[extraction].push(line);
      }

      if (line.includes("extract-start") && line.includes(name)) {
        isExtraction = true;
        isNewExtraction = true;
      }

    });

    return extractions;
  }

  function remove(source) {
    var result = [];
    var lines = !Array.isArray(source) ? source.split("\n") : source;
    var isRemoval = false;
    var isRemovalEnd = false;

    lines.forEach(function(line) {
      if (line.includes("remove-end")) {
        isRemovalEnd = true;
      }

      if (line.includes("remove-start")) {
        isRemoval = true;
      }

      if (!isRemoval) {
        result.push(line);
      }

      if (isRemovalEnd) {
        isRemovalEnd = false;
        isRemoval = false;
      }
    });

    return result.join("\n").trim();
  }

  function strip(text, targets) {
    return text.replace(new RegExp(targets.join("|"), "g"), "");
  }
};



