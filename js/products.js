// Fetch de API Platzi
fetch('https://api.escuelajs.co/api/v1/products')
    .then(response => response.json())
    .then(data => {
        const productsContainer = document.getElementById('products-container');
        data.slice(0, 20).forEach(product => {
            const productCard = `
                <div class="col-md-4">
                    <div class="card mb-4 shadow-sm">
                        <img src="${product.images[0]}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>$${product.price}</strong></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button type="button" class="btn btn-sm btn-outline-secondary">Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += productCard;
        });
    })
    .catch(error => {
        console.log('Error fetching the products:', error);
    });