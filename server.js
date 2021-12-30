/**
 * Starts up a local server to continuously sync files with bitburner.
 *
 * Ensure that `sync.js` is running on bitburner with the same port that is
 * started in this script.
 *
 * @example node server.js <port>
 */

import { readdirSync, readFileSync, statSync, watch, writeFileSync } from 'fs';
import { createServer } from 'http';
import { dirname } from 'path';

const DEFAULT_PORT = 1337;
const SCRIPTS_FOLDER = dirname('.') + '/scripts/';
const SCRIPTS_TXT = 'scripts.txt';

let dashboardData;

// Create server.
const server = createServer((request, response) => {
  if (request.url === '/dashboard/sync') {
    if (request.method === 'POST') {
      let data = '';
      request
        .on('data', chunk => (data += chunk))
        .on('end', () => {
          dashboardData = data;
          response.statusCode = 200;
          response.end();
        });
      return;
    }

    if (request.method === 'GET') {
      response.statusCode = 200;
      response.end(dashboardData);
      return;
    }
  }

  if (request.url === '/dashboard') request.url = '/dashboard/index.html';

  try {
    const data = readFileSync(dirname('.') + request.url, 'utf-8');
    response.statusCode = 200;
    if (request.url.endsWith('.js')) {
      response.setHeader('Content-Type', 'application/javascript');
    }
    response.end(data);
  } catch (error) {
    response.statusCode = 404;
    response.end(JSON.stringify(error));
  }
});

// Get port.
let port = parseInt(process.argv[2]);
port = isNaN(port) ? DEFAULT_PORT : port;

// Listen.
server.listen(port, () => {
  console.log(
    `scripts serving from http://localhost:${port}/scripts/${SCRIPTS_TXT}`
  );
});

// Watch the scripts folder and update `scripts.txt` if new scripts are added,
// renamed, or removed.
function writeScriptsTxt() {
  const scripts = readdirSync(SCRIPTS_FOLDER).filter(fileName =>
    fileName.endsWith('.js')
  );
  const contents = [];
  for (const script of scripts) {
    const lastModifiedTime = statSync(SCRIPTS_FOLDER + script).mtimeMs;
    contents.push(`${script}\t${lastModifiedTime}`);
  }
  writeFileSync(SCRIPTS_FOLDER + SCRIPTS_TXT, contents.join('\n'), 'utf-8');
}
writeScriptsTxt();
watch(SCRIPTS_FOLDER, writeScriptsTxt);
