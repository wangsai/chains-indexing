/*
 * indexing
 * https://github.com/saiwang/chains-indexing
 *
 * Copyright (c) 2013 WangSai
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var jsYaml = require('js-yaml'),
    path = require('path'),
    _ = require('underscore');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('indexing', 'Indexing yaml-front-matter information in files.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      extraData: function(path){return {};},  //may be Object or Function to return more extra data. Parameter: the source file path
      includeContent: false,
      contentName: 'content',
      sort: null  //sort function
    });

    
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var json = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var j = extractYfm(filepath, options.includeContent, options.contentName);
        if(grunt.util.kindOf(options.extraData) === 'function')
        {
          j = _.extend({}, j, options.extraData(filepath));
        }
        else
        {
          j = _.extend({}, j, options.extraData);
        }
              
        return j;
      });

      if(grunt.util.kindOf(options.sort) === 'function')
      {
        json = json.sort(options.sort);
      }

      // Write the destination file.
      grunt.file.write(f.dest, JSON.stringify(json));

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });


    function extractYfm(src, includeContent, contentName)
    {
        var re = /^-{3}([\w\W]+?)(-{3})([\w\W]*)*/;
        var text = grunt.file.read(src);
        var results = re.exec(text), 
          conf = {};

        if(results) {
          conf = jsYaml.load(results[1]);

          //Add content if set
          if(includeContent) 
          {
            conf[contentName] = results[3] || '';
          }

        }

        conf.basename = path.basename(src);
        return conf;
    }

  });

};
