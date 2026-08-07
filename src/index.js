const core = require('@actions/core');

async function run() {
  const username = core.getInput('username', { required: true, trimWhitespace: true });
  const password = core.getInput('password', { required: true, trimWhitespace: true });
  const host = core.getInput('host', { required: true, trimWhitespace: true });
  const port = Number(core.getInput('port') || 22);

  const localDirPath = core.getInput('local_dir') || '.';
  const remoteDir = core.getInput('remote_dir') || '/';

  let sftp;
  try {
    // dynamic ESM import to support ssh2-sftp-client v12 while keeping CommonJS action
    const mod = await import('ssh2-sftp-client');
    const SftpClient = mod.default || mod;
    const uploadDir = mod.uploadDir;

    sftp = new SftpClient();
    await sftp.connect({ host, port, username, password });

    if (typeof uploadDir === 'function') {
      await uploadDir(sftp, localDirPath, remoteDir);
    } else if (typeof sftp.uploadDir === 'function') {
      // fallback for older ssh2-sftp-client versions
      await sftp.uploadDir(localDirPath, remoteDir);
    } else {
      throw new Error('uploadDir helper not found in ssh2-sftp-client module');
    }
  } catch (error) {
    core.setFailed(error && error.message ? error.message : String(error));
  } finally {
    if (sftp) {
      try {
        await sftp.end();
      } catch (_) {
        // ignore
      }
    }
  }
}

run();
