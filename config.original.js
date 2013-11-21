/*
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 */

var config = {
    port : 3000,
    mongodb : "mongodb://localhost/dbname?poolSize=10",
    cookieSecret : "your secret for cookie",
    pwdSecret : "your secret for pwd",
    encryptedPwd : "encrypted password",
    uploadPath : "/your/upload/path",
    originProdPath : "/your/upload/path/origin",
    resizeProdPath : "/your/upload/path/resize",
};

exports.get = function(key) {
    return config[key];
};
