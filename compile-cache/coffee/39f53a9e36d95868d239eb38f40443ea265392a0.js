(function() {
  var CreateFixtures, FtpHost, Host, InterProcessData, LocalFile, RemoteFile, SftpHost, fs, temp;

  fs = require('fs-plus');

  temp = require('temp').track();

  InterProcessData = require('../lib/model/inter-process-data');

  Host = require('../lib/model/host');

  FtpHost = require('../lib/model/ftp-host');

  SftpHost = require('../lib/model/sftp-host');

  RemoteFile = require('../lib/model/remote-file');

  LocalFile = require('../lib/model/local-file');

  module.exports = CreateFixtures = (function() {
    function CreateFixtures() {
      var firstLocalFile, ftpHostNoPassword, ftpHostWithPassword, ipd, localFile1, localFile2, remoteFile1, remoteFile2, secondLocalFile, sftpHostAgent, sftpHostPassword, sftpHostPkey;
      this.persistFile = temp.openSync({
        suffix: '.json'
      }).path;
      firstLocalFile = temp.openSync({
        suffix: 'coffee'
      }).path;
      secondLocalFile = temp.openSync({
        suffix: 'bash'
      }).path;
      ftpHostNoPassword = new FtpHost("ftpHostAlias", "ftpHostNoPassword", "/", "username", "21", [], true);
      remoteFile1 = new RemoteFile("/bogus/path/1", true, false, "6 byte", "0755", "22:08 30/08/2014");
      remoteFile2 = new RemoteFile("/bogus/path/2", true, false, "6 byte", "0755", "22:08 30/08/2014");
      localFile1 = new LocalFile(firstLocalFile, remoteFile1, ftpHostNoPassword);
      localFile2 = new LocalFile(secondLocalFile, remoteFile2, ftpHostNoPassword);
      ftpHostNoPassword.addLocalFile(localFile1);
      ftpHostNoPassword.addLocalFile(localFile2);
      ftpHostWithPassword = new FtpHost("ftpHostAlias", "ftpHostNoPassword", "/", "username", "21", [], true, "password");
      sftpHostAgent = new SftpHost("sftpHostAlias", "sftpHostAgent", "/", "username", "22", [], false, true, false, void 0, void 0, void 0);
      sftpHostPkey = new SftpHost("sftpHostAlias", "sftpHostPkey", "/", "username", "22", [], false, false, true, void 0, "passphrase", void 0);
      sftpHostPassword = new SftpHost("sftpHostAlias", "sftpHostPassword", "/", "username", "22", [], true, false, false, "password", void 0, void 0);
      ipd = new InterProcessData([ftpHostNoPassword, ftpHostWithPassword, sftpHostAgent, sftpHostPkey, sftpHostPassword]);
      fs.writeFileSync(this.persistFile, JSON.stringify(ipd.serialize()));
      ipd.reset();
    }

    CreateFixtures.prototype.getSerializePath = function() {
      return this.persistFile;
    };

    return CreateFixtures;

  })();

}).call(this);
