[![npm version](https://badge.fury.io/js/redo-json.svg)](https://badge.fury.io/js/redo-json)
[![npm downloads](https://img.shields.io/npm/dt/redo-json.svg)](https://badge.fury.io/js/redo-json)
[![Buy Me A Coffee](https://img.shields.io/badge/Donate-Buy%20Me%20A%20Coffee-yellow.svg)](https://www.buymeacoffee.com/emekaihedoro)

# redo-json

`redo-json` is a plugin thats adds missing quotes and removes trailing commas in JSON.

This plugin is based on [http://fixjson.com](http://fixjson.com) by [https://github.com/4ossiblellc/fixjson](4ossiblellc).

## Current support:
* add missing double quote(s)
* remove trailing commas
* try to add missing comma between properties

## Installation

    npm install redo-json
	
or
	
	yarn add redo-json

## How to use

```js
import redoJson from 'redo-json';

const json = '{message: Transaction terminated, reference: null, status: false, method: card, verify: false}';
const parsed = redoJson.parse(json);
console.log(parsed);

```

## What is JSON?
JSON or JavaScript Object Notation is a language-independent open data format that uses human-readable text to express data objects consisting of attribute-value pairs.

Although originally derived from the JavaScript scripting language, JSON data can be generated and parsed with a wide variety of programming languages including JavaScript, PHP, Python, Ruby and Java.

## Why we use JSON?
Since the JSON format is text only, it can easily be sent to and from a server, and used as a data format by any programming language.

JavaScript has a built in function to convert a string, written in JSON format, into native JavaScript objects: 

JSON.parse(jsonString)

So, if you receive data from a server, in JSON format, you can use it like any other JavaScript object.

## The JSON standard
JSON syntax is derived from JavaScript object notation syntax:

Data is in name/value pairs
Data is separated by commas
Curly braces hold objects
Square brackets hold arrays
