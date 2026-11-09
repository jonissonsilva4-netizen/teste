const products = [
  {id:1,name:"Caminha Nuvem",category:"Conforto",price:129.90,tag:"MAIS AMADO",image:"https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Brinquedo Mordedor",category:"Brinquedos",price:39.90,tag:"DIVERSÃO",image:"https://images.unsplash.com/photo-1535294435445-d7a1ac5c7e9b?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Kit Potes Pet",category:"Acessórios",price:59.90,tag:"PRÁTICO",image:"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Bolinha Divertida",category:"Brinquedos",price:24.90,tag:"QUERIDINHO",image:"https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Coleira Confortável",category:"Acessórios",price:49.90,tag:"ESTILOSA",image:"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Arranhador de Gato",category:"Gatos",price:89.90,tag:"GATEIRO",image:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Passeio com Estilo",category:"Cães",price:69.90,tag:"PASSEIO",image:"https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Kit Higiene Pet",category:"Cuidados",price:44.90,tag:"CUIDADO",image:"https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80"}
];
const cart = [];
const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const grid = document.querySelector("#product-grid");
const cartCount = document.querySelector("#cart-count");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const drawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#overlay");
let toastTimer;
function renderProducts(list=products){
  grid.innerHTML = list.map(p=>`<article class="product-card"><span class="product-tag">${p.tag}</span><div class="product-photo"><img src="${p.image}" alt="${p.name}" loading="lazy"></div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-button" data-add="${p.id}" aria-label="Adicionar ${p.name} ao carrinho">+</button></div></div></article>`).join("");
}
function notify(message){
  const toast=document.querySelector("#toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.quantity,0);
  const total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  cartCount.textContent=count;cartTotal.textContent=money(total);
  cartItems.innerHTML=cart.length?cart.map(item=>`<div class="cart-line"><img src="${item.image}" alt=""><div><strong>${item.name}</strong><small>${item.quantity} × ${money(item.price)}</small></div><button class="remove-item" data-remove="${item.id}">Remover</button></div>`).join(""):'<p class="empty-cart">Seu carrinho está vazio. Que tal escolher um mimo? 🐾</p>';
}
function openCart(){drawer.classList.add("open");overlay.classList.add("active");drawer.setAttribute("aria-hidden","false");}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("active");drawer.setAttribute("aria-hidden","true");}
grid.addEventListener("click",event=>{
  const button=event.target.closest("[data-add]");if(!button)return;
  const product=products.find(p=>p.id===Number(button.dataset.add));const existing=cart.find(p=>p.id===product.id);
  if(existing)existing.quantity++;else cart.push({...product,quantity:1});
  renderCart();notify(product.name+" adicionado à sacolinha!");
});
cartItems.addEventListener("click",event=>{
  const button=event.target.closest("[data-remove]");if(!button)return;
  const index=cart.findIndex(p=>p.id===Number(button.dataset.remove));if(index>-1)cart.splice(index,1);renderCart();
});
document.querySelector("#open-cart").addEventListener("click",openCart);
document.querySelector("#close-cart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeCart();});
document.querySelectorAll("[data-category]").forEach(link=>link.addEventListener("click",()=>{
  const category=link.dataset.category;
  const filtered=category==="Cães"?products.filter(p=>p.category==="Cães"):category==="Gatos"?products.filter(p=>p.category==="Gatos"):category==="Brinquedos"?products.filter(p=>p.category==="Brinquedos"):products.filter(p=>p.category==="Cuidados");
  renderProducts(filtered.length?filtered:products);
}));
document.querySelector("#show-all").addEventListener("click",()=>renderProducts(products));
document.querySelector("#checkout").addEventListener("click",()=>{
  if(!cart.length){notify("Sua sacolinha ainda está vazia.");return;}
  const phone=prompt("Para receber os pedidos, informe o WhatsApp da loja com DDI e DDD (somente números).");
  if(!phone)return;
  const digits=phone.replace(/\D/g,"");
  if(digits.length<10){notify("Confira o número do WhatsApp e tente novamente.");return;}
  const lines=cart.map(item=>`• ${item.name} (x${item.quantity}) — ${money(item.price*item.quantity)}`).join("\n");
  const total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const message=encodeURIComponent("Olá! Gostaria de fazer este pedido:\n\n"+lines+"\n\nTotal dos produtos: "+money(total)+"\nComo funciona a entrega?");
  window.open("https://wa.me/"+digits+"?text="+message,"_blank","noopener");
});
document.querySelector("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();