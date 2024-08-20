// gallery.js
function renderGallery() {
    const container = document.querySelector('.container');
    cardData.forEach((card, index) => {
        const cardHTML = `
            <div class="cover atvImg" onclick="enterDetail(${index})">
                ${card.frontImages.map(img => `<div class="atvImg-layer" data-img="${img}"></div>`).join('')}
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    atvImg();  // Terapkan efek animasi setelah gallery dirender
}

renderGallery();
