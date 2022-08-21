var gtk="320305.131321201"
function rl(num, rule) {
    for (let i = 0; i < rule.length - 2; i += 3) {
        let d = rule.charAt(i + 2);
        d = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = '+' === rule.charAt(i + 1) ? num >>> d : num << d;
        num = '+' === rule.charAt(i) ? num + d & 4294967295 : num ^ d;
    }
    return num;
}


function tl(query) {
    let noBMPChar = query.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
    if (noBMPChar === null) {
        let qLen = query.length;
        if (qLen > 30) {
            query = `${query.substr(0, 10)}${query.substr(Math.floor(qLen / 2) - 5, 10)}${query.substr(-10, 10)}`;
        }
    } else {
        let bmpPart = query.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/);
        let i = 0;
        let len = bmpPart.length;
        let qArray = [];
        for (; i < len; i++) {
            if (bmpPart[i] !== '') {
                qArray.push(...bmpPart[i].split(''));
            }
            if (i !== len - 1) {
                qArray.push(noBMPChar[i]);
            }
        }
        let qLen = qArray.length;

        if (qLen > 30) {

            query = qArray.slice(0, 10).join('')
                + qArray.slice(Math.floor(qLen / 2) - 5, Math.floor(qLen / 2) + 5).join('')
                + qArray.slice(-10).join('');
        }
    }
    let tk;

    let key = `${String.fromCharCode(103)}${String.fromCharCode(116)}${String.fromCharCode(107)}`;

    if (gtk !== null) {
        tk = gtk;
    } else {
        tk = (gtk = window[key] || '') || '';
    }

    let tkArr = tk.split('.');
    let tk0 = Number(tkArr[0]) || 0;
    let tk1 = Number(tkArr[1]) || 0;

    let e = [];
    for (let f = 0, g = 0; g < query.length; g++) {
        let ucode = query.charCodeAt(g);

        if (ucode < 128) {

            e[f++] = ucode;
        } else {
            if (ucode < 2048) {

                e[f++] = ucode >> 6 | 192;
            } else {

                if (55296 === (ucode & 64512)
                    && g + 1 < query.length
                    && 56320 === (query.charCodeAt(g + 1) & 64512)
                ) {

                    ucode = 65536 + ((ucode & 1023) << 10) + (query.charCodeAt(++g) & 1023);
                    e[f++] = ucode >> 18 | 240;
                    e[f++] = ucode >> 12 & 63 | 128;
                } else {

                    e[f++] = ucode >> 12 | 224;
                }
                e[f++] = ucode >> 6 & 63 | 128;
            }

            e[f++] = ucode & 63 | 128;
        }
    }

    let rlt = tk0;

    let rule1 = `${String.fromCharCode(43)}${String.fromCharCode(45)}${String.fromCharCode(97)}`
        + `${String.fromCharCode(94)}${String.fromCharCode(43)}${String.fromCharCode(54)}`;

    let rule2 = `${String.fromCharCode(43)}${String.fromCharCode(45)}${String.fromCharCode(51)}`
        + `${String.fromCharCode(94)}${String.fromCharCode(43)}${String.fromCharCode(98)}`
        + `${String.fromCharCode(43)}${String.fromCharCode(45)}${String.fromCharCode(102)}`;
    for (let i = 0; i < e.length; i++) {
        rlt += e[i];

        rlt = rl(rlt, rule1);
    }
    rlt = rl(rlt, rule2);
    rlt ^= tk1;
    rlt < 0 && (rlt = (rlt & 2147483647) + 2147483648);
    rlt %= 1E6;
    return `${rlt.toString()}.${rlt ^ tk0}`;
}