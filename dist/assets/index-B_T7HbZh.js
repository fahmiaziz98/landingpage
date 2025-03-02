(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const a of e.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function s(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(t){if(t.ep)return;t.ep=!0;const e=s(t);fetch(t.href,e)}})();let d=[],n=!1;async function p(){try{const o=await fetch("https://fakestoreapi.com/products");if(!o.ok)throw new Error("Network response was not ok");d=await o.json(),l(d,!1)}catch(o){console.error("Error fetching products:",o),document.getElementById("product-container").innerHTML=`
      <div class="error" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p>Failed to load products. Please try again later.</p>
      </div>
    `}}function l(o,r=!1){const s=document.getElementById("product-container");s.innerHTML="",(r?o:o.slice(0,5)).forEach(e=>{const a=document.createElement("div");a.className="product-card",a.dataset.id=e.id;let c="";e.price>100?c='<div class="product-tag">Premium</div>':e.rating&&e.rating.rate>=4.5?c='<div class="product-tag">Bestseller</div>':Math.random()>.7&&(c='<div class="product-tag">New</div>'),a.innerHTML=`
      <div class="product-image">
        <img src="${e.image}" alt="${e.title}">
        ${c}
      </div>
      <div class="product-info">
        <h3>${e.title}</h3>
        <p class="product-category">${e.category}</p>
        <p class="product-price">$${e.price.toFixed(2)}</p>
      </div>
    `,a.addEventListener("click",()=>{u(e.id)}),s.appendChild(a)});const t=document.querySelector(".view-all .btn");t&&(t.textContent=r?"Show Less":"View All Products")}async function u(o){try{const r=document.createElement("div");r.className="product-modal",r.innerHTML=`
      <div class="modal-content">
        <div class="modal-close">&times;</div>
        <div class="modal-body">
          <div class="loading">Loading product details...</div>
        </div>
      </div>
    `,document.body.appendChild(r),r.querySelector(".modal-close").addEventListener("click",()=>{document.body.removeChild(r)});const i=await fetch(`https://fakestoreapi.com/products/${o}`);if(!i.ok)throw new Error("Failed to fetch product details");const t=await i.json(),e=r.querySelector(".modal-body");e.innerHTML=`
      <div class="product-detail">
        <div class="product-detail-image">
          <img src="${t.image}" alt="${t.title}">
        </div>
        <div class="product-detail-info">
          <h2>${t.title}</h2>
          <p class="product-category">${t.category}</p>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-text">${t.rating.rate} (${t.rating.count} reviews)</span>
          </div>
          <p class="product-price">$${t.price.toFixed(2)}</p>
          <p class="product-description">${t.description}</p>
          <button class="btn primary add-to-cart">Add to Cart</button>
        </div>
      </div>
    `;const a=e.querySelector(".stars"),c=Math.round(t.rating.rate*2)/2;a.innerHTML=f(c),e.querySelector(".add-to-cart").addEventListener("click",()=>{alert(`${t.title} added to cart!`)})}catch(r){console.error("Error fetching product details:",r);const s=document.querySelector(".modal-body");s&&(s.innerHTML=`
        <div class="error">
          <p>Failed to load product details. Please try again later.</p>
        </div>
      `)}}function f(o){const r=Math.floor(o),s=o%1>=.5,i=5-r-(s?1:0);let t="";for(let e=0;e<r;e++)t+='<span class="star full">★</span>';s&&(t+='<span class="star half">★</span>');for(let e=0;e<i;e++)t+='<span class="star empty">☆</span>';return t}document.addEventListener("DOMContentLoaded",()=>{p();const o=document.querySelector(".view-all .btn");o&&o.addEventListener("click",r=>{r.preventDefault(),n=!n,l(d,n)})});
