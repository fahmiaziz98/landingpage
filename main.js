import './style.css';

// Global state to store all products
let allProducts = [];
let isViewingAll = false;

// Fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    allProducts = await response.json();
    displayProducts(allProducts, false); // Initially show only 5 products
  } catch (error) {
    console.error('Error fetching products:', error);
    document.getElementById('product-container').innerHTML = `
      <div class="error" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p>Failed to load products. Please try again later.</p>
      </div>
    `;
  }
}

// Display products in the product grid
function displayProducts(products, viewAll = false) {
  const productContainer = document.getElementById('product-container');
  
  // Clear container
  productContainer.innerHTML = '';
  
  // Determine how many products to display
  const displayProducts = viewAll ? products : products.slice(0, 5);
  
  displayProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.id = product.id;
    
    // Determine if product should have a tag
    let tagHtml = '';
    if (product.price > 100) {
      tagHtml = '<div class="product-tag">Premium</div>';
    } else if (product.rating && product.rating.rate >= 4.5) {
      tagHtml = '<div class="product-tag">Bestseller</div>';
    } else if (Math.random() > 0.7) {
      tagHtml = '<div class="product-tag">New</div>';
    }
    
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
        ${tagHtml}
      </div>
      <div class="product-info">
        <h3>${product.title}</h3>
        <p class="product-category">${product.category}</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
      </div>
    `;
    
    // Add click event to show product details
    productCard.addEventListener('click', () => {
      showProductDetails(product.id);
    });
    
    productContainer.appendChild(productCard);
  });

  // Update the View All button text
  const viewAllBtn = document.querySelector('.view-all .btn');
  if (viewAllBtn) {
    viewAllBtn.textContent = viewAll ? 'Show Less' : 'View All Products';
  }
}

// Function to show product details
async function showProductDetails(productId) {
  try {
    // Show loading state
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-close">&times;</div>
        <div class="modal-body">
          <div class="loading">Loading product details...</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Add close functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Fetch specific product details
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    
    const product = await response.json();
    
    // Update modal with product details
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-image">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-detail-info">
          <h2>${product.title}</h2>
          <p class="product-category">${product.category}</p>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-text">${product.rating.rate} (${product.rating.count} reviews)</span>
          </div>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <p class="product-description">${product.description}</p>
          <button class="btn primary add-to-cart">Add to Cart</button>
        </div>
      </div>
    `;
    
    // Style the stars to show the correct rating
    const starsElement = modalBody.querySelector('.stars');
    const rating = Math.round(product.rating.rate * 2) / 2; // Round to nearest 0.5
    starsElement.innerHTML = getStarRating(rating);
    
    // Add to cart functionality
    const addToCartBtn = modalBody.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      alert(`${product.title} added to cart!`);
    });
    
  } catch (error) {
    console.error('Error fetching product details:', error);
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="error">
          <p>Failed to load product details. Please try again later.</p>
        </div>
      `;
    }
  }
}

// Helper function to generate star rating HTML
function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<span class="star full">★</span>';
  }
  
  // Add half star if needed
  if (halfStar) {
    starsHtml += '<span class="star half">★</span>';
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<span class="star empty">☆</span>';
  }
  
  return starsHtml;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  
  // Add event listener to View All button
  const viewAllBtn = document.querySelector('.view-all .btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isViewingAll = !isViewingAll;
      displayProducts(allProducts, isViewingAll);
    });
  }
});