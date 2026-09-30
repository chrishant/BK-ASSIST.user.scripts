function a0_0x601a(_0x5d5c99, _0xebfe25) {
    _0x5d5c99 = _0x5d5c99 - 0xa6;
    const _0x2b3a05 = a0_0x2b3a();
    let _0x601a1a = _0x2b3a05[_0x5d5c99];
    return _0x601a1a;
}
function a0_0x2b3a() {
    const _0x1c5483 = [
        'message',
        'BKAssist',
        '✘\x20Material\x20Assistant\x0a\x0a',
        'text',
        '3299yCSLSx',
        '2828tNdsxe',
        '225AtAzCM',
        '686iJspHZ',
        '1190892MqwVCk',
        'core',
        '22McZZYj',
        'https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/',
        'includes',
        '1278HgOibx',
        'status',
        'ui/assist-theme.js',
        ':\x20HTTP\x20',
        'core/assist-core.js',
        '70698vGiMYt',
        'no-store',
        '3255910ZCMblC',
        '76376JFhOGI',
        'now',
        'getElementById',
        '819kEntuA',
        'init',
        '905690UcVbru'
    ];
    a0_0x2b3a = function () {
        return _0x1c5483;
    };
    return a0_0x2b3a();
}
(function (_0xc17c9e, _0x10abbb) {
    const a0_0x1cb188 = {
            _0x2ea541: 0xae,
            _0x2fef75: 0xb7,
            _0x390d6b: 0xb0,
            _0x20ae30: 0xbc,
            _0x23ac28: 0xbe,
            _0x3e596b: 0xbf,
            _0x1d9951: 0xb4
        }, _0x57abeb = a0_0x601a, _0x31ba4e = _0xc17c9e();
    while (!![]) {
        try {
            const _0x73d52c = -parseInt(_0x57abeb(a0_0x1cb188._0x2ea541)) / 0x1 * (-parseInt(_0x57abeb(0xb1)) / 0x2) + -parseInt(_0x57abeb(a0_0x1cb188._0x2fef75)) / 0x3 * (-parseInt(_0x57abeb(0xaf)) / 0x4) + parseInt(_0x57abeb(a0_0x1cb188._0x390d6b)) / 0x5 * (parseInt(_0x57abeb(a0_0x1cb188._0x20ae30)) / 0x6) + -parseInt(_0x57abeb(a0_0x1cb188._0x23ac28)) / 0x7 + -parseInt(_0x57abeb(a0_0x1cb188._0x3e596b)) / 0x8 * (parseInt(_0x57abeb(0xa7)) / 0x9) + -parseInt(_0x57abeb(0xa9)) / 0xa + parseInt(_0x57abeb(a0_0x1cb188._0x1d9951)) / 0xb * (parseInt(_0x57abeb(0xb2)) / 0xc);
            if (_0x73d52c === _0x10abbb)
                break;
            else
                _0x31ba4e['push'](_0x31ba4e['shift']());
        } catch (_0x1420be) {
            _0x31ba4e['push'](_0x31ba4e['shift']());
        }
    }
}(a0_0x2b3a, 0xb3ed4), ((async () => {
    const a0_0x22fb3a = {
            _0x16dc1b: 0xa8,
            _0x48c6bf: 0xab,
            _0x446b80: 0xac
        }, a0_0xe370e4 = {
            _0x4a1f42: 0xc0,
            _0x9d19e8: 0xba,
            _0x25d3b3: 0xad
        }, _0x104887 = a0_0x601a;
    if (document[_0x104887(0xa6)]('bk-material-btn'))
        return;
    const _0x32a975 = _0x104887(0xb5);
    async function _0x31041c(_0x830377) {
        const _0x277ffb = _0x104887, _0x5a3df9 = _0x830377[_0x277ffb(0xb6)]('?') ? '&' : '?', _0x245f89 = await fetch('' + _0x32a975 + _0x830377 + _0x5a3df9 + '_=' + Date[_0x277ffb(a0_0xe370e4._0x4a1f42)](), { 'cache': _0x277ffb(0xbd) });
        if (!_0x245f89['ok'])
            throw new Error(_0x830377 + _0x277ffb(a0_0xe370e4._0x9d19e8) + _0x245f89[_0x277ffb(0xb8)]);
        (0x0, eval)(await _0x245f89[_0x277ffb(a0_0xe370e4._0x25d3b3)]());
    }
    try {
        await _0x31041c(_0x104887(0xbb));
        const _0x4177bf = await window[_0x104887(0xab)][_0x104887(0xb3)][_0x104887(a0_0x22fb3a._0x16dc1b)]();
        if (!_0x4177bf)
            return;
        await _0x31041c(_0x104887(0xb9)), await _0x31041c('ui/assist-ui.js'), window[_0x104887(a0_0x22fb3a._0x48c6bf)]['mountUI'](window[_0x104887(0xab)][_0x104887(0xb3)]);
    } catch (_0x4081a3) {
        console['error']('✘\x20Material\x20Assistant\x20failed\x20to\x20load:', _0x4081a3), alert(_0x104887(a0_0x22fb3a._0x446b80) + _0x4081a3[_0x104887(0xaa)]);
    }
})()));