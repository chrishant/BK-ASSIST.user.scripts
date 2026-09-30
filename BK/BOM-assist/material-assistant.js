function a0_0x4042() {
    const _0x58c423 = [
        '778cUVSPC',
        'mountUI',
        '507520uGeLXX',
        'BKAssist',
        '4690756RYPlyz',
        'status',
        'message',
        'getElementById',
        '4121032jpyOnT',
        'core/assist-core.js',
        '836880hqpjsR',
        '✘\x20Material\x20Assistant\x20failed\x20to\x20load:',
        '6639SerXRL',
        'text',
        '5758542YuhkQF',
        'now',
        'init',
        'error',
        ':\x20HTTP\x20',
        '2516664yeFoNc',
        'includes'
    ];
    a0_0x4042 = function () {
        return _0x58c423;
    };
    return a0_0x4042();
}
function a0_0x1fac(_0x506e68, _0x40f580) {
    _0x506e68 = _0x506e68 - 0x1dd;
    const _0x4042b7 = a0_0x4042();
    let _0x1fac6d = _0x4042b7[_0x506e68];
    return _0x1fac6d;
}
(function (_0x122af0, _0x1b31c2) {
    const a0_0x469565 = { _0x42d9e1: 0x1ef }, _0x3fbb8e = a0_0x1fac, _0xd150fa = _0x122af0();
    while (!![]) {
        try {
            const _0x55ed7d = parseInt(_0x3fbb8e(0x1ed)) / 0x1 + -parseInt(_0x3fbb8e(0x1e3)) / 0x2 * (parseInt(_0x3fbb8e(a0_0x469565._0x42d9e1)) / 0x3) + parseInt(_0x3fbb8e(0x1e1)) / 0x4 + parseInt(_0x3fbb8e(0x1e5)) / 0x5 + parseInt(_0x3fbb8e(0x1f1)) / 0x6 + -parseInt(_0x3fbb8e(0x1e7)) / 0x7 + -parseInt(_0x3fbb8e(0x1eb)) / 0x8;
            if (_0x55ed7d === _0x1b31c2)
                break;
            else
                _0xd150fa['push'](_0xd150fa['shift']());
        } catch (_0x18d4fe) {
            _0xd150fa['push'](_0xd150fa['shift']());
        }
    }
}(a0_0x4042, 0x757bd), ((async () => {
    const a0_0x6d5fba = {
            _0x3f7a71: 0x1ea,
            _0x5afa7b: 0x1e6,
            _0x1b18f2: 0x1ee,
            _0x455bb5: 0x1e9
        }, a0_0x110d6d = {
            _0xcf0f5f: 0x1e2,
            _0x5b61df: 0x1dd,
            _0x3ac202: 0x1f0
        }, _0x18e86a = a0_0x1fac;
    if (document[_0x18e86a(a0_0x6d5fba._0x3f7a71)]('bk-material-btn'))
        return;
    const _0xcc717a = 'https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/';
    async function _0x554d11(_0x31c20c) {
        const _0x5ecbf5 = _0x18e86a, _0x12933e = _0x31c20c[_0x5ecbf5(a0_0x110d6d._0xcf0f5f)]('?') ? '&' : '?', _0x5260cb = await fetch('' + _0xcc717a + _0x31c20c + _0x12933e + '_=' + Date[_0x5ecbf5(a0_0x110d6d._0x5b61df)](), { 'cache': 'no-store' });
        if (!_0x5260cb['ok'])
            throw new Error(_0x31c20c + _0x5ecbf5(0x1e0) + _0x5260cb[_0x5ecbf5(0x1e8)]);
        (0x0, eval)(await _0x5260cb[_0x5ecbf5(a0_0x110d6d._0x3ac202)]());
    }
    try {
        await _0x554d11(_0x18e86a(0x1ec));
        const _0x334005 = await window[_0x18e86a(0x1e6)]['core'][_0x18e86a(0x1de)]();
        if (!_0x334005)
            return;
        await _0x554d11('ui/assist-theme.js'), await _0x554d11('ui/assist-ui.js'), window['BKAssist'][_0x18e86a(0x1e4)](window[_0x18e86a(a0_0x6d5fba._0x5afa7b)]['core']);
    } catch (_0x240afc) {
        console[_0x18e86a(0x1df)](_0x18e86a(a0_0x6d5fba._0x1b18f2), _0x240afc), alert('✘\x20Material\x20Assistant\x0a\x0a' + _0x240afc[_0x18e86a(a0_0x6d5fba._0x455bb5)]);
    }
})()));