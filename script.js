const menu = document.querySelector('#menu');
const cartBtn = document.querySelector('#cart-btn');
const cartModal = document.querySelector('#cart-modal');
const cartItemsContainer = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const checkoutBtn = document.querySelector('#checkout-btn');
const closeModalBtn = document.querySelector('#close-modal-btn');
const cartCounter = document.querySelector('#cart-count');
const addressInput = document.querySelector('#address');
const addressWarn = document.querySelector('#address-warn');

let cart = [];

cartBtn.addEventListener('click', function(){
    updateCartModal();
    cartModal.style.display = 'flex'
})

cartModal.addEventListener('click', function(event){
    if(event.target=== cartModal){
        cartModal.style.display='none'
    }
})

closeModalBtn.addEventListener('click', function(){
    cartModal.style.display='none'
})

menu.addEventListener('click', function(event){
    let parentButton = event.target.closest('.add-to-cart-btn')

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        addToCart(name, price)
    }
})

function addToCart(name, price){

const existinItem= cart.find(item => item.name === name);

if(existinItem){
    existinItem.quantity += 1;
    
} else{
    cart.push({
        name,
        price,
        quantity:1,
    })
}

    updateCartModal()

}

function updateCartModal(){
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")


        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between" >
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2).replace('.' , ',')}</p>
            </div>

            
            <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
            

            </div>
        `
        total += item.price * item.quantity
        cartItemsContainer.appendChild(cartItemElement);

    })
    
    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: 'currency',
        currency: 'BRL'
    })

    cartCounter.innerHTML = cart.length;
    
}

cartItemsContainer.addEventListener('click', function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute('data-name')

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity--
            updateCartModal();
            return;
        }

        cart.splice(index, 1)
        updateCartModal();

    }

}

addressInput.addEventListener('input', function (event){
    let inputValue = event.target.value;
    if(inputValue){
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
    }
    
})

checkoutBtn.addEventListener('click', function(){

    const isOpen = checkRestaurantOpen();

    if(cart.length===0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();

        return;
    }

    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |\n`
        )
    }).join("")

    const message = encodeURIComponent(cartItems);
    const phone = "16991342553"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
    
    cart.length=0;
    updateCartModal();

})

function checkRestaurantOpen(){
    const data= new Date();
    const hora = data.getHours();
    return hora >=18 && hora < 22;
}

const spanItem = document.querySelector('#date-span');
const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
}else{
    spanItem.classList.add('bg-red-500');
    spanItem.classList.remove('bg-green-600');
}