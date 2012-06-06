// Generated by CoffeeScript 1.3.3
(function() {

  define(function(require, exports, module) {
    var CoffeeScript, DIVIDER_POSITION, MENU_ENTRY_POSITION, commands, css, editors, ext, ide, lineMatching, markup, menus, util;
    ide = require('core/ide');
    ext = require('core/ext');
    util = require('core/util');
    editors = require('ext/editors/editors');
    markup = require('text!ext/livecoffee/livecoffee.xml');
    menus = require("ext/menus/menus");
    commands = require("ext/commands/commands");
    CoffeeScript = require('ext/livecoffee/vendor/coffeescript');
    console.log(CoffeeScript);
    lineMatching = require('ext/livecoffee/vendor/cs_js_source_mapping');
    console.log(lineMatching);
    css = require("text!ext/livecoffee/livecoffee.css");
    DIVIDER_POSITION = 2100;
    MENU_ENTRY_POSITION = 2200;
    return ext.register('ext/livecoffee/livecoffee', {
      name: 'LiveCoffee',
      dev: 'Tane Piper',
      type: ext.GENERAL,
      alone: true,
      markup: markup,
      commands: {
        'livecoffee': {
          hint: 'Compile the current coffeescript document'
        }
      },
      hotitems: {},
      nodes: [],
      css: css,
      hook: function() {
        var _self;
        _self = this;
        commands.addCommand({
          name: "livecoffee",
          hint: "start livecoffee plugin",
          bindKey: {
            mac: "Command-K",
            win: "Ctrl-K"
          },
          exec: function() {
            return _self.livecoffee();
          }
        });
        this.nodes.push(menus.addItemByPath("Edit/~", new apf.divider(), DIVIDER_POSITION));
        this.nodes.push(menus.addItemByPath("Edit/LiveCoffee", new apf.item({
          command: "livecoffee"
        }), MENU_ENTRY_POSITION));
        this.hotitems['livecoffee'] = [this.nodes[1]];
      },
      livecoffee: function() {
        var ace, editor,
          _this = this;
        ext.initExtension(this);
        this.compile();
        this.liveCoffeeOutput.show();
        if (this.liveCoffeeOutput.visible) {
          editor = editors.currentEditor;
          ace = editor.amlEditor.$editor;
          editor.ceEditor.addEventListener('keyup', function() {
            return _this.compile();
          });
          editor.ceEditor.$ext.addEventListener('click', function() {
            if (_this.liveCoffeeOptMatchLines.checked) {
              return _this.highlightActualBlock(ace);
            }
          });
        }
      },
      compile: function() {
        var ace, bare, compiledJS, doc, editor, value;
        editor = editors.currentEditor;
        ace = editor.amlEditor.$editor;
        doc = editor.getDocument();
        value = doc.getValue();
        compiledJS = '';
        try {
          bare = this.liveCoffeeOptCompileBare.checked;
          compiledJS = CoffeeScript.compile(value, {
            bare: bare
          });
          this.matchingLines = lineMatching.source_line_mappings(value.split("\n"), compiledJS.split("\n"));
          this.liveCoffeeCodeOutput.setValue(compiledJS);
          if (this.liveCoffeeOptMatchLines.checked) {
            this.highlightActualBlock(ace);
          }
          if (this.liveCoffeeOptCompileNodes.checked) {
            this.liveCoffeeNodeOutput.setValue(CoffeeScript.nodes(value));
          }
          if (this.liveCoffeeOptCompileTokens.checked) {
            this.liveCoffeeTokenOutput.setValue(CoffeeScript.tokens(value));
          }
        } catch (exp) {
          this.liveCoffeeCodeOutput.setValue(exp.message);
        }
      },
      findMatchingBlocks: function(lineNumber, matchingLines) {
        var line, matchingBlocks, _i, _len;
        matchingBlocks = {};
        for (_i = 0, _len = matchingLines.length; _i < _len; _i++) {
          line = matchingLines[_i];
          if (lineNumber < line[0]) {
            matchingBlocks["js_end"] = line[1];
            matchingBlocks["coffee_end"] = line[0];
            return matchingBlocks;
          }
          matchingBlocks["coffe_start"] = line[0];
          matchingBlocks["js_start"] = line[1];
        }
      },
      highlightActualBlock: function(ace) {
        var currentLine, lineNumber, matchingBlocks, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _results, _results1, _results2;
        if (this.decoratedLines != null) {
          _ref = this.decoratedLines["js"];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            lineNumber = _ref[_i];
            this.liveCoffeeCodeOutput.$editor.renderer.removeGutterDecoration(lineNumber, "tobi");
          }
          _ref1 = this.decoratedLines["coffee"];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            lineNumber = _ref1[_j];
            ace.renderer.removeGutterDecoration(lineNumber, "tobi");
          }
        }
        currentLine = ace.getCursorPosition().row;
        matchingBlocks = this.findMatchingBlocks(currentLine, this.matchingLines);
        this.liveCoffeeCodeOutput.$editor.gotoLine(matchingBlocks["js_start"] + 1);
        this.decoratedLines = {};
        this.decoratedLines["js"] = (function() {
          _results = [];
          for (var _k = _ref2 = matchingBlocks["js_start"], _ref3 = matchingBlocks["js_end"]; _ref2 <= _ref3 ? _k < _ref3 : _k > _ref3; _ref2 <= _ref3 ? _k++ : _k--){ _results.push(_k); }
          return _results;
        }).apply(this);
        this.decoratedLines["coffee"] = (function() {
          _results1 = [];
          for (var _l = _ref4 = matchingBlocks["coffe_start"], _ref5 = matchingBlocks["coffee_end"]; _ref4 <= _ref5 ? _l < _ref5 : _l > _ref5; _ref4 <= _ref5 ? _l++ : _l--){ _results1.push(_l); }
          return _results1;
        }).apply(this);
        _ref6 = this.decoratedLines["js"];
        for (_m = 0, _len2 = _ref6.length; _m < _len2; _m++) {
          lineNumber = _ref6[_m];
          this.liveCoffeeCodeOutput.$editor.renderer.addGutterDecoration(lineNumber, "tobi");
        }
        _ref7 = this.decoratedLines["coffee"];
        _results2 = [];
        for (_n = 0, _len3 = _ref7.length; _n < _len3; _n++) {
          lineNumber = _ref7[_n];
          _results2.push(ace.renderer.addGutterDecoration(lineNumber, "tobi"));
        }
        return _results2;
      },
      init: function(amlNode) {
        var _this = this;
        apf.importCssString(css);
        liveCoffeeOptCompileBare.addEventListener('click', function() {
          return _this.compile();
        });
        this.liveCoffeeOptCompileBare = liveCoffeeOptCompileBare;
        liveCoffeeOptCompileNodes.addEventListener('click', function() {
          if (liveCoffeeOptCompileNodes.checked) {
            _this.liveCoffeeNodes.enable();
            return _this.compile();
          } else {
            return liveCoffeeNodes.disable();
          }
        });
        this.liveCoffeeOptCompileNodes = liveCoffeeOptCompileNodes;
        liveCoffeeOptCompileTokens.addEventListener('click', function() {
          if (liveCoffeeOptCompileTokens.checked) {
            _this.liveCoffeeTokens.enable();
            return _this.compile();
          } else {
            return _this.liveCoffeeTokens.disable();
          }
        });
        this.liveCoffeeOptCompileTokens = liveCoffeeOptCompileTokens;
        this.liveCoffeeOptMatchLines = liveCoffeeOptMatchLines;
        liveCoffeeCodeOutput.syntax = 'javascript';
        this.liveCoffeeCodeOutput = liveCoffeeCodeOutput;
        this.liveCoffeeOutput = liveCoffeeOutput;
        liveCoffeeNodes.disable();
        this.liveCoffeeNodes = liveCoffeeNodes;
        this.liveCoffeeNodeOutput = liveCoffeeNodeOutput;
        liveCoffeeTokens.disable();
        this.liveCoffeeTokens = liveCoffeeTokens;
        this.liveCoffeeTokenOutput = liveCoffeeTokenOutput;
      },
      enable: function() {
        this.nodes.each(function(item) {
          return item.enable();
        });
        return this.disabled = false;
      },
      disable: function() {
        this.nodes.each(function(item) {
          return item.disable();
        });
        return this.disabled = true;
      },
      destroy: function() {
        this.nodes.each(function(item) {
          item.destroy(true, true);
        });
        this.nodes = [];
        this.liveCoffeeOptCompileBare.destroy(true, true);
        this.liveCoffeeOptCompileNodes.destroy(true, true);
        this.liveCoffeeOptCompileTokens.destroy(true, true);
        this.liveCoffeeOptMatchLines.destroy(true, true);
        this.liveCoffeeCodeOutput.destroy(true, true);
        this.liveCoffeeOutput.destroy(true, true);
        this.liveCoffeeNodes.destroy(true, true);
        this.liveCoffeeNodeOutput.destroy(true, true);
        this.liveCoffeeTokens.destroy(true, true);
        this.liveCoffeeTokenOutput.destroy(true, true);
      }
    });
  });

}).call(this);
