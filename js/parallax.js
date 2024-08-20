// parallax.js
function atvImg() {
    const d = document,
        de = d.documentElement,
        bd = d.getElementsByTagName('body')[0],
        htm = d.getElementsByTagName('html')[0],
        win = window,
        imgs = d.querySelectorAll('.atvImg'),
        totalImgs = imgs.length,
        supportsTouch = 'ontouchstart' in win || navigator.msMaxTouchPoints;

    if (totalImgs <= 0) return;

    for (let l = 0; l < totalImgs; l++) {
        const thisImg = imgs[l],
            layerElems = thisImg.querySelectorAll('.atvImg-layer'),
            totalLayerElems = layerElems.length;

        if (totalLayerElems <= 0) continue;

        // Bersihkan konten lama
        while (thisImg.firstChild) {
            thisImg.removeChild(thisImg.firstChild);
        }

        // Elemen-elemen baru
        const containerHTML = d.createElement('div'),
            shineHTML = d.createElement('div'),
            shadowHTML = d.createElement('div'),
            glareHTML = d.createElement('div'),
            layersHTML = d.createElement('div'),
            layers = [];

        thisImg.id = 'atvImg__' + l;
        containerHTML.className = 'atvImg-container';
        shineHTML.className = 'atvImg-shine';
        shadowHTML.className = 'atvImg-shadow';
        glareHTML.className = 'atvImg-glare';
        layersHTML.className = 'atvImg-layers';

        for (let i = 0; i < totalLayerElems; i++) {
            const layer = d.createElement('div'),
                imgSrc = layerElems[i].getAttribute('data-img');

            layer.className = 'atvImg-rendered-layer';
            layer.setAttribute('data-layer', i);
            layer.style.backgroundImage = `url(${imgSrc})`;
            layersHTML.appendChild(layer);

            layers.push(layer);
        }

        // Rangkai container dengan lapisan
        containerHTML.appendChild(shadowHTML);
        containerHTML.appendChild(layersHTML);
        containerHTML.appendChild(shineHTML);
        containerHTML.appendChild(glareHTML);
        thisImg.appendChild(containerHTML);

        const w = thisImg.clientWidth || thisImg.offsetWidth || thisImg.scrollWidth;
        thisImg.style.transform = `perspective(${w * 3}px)`;

        // Tambah event listeners untuk interaksi touch/mouse
        if (supportsTouch) {
            win.preventScroll = false;

            (function (_thisImg, _layers, _totalLayers, _shine, _glare) {
                _thisImg.addEventListener('touchmove', function (e) {
                    if (win.preventScroll) e.preventDefault();
                    processMovement(e, true, _thisImg, _layers, _totalLayers, _shine, _glare);
                });
                _thisImg.addEventListener('touchstart', function (e) {
                    win.preventScroll = true;
                    processEnter(e, _thisImg);
                });
                _thisImg.addEventListener('touchend', function (e) {
                    win.preventScroll = false;
                    processExit(e, _thisImg, _layers, _totalLayers, _shine, _glare);
                });
            })(thisImg, layers, totalLayerElems, shineHTML, glareHTML);
        } else {
            (function (_thisImg, _layers, _totalLayers, _shine, _glare) {
                _thisImg.addEventListener('mousemove', function (e) {
                    processMovement(e, false, _thisImg, _layers, _totalLayers, _shine, _glare);
                });
                _thisImg.addEventListener('mouseenter', function (e) {
                    processEnter(e, _thisImg);
                });
                _thisImg.addEventListener('mouseleave', function (e) {
                    processExit(e, _thisImg, _layers, _totalLayers, _shine, _glare);
                });
            })(thisImg, layers, totalLayerElems, shineHTML, glareHTML);
        }
    }

    function processMovement(e, touchEnabled, elem, layers, totalLayers, shine, glare) {
    var bdst = bd.scrollTop || htm.scrollTop,
      bdsl = bd.scrollLeft,
      pageX = touchEnabled ? e.touches[0].pageX : e.pageX,
      pageY = touchEnabled ? e.touches[0].pageY : e.pageY,
      offsets = elem.getBoundingClientRect(),
      w = elem.clientWidth || elem.offsetWidth || elem.scrollWidth,
      h = elem.clientHeight || elem.offsetHeight || elem.scrollHeight,
      wMultiple = 320 / w,
      offsetX = 0.52 - (pageX - offsets.left - bdsl) / w,
      offsetY = 0.52 - (pageY - offsets.top - bdst) / h,
      dy = pageY - offsets.top - bdst - h / 2,
      dx = pageX - offsets.left - bdsl - w / 2,
      pointerFromCenter = Math.sqrt(dx * dx + dy * dy) / (Math.sqrt(w * w + h * h) / 2),
      yRotate = (offsetX - dx) * (0.07 * wMultiple),
      xRotate = (dy - offsetY) * (0.1 * wMultiple),
      imgCSS = 'rotateX(' + xRotate + 'deg) rotateY(' + yRotate + 'deg)',
      arad = Math.atan2(dy, dx),
      angle = (arad * 180) / Math.PI - 90;

    if (angle < 0) {
      angle += 360;
    }

    if (elem.firstChild.className.indexOf(' over') != -1) {
      imgCSS += ' scale3d(1.07, 1.07, 1.07)';
    }
    elem.firstChild.style.transform = imgCSS;

    // Perbarui background-image shine secara dinamis
    shine.style.backgroundImage = `
      repeating-linear-gradient(
        -33deg,
        hsl(2, 70%, 47%) ${6 + offsetX * 10}%,
        hsl(228, 60%, 64%) ${12 + offsetY * 10}%,
        hsl(176, 55%, 39%) ${18 + offsetX * 10}%,
        hsl(123, 68%, 35%) ${24 + offsetY * 10}%,
        hsl(283, 75%, 57%) ${30 + offsetX * 10}%,
        hsl(2, 70%, 47%) ${36 + offsetY * 10}%
      ),
      repeating-linear-gradient(
        133deg,
        hsla(227, 53%, 12%, 0.5) 0%,
        hsl(180, 10%, 50%) 2.5%,
        hsl(83, 50%, 35%) 5%,
        hsl(180, 10%, 50%) 7.5%,
        hsla(227, 53%, 12%, 0.5) 10%,
        hsla(227, 53%, 12%, 0.5) 15%
      ),
      radial-gradient(
        farthest-corner circle at 50% 50%,
        hsla(189, 76%, 77%, 0.6) 0%,
        hsla(147, 59%, 77%, 0.6) 25%,
        hsla(271, 55%, 69%, 0.6) 50%,
        hsla(355, 56%, 72%, 0.6) 75%
      )
    `;
    shine.style.backgroundBlendMode = 'difference, luminosity, soft-light';
    shine.style.mixBlendMode = 'lighten';
    shine.style.backgroundSize = 'cover, 1100% 1100%, 600% 600%, 200% 200%';
    shine.style.backgroundPosition = `center, ${offsetX * 100}% ${offsetY * 100}%, center center, center`;
    shine.style.filter = `brightness(${1.0 + offsetX * 0.2}) contrast(1) saturate(1.2)`;
    shine.style.opacity = `0.45`;

    // Efek Glare
    glare.style.backgroundPosition = `${15 + offsetX * 80}% ${15 + offsetY * 80}%`;
    glare.style.opacity = `${0.1 + pointerFromCenter * 0.5}`; // Opacity dinamis berdasarkan jarak pointer
    glare.style.filter = `brightness(1) contrast(1)`;

    shine.style.transform =
      'translateX(' +
      offsetX * totalLayers + 'px) translateY(' +
      offsetY * totalLayers + 'px)';

    // Perbarui efek paralaks layers
    var revNum = totalLayers;
    for (var ly = 0; ly < totalLayers; ly++) {
      layers[ly].style.transform =
        'translateX(' +
        offsetX * revNum * ((ly * 2.5) / wMultiple) +
        'px) translateY(' +
        offsetY * totalLayers * ((ly * 2.5) / wMultiple) +
        'px)';
      revNum--;
    }
  }

    function processEnter(e, elem) {
        elem.firstChild.className += ' over';
    }

    function processExit(e, elem, layers, totalLayers, shine, glare) {
        const container = elem.firstChild;
        container.className = container.className.replace(' over', '');
        container.style.transform = '';
        shine.style.cssText = '';
        glare.style.cssText = '';

        for (let ly = 0; ly < totalLayers; ly++) {
            layers[ly].style.transform = '';
        }
    }
}

// Jalankan atvImg untuk menerapkan efek 3D dan animasi
atvImg();
