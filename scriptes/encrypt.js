let key = '';
let salt = '';


receive('/get_key', function (data) {
    key = data;
    $('#form_login').attr('placeholder', 'Логин / Почта').removeAttr('disabled')
});

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

function pack_psw(psw, salt) {
    let public_key = forge.pki.publicKeyFromPem(key);
    let hashed_psw = gen_hash(psw, salt);
    let encrypted = public_key.encrypt(hashed_psw + salt, "RSA-OAEP", {
     md: forge.md.sha256.create(),
     mgf1: forge.mgf1.create()
    });
    return  forge.util.encode64(encrypted);
}

function reduceFileSize(file, callback) {
    function getExifOrientation(file, callback) {
        if (file.slice) {
            file = file.slice(0, 131072);
        } else if (file.webkitSlice) {
            file = file.webkitSlice(0, 131072);
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            var view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) {
                callback(-2);
                return;
            }
            var length = view.byteLength, offset = 2;
            while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) {
                        callback(-1);
                        return;
                    }
                    var little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                            callback(view.getUint16(offset + (i * 12) + 8, little));
                            return;
                        }
                }
                else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            callback(-1);
        };
        reader.readAsArrayBuffer(file);
    }

    function imgToCanvasWithOrientation(img, rawWidth, rawHeight, orientation) {
        var canvas = document.createElement('canvas');
        canvas.width = rawWidth;
        canvas.height = rawHeight;
        var ctx = canvas.getContext('2d');
        switch (orientation) {
            case 2: ctx.transform(-1, 0, 0, 1, rawWidth, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, rawWidth, rawHeight); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, rawHeight); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(-1, 0, 0, 1, rawWidth, 0); break;
            case 7: ctx.transform(0, -1, -1, 0, rawHeight, rawWidth); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, rawWidth); break;
        }
        if (orientation === 6) {
            ctx.scale(-1, 1);
            rawWidth = - rawWidth
        }
        ctx.drawImage(img, 0, 0, rawWidth, rawHeight);
        return canvas;
    }

    var quality = 1;
    var img = new Image();
    img.onerror = function() {
        URL.revokeObjectURL(this.src);
        callback(file);
    };
    img.onload = function() {
        URL.revokeObjectURL(this.src);
        getExifOrientation(file, function(orientation) {
            var w = img.width, h = img.height;
            if (w < h) {
                var maxWidth = 300;
                var maxHeight = Infinity
            }
            else {

                var maxWidth = Infinity;
                var maxHeight = 300
            }
            var scale = (orientation > 4 ?
                Math.min(maxHeight / w, maxWidth / h, 1) :
                Math.min(maxWidth / w, maxHeight / h, 1));
            h = Math.round(h * scale);
            w = Math.round(w * scale);

            var canvas = imgToCanvasWithOrientation(img, w, h, orientation);
            canvas.toBlob(function(blob) {
                callback(blob);
            }, 'image/jpeg', quality);
        });
    };
    img.src = URL.createObjectURL(file);
}