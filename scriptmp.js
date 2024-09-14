 // Função para mover o carrossel
function moveCarousel(step, id) {
    var carousel = document.getElementById(id);
    var inner = carousel.querySelector('.carousel-inner');
    var images = inner.querySelectorAll('img');
    var currentIndex = [...images].findIndex(img => img.classList.contains('active'));
    
    if (currentIndex === -1) currentIndex = 0; // Definir o índice inicial se nenhum item estiver ativo

    var nextIndex = (currentIndex + step + images.length) % images.length;

    inner.style.transform = 'translateX(-' + (nextIndex * 100) + '%)';

    images[currentIndex].classList.remove('active');
    images[nextIndex].classList.add('active');
}

// Função para configurar gestos
function setupGestures(id) {
    var carousel = document.getElementById(id);
    var hammertime = new Hammer(carousel);
    
    hammertime.on('swipeleft', function() {
        moveCarousel(1, id);
    });
    
    hammertime.on('swiperight', function() {
        moveCarousel(-1, id);
    });
}

// Inicializar todos os carrosséis
function initializeCarousels() {
    var carousels = document.querySelectorAll('.carousel');
    carousels.forEach(function(carousel) {
        var id = carousel.id;
        setupGestures(id);
    });
}

// Configurar carrosséis após o carregamento da página
window.addEventListener('load', initializeCarousels);

     
     let startX;

function handleTouchStart(event) {
    startX = event.touches[0].clientX; // Guarda a posição inicial do toque
}

function handleTouchMove(event) {
    if (!startX) return; // Se não há um toque inicial, não faz nada

    const currentX = event.touches[0].clientX;
    const diffX = startX - currentX; // Calcula a diferença entre a posição inicial e a atual

    if (Math.abs(diffX) > 50) { // Se o deslizar for maior que 50px
        if (diffX > 0) {
            // Deslizar para a esquerda
            moveCarousel(1, 'carousel1-babydolls');
        } else {
            // Deslizar para a direita
            moveCarousel(-1, 'carousel1-babydolls');
        }
        startX = null; // Reseta o início do toque
    }
}

document.getElementById('carousel1-babydolls').addEventListener('touchstart', handleTouchStart);
document.getElementById('carousel1-babydolls').addEventListener('touchmove', handleTouchMove);

     
     let currentIndex = 0; // Variável global para rastrear o índice da imagem atual

function moveCarousel(direction, carouselId) {
    const carousel = document.getElementById(carouselId);
    const inner = carousel.querySelector('.carousel-inner');
    const images = inner.querySelectorAll('img');
    const totalImages = images.length;

    // Atualiza o índice atual com base na direção
    currentIndex = (currentIndex + direction + totalImages) % totalImages;

    // Move o carrossel para a nova imagem
    inner.style.transform = `translateX(-${currentIndex * 100}%)`;
}


// Gerenciar a seleção de tamanhos
document.querySelectorAll('.size-button').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.parentElement.id;
        const sizeFieldId = `selectedSize${productId.replace('size', '')}`;
        document.getElementById(sizeFieldId).value = this.getAttribute('data-value');
        
        // Remove a classe 'selected' de todos os botões e adiciona apenas ao botão clicado
        document.querySelectorAll(`#${productId} .size-button`).forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
    });
});


function toggleCart() {
    var cartModal = document.getElementById('cartModal');
    cartModal.style.display = (cartModal.style.display === "block") ? "none" : "block";
}

function updateCartCount() {
    var cart = document.getElementById('cart');
    var items = cart.getElementsByTagName('li');
    var totalPieces = 0;
    var quantityRegex = /^(\d+) x/;

    for (var i = 0; i < items.length; i++) {
        var itemText = items[i].innerText;
        var match = itemText.match(quantityRegex);
        if (match) {
            var quantity = parseInt(match[1], 10);
            if (!isNaN(quantity)) {
                totalPieces += quantity;
            }
        }
    }

    var cartCount = document.getElementById('cart-count');
    cartCount.innerText = totalPieces;

    if (totalPieces > 20) {
        cartCount.classList.add('green-bg');
        cartCount.classList.remove('red-bg');
    } else {
        cartCount.classList.add('red-bg');
        cartCount.classList.remove('green-bg');
    }

    cartCount.style.display = totalPieces > 0 ? 'flex' : 'none';
}

let cart = []; // Define o array do carrinho fora das funções

function addToCart(productName, quantity, size, price) {
    // Verifica se o tamanho foi selecionado
    if (size === "" || size === undefined || size === null) {
        alert("Por favor, selecione um tamanho antes de adicionar ao pedido.");
        return;
    }

    // Adiciona ao carrinho
    const existingItemIndex = cart.findIndex(item => item.productName === productName && item.size === size);

    if (existingItemIndex >= 0) {
        // Atualiza a quantidade do item existente
        cart[existingItemIndex].quantity += parseInt(quantity);
    } else {
        // Adiciona um novo item ao carrinho
        const cartItem = { productName, quantity: parseInt(quantity), size, price };
        cart.push(cartItem);
    }

    updateCartDisplay();
}

function removeItemFromCart(productName, size) {
    cart = cart.filter(item => !(item.productName === productName && item.size === size));
    updateCartDisplay();
}

function clearCart() {
    cart = []; // Limpa o array do carrinho
    localStorage.removeItem('cart'); // Remove o carrinho do armazenamento local, se estiver usando
    updateCartDisplay(); // Atualiza a exibição do carrinho
}

function sendWhatsApp() {
    const baseURL = 'https://api.whatsapp.com/send?phone=+5585991336037&text=';
    const items = document.getElementById('cart').getElementsByTagName('li');

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const todayDate = formatDate(new Date());
    const message = Array.from(items)
        .map(item => {
            let itemText = item.innerText.trim();
            itemText = itemText.replace(/\s*[xX]\s*$/, '');
            return itemText;
        })
        .filter(text => text.length > 0)
        .join('\n');

    const fullMessage = `Data: ${todayDate}\n\n*Pedido:*\n\n${message}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    const url = `${baseURL}${encodedMessage}`;
    window.open(url, '_blank');
}

function saveAndShowCategory() {
    const categorySelect = document.getElementById('categorySelect');
    const selectedCategory = categorySelect.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    showCategory();
}

function showCategory() {
    const selectedCategory = localStorage.getItem('selectedCategory');
    document.querySelectorAll('.category').forEach(cat => cat.style.display = 'none');

    if (selectedCategory) {
        const categoryElement = document.getElementById(selectedCategory);
        if (categoryElement) {
            categoryElement.style.display = 'block';
        }
    }
}

function loadSelection() {
    const categorySelect = document.getElementById('categorySelect');
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        categorySelect.value = savedCategory;
    }
    showCategory();
}

window.onload = loadSelection;

function changeQuantity(id, change) {
    const input = document.getElementById(id);
    let quantity = parseInt(input.value);
    quantity = Math.max(1, quantity + change);
    input.value = quantity;
}

// Função para atualizar a exibição do carrinho
function updateCartDisplay() {
    const cartList = document.getElementById('cart');
    cartList.innerHTML = '';
    cart.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${item.quantity} x ${item.productName} (${item.size}) <button onclick="removeItemFromCart('${item.productName}', '${item.size}')">X</button>`;
        cartList.appendChild(listItem);
    });
    updateCartCount();
}
