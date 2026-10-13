function a0_0x4304(_0x453347, _0xbe1e63) {
    _0x453347 = _0x453347 - 0x188;
    const _0x1529d4 = a0_0x1529();
    let _0x43040f = _0x1529d4[_0x453347];
    return _0x43040f;
}
(function (_0x3a2438, _0x5bcf9c) {
    const a0_0x3d5b84 = {
            _0x14e804: 0x18d,
            _0x1e44c2: 0x194,
            _0x203eea: 0x19d,
            _0x57f9d1: 0x19b,
            _0x369dd2: 0x197
        }, _0x140a44 = a0_0x4304, _0x524a1f = _0x3a2438();
    while (!![]) {
        try {
            const _0x4752a3 = -parseInt(_0x140a44(a0_0x3d5b84._0x14e804)) / 0x1 * (parseInt(_0x140a44(0x195)) / 0x2) + parseInt(_0x140a44(0x19f)) / 0x3 + parseInt(_0x140a44(a0_0x3d5b84._0x1e44c2)) / 0x4 * (-parseInt(_0x140a44(0x1a2)) / 0x5) + parseInt(_0x140a44(a0_0x3d5b84._0x203eea)) / 0x6 + parseInt(_0x140a44(a0_0x3d5b84._0x57f9d1)) / 0x7 * (parseInt(_0x140a44(0x1a0)) / 0x8) + parseInt(_0x140a44(a0_0x3d5b84._0x369dd2)) / 0x9 * (-parseInt(_0x140a44(0x18e)) / 0xa) + parseInt(_0x140a44(0x1a8)) / 0xb;
            if (_0x4752a3 === _0x5bcf9c)
                break;
            else
                _0x524a1f['push'](_0x524a1f['shift']());
        } catch (_0x2b45b2) {
            _0x524a1f['push'](_0x524a1f['shift']());
        }
    }
}(a0_0x1529, 0x49b4a), ((async () => {
    const a0_0x55b5dc = {
            _0x48e886: 0x196,
            _0x20284d: 0x196,
            _0x165772: 0x19a,
            _0xf019ee: 0x188,
            _0x3f9113: 0x18a,
            _0x217b46: 0x1a7,
            _0x12b832: 0x1a3,
            _0x32cc2a: 0x196,
            _0x4c6ccb: 0x192
        }, a0_0x44f239 = { _0x9b1698: 0x19c }, a0_0x20e0f1 = {
            _0x31069a: 0x199,
            _0x140516: 0x18f,
            _0x4f2268: 0x198,
            _0xe5dc0f: 0x1a5,
            _0x4ed7d1: 0x190,
            _0x450607: 0x193
        }, _0x595981 = a0_0x4304;
    if (document['getElementById'](_0x595981(0x1a1)))
        return;
    const _0x484e28 = [
            'http://localhost:8000/',
            'https://raw.githubusercontent.com/chrishant/BK-ASSIST.user.scripts/refs/heads/main/BK/BOM-assist/'
        ], _0x2d00fc = 0x5dc;
    let _0x3a7384 = ![];
    async function _0x34c82c(_0x2b592f) {
        const _0x2347f2 = _0x595981, _0x437ef0 = _0x2b592f[_0x2347f2(0x18c)]('?') ? '&' : '?';
        let _0x316541;
        for (let _0x7504ac = 0x0; _0x7504ac < _0x484e28[_0x2347f2(0x1a9)]; _0x7504ac++) {
            const _0x34310e = _0x7504ac === 0x0;
            if (_0x34310e && _0x3a7384)
                continue;
            const _0x583d15 = new AbortController(), _0x1545a8 = _0x34310e ? setTimeout(() => _0x583d15['abort'](), _0x2d00fc) : null;
            try {
                const _0x4782dd = await fetch('' + _0x484e28[_0x7504ac] + _0x2b592f + _0x437ef0 + '_=' + Date[_0x2347f2(0x191)](), {
                    'cache': _0x2347f2(a0_0x20e0f1._0x31069a),
                    'signal': _0x583d15[_0x2347f2(0x1a6)]
                });
                if (!_0x4782dd['ok'])
                    throw new Error('HTTP\x20' + _0x4782dd[_0x2347f2(0x19e)]);
                return console[_0x2347f2(a0_0x20e0f1._0x140516)]('✔\x20' + (_0x34310e ? _0x2347f2(a0_0x20e0f1._0x4f2268) : _0x2347f2(0x1aa)) + ':\x20' + _0x2b592f), _0x4782dd;
            } catch (_0x1d4a9b) {
                _0x316541 = _0x1d4a9b;
                if (_0x34310e) {
                    if (_0x1d4a9b[_0x2347f2(a0_0x20e0f1._0xe5dc0f)] === _0x2347f2(a0_0x20e0f1._0x4ed7d1) || _0x1d4a9b instanceof TypeError)
                        _0x3a7384 = !![];
                }
                console[_0x2347f2(a0_0x20e0f1._0x450607)]((_0x34310e ? 'local' : 'remote') + '\x20failed\x20for\x20' + _0x2b592f + ':\x20' + _0x1d4a9b['message']);
            } finally {
                if (_0x1545a8)
                    clearTimeout(_0x1545a8);
            }
        }
        throw new Error(_0x2b592f + ':\x20' + (_0x316541 ? _0x316541['message'] : _0x2347f2(0x18b)));
    }
    window['BKAssist'] = window[_0x595981(a0_0x55b5dc._0x48e886)] || {}, window[_0x595981(a0_0x55b5dc._0x20284d)][_0x595981(a0_0x55b5dc._0x165772)] = _0x34c82c;
    async function _0x16bb87(_0x513bbd) {
        const _0x2f3598 = _0x595981, _0x3d4b12 = await _0x34c82c(_0x513bbd);
        (0x0, eval)(await _0x3d4b12[_0x2f3598(a0_0x44f239._0x9b1698)]());
    }
    try {
        await _0x16bb87(_0x595981(a0_0x55b5dc._0xf019ee));
        const _0x370d2d = await window['BKAssist']['core'][_0x595981(a0_0x55b5dc._0x3f9113)]();
        if (!_0x370d2d)
            return;
        await _0x16bb87(_0x595981(a0_0x55b5dc._0x217b46)), await _0x16bb87(_0x595981(a0_0x55b5dc._0x12b832)), window[_0x595981(a0_0x55b5dc._0x20284d)]['mountUI'](window[_0x595981(a0_0x55b5dc._0x32cc2a)][_0x595981(0x1a4)]);
    } catch (_0x55bffa) {
        console['error'](_0x595981(0x189), _0x55bffa), alert('✘\x20Material\x20Assistant\x0a\x0a' + _0x55bffa[_0x595981(a0_0x55b5dc._0x4c6ccb)]);
    }
})()));
function a0_0x1529() {
    const _0x38335e = [
        'log',
        'AbortError',
        'now',
        'message',
        'warn',
        '1782548xJuMKp',
        '10114VuFIBh',
        'BKAssist',
        '1836sQEHbv',
        'LOCAL',
        'no-store',
        'fetchRepo',
        '56DwUkzk',
        'text',
        '1148982ncCjGa',
        'status',
        '609222PMemWA',
        '417504dLsJBR',
        'bk-material-btn',
        '5SEieTC',
        'ui/assist-ui.js',
        'core',
        'name',
        'signal',
        'ui/assist-theme.js',
        '8532117dIiqWh',
        'length',
        'REMOTE',
        'core/assist-core.js',
        '✘\x20Material\x20Assistant\x20failed\x20to\x20load:',
        'init',
        'unavailable',
        'includes',
        '59mwiryX',
        '26560gVQlOn'
    ];
    a0_0x1529 = function () {
        return _0x38335e;
    };
    return a0_0x1529();
}
