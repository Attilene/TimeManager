function sha_256(text) {
    let md = forge.md.sha256.create();
    md.start();
    md.update(text, "utf8");
    return  md.digest().toHex()
}

function gen_salt() {
    const chrs = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let salt = '';
    for (let i = 0; i < 64; i++) {
        let pos = Math.floor(Math.random() * chrs.length);
        salt += chrs.substring(pos, pos + 1);
    }
    return sha_256(salt);
}

function gen_hash(psw, salt) {return sha_256(sha_256(psw) + salt)}

function pack_psw(psw, salt, public_key) {
    let key = forge.pki.publicKeyFromPem(public_key);
    let hashed_psw = gen_hash(psw, salt) ;
    let encrypted = key.encrypt(hashed_psw, "RSA-OAEP", {
     md: forge.md.sha256.create(),
     mgf1: forge.mgf1.create()
    });
    return  forge.util.encode64(encrypted);
}

