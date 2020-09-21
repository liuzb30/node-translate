#!/usr/bin/env node
import { translate } from "./main";
import { program } from "commander";

program.version("0.01");

program.name("fy").usage("<word>");
program.arguments("<word>").action((word: string) => {
  translate(word);
});

program.parse(process.argv);
