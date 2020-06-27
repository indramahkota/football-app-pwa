'use strict';

const tambahbtn = document.getElementById('tomboltambah');

tambahbtn.addEventListener('click', () => {
    const a = document.getElementById('angka1');
    const b = document.getElementById('angka2');
    const c = parseFloat(a.value) + parseFloat(b.value);
    document.getElementById('screen').innerHTML = c;
});
