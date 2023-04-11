const fs = require('fs'); // eslint-disable-line no-unused-vars
const assert = require('assert'); // eslint-disable-line no-unused-vars
const sandboxFs = require('..'); // eslint-disable-line no-unused-vars
const { describeMany, they, withTempFiles, sandboxDir, goodFile, badFile } = require('../dev/test.js'); // eslint-disable-line no-unused-vars

const { F_OK, R_OK, W_OK, X_OK } = fs.constants;

function chmod_u_rwx() {
	fs.chmodSync(goodFile, 0o700);
	fs.chmodSync(badFile, 0o700);
}

describeMany(
	['access', 'promise'],
	['access', 'callback'],
	['accessSync', 'sync'],
	they('should succeed at accessing good file for visibility', async (__method__) => {
		await withTempFiles(async () => {
			chmod_u_rwx();
			
			const unbox = sandboxFs(sandboxDir);
			const result = await __method__(goodFile, F_OK);
			unbox();
			
			assert.equal(result, undefined);
		});
	}),
	they('should succeed at accessing bad file for visibility', async (__method__) => {
		await withTempFiles(async () => {
			chmod_u_rwx();
			
			const unbox = sandboxFs(sandboxDir);
			const result = await __method__(badFile, F_OK);
			unbox();
			
			assert.equal(result, undefined);
		});
	}),
	they('should succeed at accessing good file for read', async (__method__) => {
		await withTempFiles(async () => {
			chmod_u_rwx();
			
			const unbox = sandboxFs(sandboxDir);
			const result = await __method__(goodFile, R_OK);
			unbox();
			
			assert.equal(result, undefined);
		});
	}),
	they('should succeed at accessing bad file for read', async (__method__) => {
		await withTempFiles(async () => {
			chmod_u_rwx();
			
			const unbox = sandboxFs(sandboxDir);
			const result = await __method__(badFile, R_OK);
			unbox();
			
			assert.equal(result, undefined);
		});
	}),
	they('should succeed at accessing good file for write', async (__method__) => {
		await withTempFiles(async () => {
			chmod_u_rwx();
			
			const unbox = sandboxFs(sandboxDir);
			const result = await __method__(goodFile, W_OK);
			unbox();
			
			assert.equal(result, undefined);
		});
	}),
	they('should fail at accessing bad file for write', async (__method__) => {
		await withTempFiles(async () => {
			chmod_u_rwx();
			
			const unbox = sandboxFs(sandboxDir);
			const result = await __method__(badFile, W_OK);
			unbox();
			
			assert.equal(result, 'FAIL');
		});
	}),
	they('should succeed at accessing good file for execute', async (__method__) => {
		await withTempFiles(async () => {
			chmod_u_rwx();

			const unbox = sandboxFs(sandboxDir);
			const result = await __method__(goodFile, X_OK);
			unbox();
			
			assert.equal(result, undefined);
		});
	}),
	they('should succeed at accessing bad file for execute', async (__method__) => {
		await withTempFiles(async () => {
			chmod_u_rwx();
			
			const unbox = sandboxFs(sandboxDir);
			const result = await __method__(badFile, X_OK);
			unbox();
			
			assert.equal(result, undefined);
		});
	}),
);

