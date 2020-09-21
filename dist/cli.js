#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./main");
var commander_1 = require("commander");
commander_1.program.version("0.01");
commander_1.program.name("fy").usage("<word>");
commander_1.program.arguments("<word>").action(function (word) {
    main_1.translate(word);
});
commander_1.program.parse(process.argv);
