// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC3WxZBaNJoZA2p7oe6ihTJCFOE6Y0U_7Q",
    authDomain: "dropshipping-98eb5.firebaseapp.com",
    projectId: "dropshipping-98eb5",
    storageBucket: "dropshipping-98eb5.appspot.com",
    messagingSenderId: "904925867242",
    appId: "1:904925867242:web:af0abda866826e92f8fb93",
    measurementId: "G-BVZR8HY1SR"
};
// Initialize Firebase

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Fetch products from Firebase
function fetchProducts() {
    const productsRef = firebase.database().ref('products');
    productsRef.on('value', (snapshot) => {
        const products = snapshot.val();
        displayProducts(products);
    });
}

// Display products as cards
function displayProducts(products) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';

    for (let key in products) {
        const product = products[key];
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <div class="actions">
                <button onclick="editProduct('${key}')">Edit</button>
                <button onclick="deleteProduct('${key}')">Delete</button>
            </div>
        `;

        productsContainer.appendChild(card);
    }
}

// Search functionality
function searchProducts(query) {
    const cards = document.querySelectorAll('.card');
    query = query.toLowerCase();

    cards.forEach(card => {
        const name = card.querySelector('h2').textContent.toLowerCase();
        if (name.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchBar').value;
    searchProducts(query);
});

// Delete product
function deleteProduct(productId) {
    const productRef = firebase.database().ref(`products/${productId}`);
    productRef.remove()
        .then(() => {
            alert('Product deleted successfully!');
            fetchProducts();
        })
        .catch(error => {
            console.error('Error deleting product:', error);
        });
}

// Edit product (open modal)
function editProduct(productId) {
    const productRef = firebase.database().ref(`products/${productId}`);
    productRef.once('value').then((snapshot) => {
        const product = snapshot.val();
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productLink').value = product.link;

        document.getElementById('editModal').style.display = 'block';

        document.getElementById('saveButton').onclick = () => saveProduct(productId);
    });
}

// Save edited product
function saveProduct(productId) {
    const updatedProduct = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        link: document.getElementById('productLink').value,
    };

    const productRef = firebase.database().ref(`products/${productId}`);
    productRef.update(updatedProduct)
        .then(() => {
            alert('Product updated successfully!');
            closeModal();
            fetchProducts();
        })
        .catch(error => {
            console.error('Error updating product:', error);
        });
}

// Close the modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Fetch products when the page loads
fetchProducts();
