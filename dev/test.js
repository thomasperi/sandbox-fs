/*global describe, it */
const os = require('os');
const fs = require('fs');
const path = require('path').posix;
const sandboxFs = require('../');

const testDir = path.join(os.tmpdir(), 'test-sandbox-fs');
const boxDir = path.join(testDir, 'the-sandbox');
const disallowedFile = path.join(testDir, 'disallowed.txt');
const allowedFile = path.join(boxDir, 'allowed.txt');

const FAIL = ['FAIL'];

async function boxed(fn) {
	const unbox = sandboxFs(boxDir);
	let result = await fn();
	unbox();
	return result;
}

// Create a temp directory, run the test, and delete the temp.
async function withTempDir(fn) {
	if (fs.existsSync(testDir)) {
		throw 'temp directory already exists';
	}
	fs.mkdirSync(boxDir, {recursive: true});
	fs.writeFileSync(allowedFile, 'yes', 'utf8');
	fs.writeFileSync(disallowedFile, 'no', 'utf8');
	try {
		await fn();
	} finally {
		fs.rmSync(testDir, {recursive: true, force: true});
	}
}

async function tryOneWay(attempts, fsMethodProxy) {
	for (const attempt of attempts) {
		await withTempDir(() => attempt(fsMethodProxy));
	}
}

function testAllForms({method, attempts, promises, callbacks, synchronous}) {
	const methodSync = `${method}Sync`;

	describe(`Test all '${method}' methods`, async () => {
		
		if (promises && fs.promises && fs.promises[method]) {
			it(`should work with fs.promises.${method}`, async () => {
				await tryOneWay(attempts, async (...a) => {
					try {
						return await fs.promises[method](...a);
					} catch (e) {
						return FAIL;
					}
				});
			});
		}
		
		if (callbacks && fs[method]) {
			it(`should work with fs.${method}`, async () => {
				await tryOneWay(attempts, (...a) => new Promise((resolve) => {
					try {
						fs[method](...a, (error, result) => {
							resolve(error ? error : result);
						});
					} catch (e) {
						resolve(FAIL);
					}
				}));
			});
		}
		
		if (synchronous && fs[methodSync]) {
			it(`should work with fs.${methodSync}`, async () => {
				await tryOneWay(attempts, async (...a) => {
					try {
						return fs[methodSync](...a);
					} catch (e) {
						return FAIL;
					}
				});
			});
		}
		
	});
}

module.exports = {
	FAIL,
	boxed,
	testAllForms,
	disallowedFile,
	allowedFile,
};