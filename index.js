const jsonic = require('jsonic');
const clarinet = require('clarinet');

const fixJson = (json, lastError) => {
	const getJSONParseError = (json) => {
		var parser = clarinet.parser(),
			firstError = undefined;

		// generate a detailed error using the parser's state
		function makeError(e) {
			var currentNL = 0,
				nextNL = json.indexOf('\n'),
				line = 1;
			while (line < parser.line) {
				currentNL = nextNL;
				nextNL = json.indexOf('\n', currentNL + 1);
				++line;
			}
			return {
				snippet: json.substr(currentNL + 1, nextNL - currentNL - 1),
				message: (e.message || '').split('\n', 1)[0],
				line: parser.line,
				column: parser.column,
			};
		}

		// trigger the parse error
		parser.onerror = function (e) {
			firstError = makeError(e);
			parser.close();
		};
		try {
			parser.write(json).close();
		} catch (e) {
			if (firstError === undefined) {
				return makeError(e);
			} else {
				return firstError;
			}
		}

		return firstError;
	};

	const insertCharacter = (text, line, column, character) => {
		let lines = text.split(/\r?\n/);
		lines[line] =
			lines[line].slice(0, column) + character + lines[line].slice(column);

		return lines.join('\n');
	};

	const replacePairCharacter = (text, line, column, newChar, pairedChar) => {
		let lines = text.split(/\r?\n/);

		lines[line] =
			lines[line].slice(0, column) +
			newChar +
			lines[line].slice(column + 1).replace(pairedChar, newChar);

		return lines.join('\n');
	};

	const replaceCharacter = (text, line, newChar, oldChar) => {
		let lines = text.split(/\r?\n/);

		lines[line] = lines[line].replace(oldChar, newChar);

		return lines.join('\n');
	};

	try {
		// console.log('Validating', json);

		// Execute first phase validator
		const result = jsonic(json);

		// Execute second phase validator (strict)
		const e = getJSONParseError(json);

		if (e && e.message === 'Bad value') {
			if (
				lastError &&
				lastError.message === e.message &&
				lastError.column === e.column &&
				lastError.line === e.line
			) {
				// Bail out from recursive call, we cannot fix this error
				throw e;
			} else {
				if (e.snippet.indexOf('\u201C') > -1) {
					// try to fix error on validate again
					return this.fixJson(
						replaceCharacter(
							replaceCharacter(json, e.line - 1, '"', '\u201C'),
							e.line - 1,
							'"',
							'\u201D'
						)
					);
				} else throw e;
			}
		}
		// Valid json
		else return json;
	} catch (e) {
		console.log('Error', e);

		// Missing ":" error
		if (e.message === 'Expected ":" but "\\"" found.') {
			if (
				lastError &&
				lastError.message === e.message &&
				lastError.column === e.column &&
				lastError.line === e.line
			) {
				// Bail out from recursive call, we cannot fix this error
				throw e;
			}
			// try to fix error on validate again
			else
				return this.fixJson(
					insertCharacter(json, e.line - 1, e.column - 1, ':'),
					e
				);
		}
		// Left quote/right quote error
		else if (
			e.message === 'Expected ",", "}" or key but "\\u201C" found.' ||
			e.message === 'Expected "}" or key but "\\u201C" found.'
		) {
			if (
				lastError &&
				lastError.message === e.message &&
				lastError.column === e.column &&
				lastError.line === e.line
			) {
				// Bail out from recursive call, we cannot fix this error
				throw e;
			}
			// try to fix error on validate again
			else
				return this.fixJson(
					replacePairCharacter(json, e.line - 1, e.column - 1, '"', '\u201D'),
					e
				);
		} else throw e;
	}
};

const addMissingCommas = (str) => {
	const regex = /([\"a-zA-Z0-9]+)([: ]+)([\"][\w]+[\"]([\s\n\}\]]{1,}))+(['"\w])/g;
	let m;

	while ((m = regex.exec(str)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		// console.log("m.index = " + m.index);
		// console.log("regex.lastIndex = " + regex.lastIndex);
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		m.forEach((match, groupIndex) => {
			if (groupIndex === 5) {
				str =
					str.slice(0, regex.lastIndex - 1) +
					',' +
					str.slice(regex.lastIndex - 1);
			}
			// console.log(`Found match, group ${groupIndex}: ${match}`);
		});
	}

	return str;
};

const parse = (data) => {
	let parsed = data;

	// add if any missing commas
	parsed = addMissingCommas(parsed);

	parsed = fixJson(parsed);
	// console.log('Fixed json', parsed);

	// fix the json as possible
	parsed = jsonic(parsed);

	return parsed;
};

module.exports = { parse };
