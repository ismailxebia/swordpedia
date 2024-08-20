let initialPosition = null; // Store the initial position of the card

function enterDetail(index) {
    const detailView = document.getElementById('detail-view');
    const detailCard = detailView.querySelector('.detail-card');
    const card = document.querySelectorAll('.cover')[index]; // Get the clicked card
    const cardRect = card.getBoundingClientRect(); // Get the card's position in the gallery
    
    // Store the initial position
    initialPosition = {
        top: cardRect.top + window.scrollY,
        left: cardRect.left + window.scrollX,
        width: cardRect.width,
        height: cardRect.height,
    };

    // Reset detail card content
    detailCard.innerHTML = '';

    // Create container for layers and effects
    const containerHTML = document.createElement('div');
    const shineHTML = document.createElement('div');
    const shadowHTML = document.createElement('div');
    const glareHTML = document.createElement('div');
    const layersHTML = document.createElement('div');
    const layers = [];

    containerHTML.className = 'atvImg-container';
    shineHTML.className = 'atvImg-shine';
    shadowHTML.className = 'atvImg-shadow';
    glareHTML.className = 'atvImg-glare';
    layersHTML.className = 'atvImg-layers';

    // Create layered images based on card data
    cardData[index].frontImages.forEach((imgSrc, i) => {
        const layer = document.createElement('div');
        layer.className = 'atvImg-rendered-layer';
        layer.setAttribute('data-layer', i);
        layer.style.backgroundImage = `url(${imgSrc})`;
        layersHTML.appendChild(layer);
        layers.push(layer);
    });

    // Assemble the detail card
    containerHTML.appendChild(shadowHTML);
    containerHTML.appendChild(layersHTML);
    containerHTML.appendChild(shineHTML);
    containerHTML.appendChild(glareHTML);
    detailCard.appendChild(containerHTML);

    // Set initial position and size of the detail card
    detailCard.style.position = 'absolute';
    detailCard.style.top = `${initialPosition.top}px`;
    detailCard.style.left = `${initialPosition.left}px`;
    detailCard.style.width = `${initialPosition.width}px`;
    detailCard.style.height = `${initialPosition.height}px`;

    // Display the detail view with animation
    detailView.classList.add('active');

    setTimeout(() => {
        detailCard.style.transition = 'all 0.5s ease';
        detailCard.style.top = '50%';
        detailCard.style.left = '50%';
        detailCard.style.transform = 'translate(-50%, -50%)';
        detailCard.style.width = '320px'; // Default card size
        detailCard.style.height = '420px'; // Default card size
    }, 10);

    // Apply the parallax effect after the card is displayed
    applyParallaxEffect(detailCard, layers, shineHTML, glareHTML, shadowHTML);
}

function closeDetail() {
    const detailView = document.getElementById('detail-view');
    const detailCard = detailView.querySelector('.detail-card');

    // Animate the card back to its initial position
    detailCard.style.transition = 'all 0.5s ease';
    detailCard.style.top = `${initialPosition.top}px`;
    detailCard.style.left = `${initialPosition.left}px`;
    detailCard.style.transform = 'none';
    detailCard.style.width = `${initialPosition.width}px`;
    detailCard.style.height = `${initialPosition.height}px`;

    // Hide the detail view after the animation completes
    setTimeout(() => {
        detailView.classList.remove('active');
        detailCard.style.transition = 'none';
    }, 500);
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function applyParallaxEffect(detailCard, layers, shine, glare, shadow) {
    const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

    if (supportsTouch) {
        detailCard.addEventListener('touchmove', function (e) {
            processMovement(e, true, detailCard, layers, layers.length, shine, glare);
        });
        detailCard.addEventListener('touchstart', function (e) {
            processEnter(e, detailCard);
        });
        detailCard.addEventListener('touchend', function (e) {
            processExit(e, detailCard, layers, layers.length, shine, glare);
        });
    } else {
        // Throttle the mousemove event
        detailCard.addEventListener('mousemove', throttle(function (e) {
            processMovement(e, false, detailCard, layers, layers.length, shine, glare);
        }, 20)); // Throttle set to 20ms for smoother performance
        
        detailCard.addEventListener('mouseenter', function (e) {
            processEnter(e, detailCard);
        });
        detailCard.addEventListener('mouseleave', function (e) {
            processExit(e, detailCard, layers, layers.length, shine, glare);
        });
    }
}

function processMovement(e, touchEnabled, elem, layers, totalLayers, shine, glare) {
    var bdst = document.body.scrollTop || document.documentElement.scrollTop,
        bdsl = document.body.scrollLeft,
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

    // Dynamic shine effect
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

    // Dynamic glare effect
    glare.style.backgroundPosition = `${15 + offsetX * 80}% ${15 + offsetY * 80}%`;
    glare.style.opacity = `${0.1 + pointerFromCenter * 0.5}`;
    glare.style.filter = `brightness(1) contrast(1)`;

    shine.style.transform = `translateX(${offsetX * totalLayers}px) translateY(${offsetY * totalLayers}px)`;

    // Parallax layer effect
    let revNum = totalLayers;
    for (let ly = 0; ly < totalLayers; ly++) {
        layers[ly].style.transform = `
          translateX(${offsetX * revNum * ((ly * 2.5) / wMultiple)}px) 
          translateY(${offsetY * totalLayers * ((ly * 2.5) / wMultiple)}px)`;
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
