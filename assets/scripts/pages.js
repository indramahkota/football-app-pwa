'use strict';
    
let clientX = 0;
let closeSide = true;
const spinner = document.querySelector('.loader');

const ar = ['sidebar', 'overlay', 'butRefresh', 'btnMenu',
    'btnProfile', 'target1', 'target2', 'target3'];

const [sidebar, overlay, refreshbtn, menubtn, profilebtn, target1btn,
    target2btn, target3btn] = ar.map(x => document.getElementById(x));

let removeOverlay = () => {
    if(closeSide){
        overlay.classList.remove('active');
        sidebar.classList.remove('active');
    }
}

let btnSidebarOnClickHandler = target => {
    sidebar.style.transition = 'all 0.3s';
    sidebar.style.left = '-250px';
    setTimeout(() => {
        removeOverlay();
        location.href = target; 
    }, 350);
}

let getCookie = name => {
    var dc = document.cookie;
    var prefix = name + '=';
    var begin = dc.indexOf('; ' + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(';', begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}

/* addEventListener('load', () => {
    spinner.setAttribute('hidden', true);
    
    if(getCookie('uid') != null){
        let d = new Date();
        d.setTime(d.getTime() + (60*1000)); //(15*60*1000) 15 menit //saat ini akan logout selama 1 menit

        let uid = getCookie('uid');
        let expires = d.toUTCString();
        document.cookie = `uid=${uid};expires=${expires};path=/`;

        // setInterval(() => {
        //     console.log("update!!!");
        // }, 1000);
        
        setInterval(() => {
            if(getCookie('uid') == null){
                location = 'index.html';
            }
        }, 15000);
    } else {
        location = 'index.html';
    }
}); */

refreshbtn.addEventListener('click', () => location.reload());
profilebtn.addEventListener('click', () => console.log('btnProfileClicked'));

menubtn.addEventListener('click', () => {
    closeSide = false;
    if(sidebar.className.split(' ').indexOf('active') == -1){
        sidebar.style.left = '0px';
        sidebar.className += ' active';
        overlay.className += ' active';
    }
});

target1btn.addEventListener('click', () => btnSidebarOnClickHandler('page1.html'));
target2btn.addEventListener('click', () => btnSidebarOnClickHandler('page2.html'));
target3btn.addEventListener('click', () => btnSidebarOnClickHandler('page3.html'));

overlay.addEventListener('click', () => {
    closeSide = true;
    if(sidebar.className.split(' ').indexOf('active') > -1){
        sidebar.style.left = '-250px';
        setTimeout(() => (removeOverlay()), 350);
    }
});

overlay.addEventListener('touchstart', e => {
    closeSide = false;
    sidebar.style.transition = '0s';
    clientX = e.touches[0].clientX;
}, {passive: true});

overlay.addEventListener('touchmove', e => {
    let delta = e.changedTouches[0].clientX - clientX;
    if(delta <= 0) sidebar.style.left = delta + 'px';
}, {passive: true});

overlay.addEventListener('touchend', () => {
    closeSide = true;
    sidebar.style.transition = 'all 0.3s';
    const num = parseFloat(sidebar.style.left);
    if(sidebar.className.split(' ').indexOf('active') > -1){
        if(num > -125 && num < 0)
            sidebar.style.left = '0px';
        else {
            sidebar.style.left = '-250px';
            setTimeout(() => (removeOverlay()), 350);
        }
    }
}, {passive: true});

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./service-worker-v1.js')
}
