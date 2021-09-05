const core = require('@actions/core');
const Client = require('ssh2-sftp-client');


async function run() {
  const username = core.getInput('username', { required: true, trimWhitespace: true });
  const password = core.getInput('password', { required: true, trimWhitespace: true });
  const host = core.getInput('host', { required: true, trimWhitespace: true });
  const port = Number(core.getInput('port') || 22);

  const localDirPath = core.getInput('local_dir') || '.';
  const remoteDir = core.getInput('remote_dir') || '/';
  // const relativePath = resolve(localDirPath);

  const sftp = new Client();
  await sftp.connect({ host, port, username, password });
  await sftp.uploadDir(localDirPath, remoteDir);

  process.exit(0);
}


run().catch(error => core.setFailed(error.message));
