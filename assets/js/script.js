let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//  LISTAGEM DAS PIZZAS

pizzaJson.map((item, index)=> { //item refere-se às pizzas; index é o número do array.
    let pizzaItem = c('.models .pizza-item').cloneNode(true);//cloneNode clona o item e "true" inclui e clonas as informações presentes em pizzaItem também.
    
    //preencheu as divs com as informações presentes no array pizzaJason.
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{  //adicona-se um evento para bloquear o reload ao clicar na pizza
        e.preventDefault(); //'click' informa o evento o tipo de ação que terá; o segundo parâmetro(em forma de função) será a ação, que no caso é previnir a ação padrão(atualizar). A primeira função.
        let key = e.target.closest('.pizza-item').getAttribute('data-key');//target.closest() procura o elemento mais próximo que contenha as informações dentro dos parênteses; getAttribute pega o elemento data-key, que contem as chaves das pizzas.
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{

            if(sizeIndex==2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = "flex";
        setTimeout(()=>{    //muda a opacidade de 0 para 1, em 1/5 de segundo
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });
    
    c('.pizza-area').append(pizzaItem);//append pega o conteúdo em pizza-area e adiciona mais informações, mais conteúdo;
});


//  EVENTOS DO MODAL

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = "none";
    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//quantidade de pizzas
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt > 1){
        modalQt--;;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//selecionar o tamanho das pizzas
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click',()=>{
    let size =  parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click',() =>{
    if(cart.length > 0) {
        c('aside').style.left = 0;
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})

// mostrar carrinho de compras
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subTotal += pizzaItem.price * cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subTotal * 0.1;
        total = subTotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}` ;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}` ;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}` ;

    }else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

// === CONFIG ===
const COMPANY_WHATSAPP = "5585996104553"; // DDI+DDD+NUMERO (só números). Ex: 55 88 99999-9999

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem("pizza_user") || "null");
  } catch {
    return null;
  }
}

function buildOrderMessage() {
  const user = getLoggedUser();
  const name = user?.name || "Cliente";
  const phone = user?.phone || "não informado";

  let lines = [];
  lines.push("🍕 *Novo pedido*");
  lines.push(`👤 Nome: ${name}`);
  lines.push(`📱 Contato: ${phone}`);
  lines.push("");
  lines.push("*Itens:*");

  let subTotal = 0;

  cart.forEach((ci) => {
    const pizza = pizzaJson.find((p) => p.id == ci.id);
    if (!pizza) return;

    const sizeLabel = ci.size === 0 ? "P" : ci.size === 1 ? "M" : "G";
    const itemTotal = pizza.price * ci.qt;
    subTotal += itemTotal;

    lines.push(`- ${pizza.name} (${sizeLabel}) x${ci.qt} — R$ ${itemTotal.toFixed(2)}`);
  });

  const desconto = subTotal * 0.1;
  const total = subTotal - desconto;

  lines.push("");
  lines.push(`Subtotal: R$ ${subTotal.toFixed(2)}`);
  lines.push(`Desconto: R$ ${desconto.toFixed(2)}`);
  lines.push(`Total: R$ ${total.toFixed(2)}`);
  lines.push("");
  lines.push("✅ Pode confirmar o pedido, por favor?");

  return lines.join("\n");
}

function goToWhatsAppCheckout() {
  const user = getLoggedUser();
  if (!user) {
    // agora o login é index.html
    window.location.href = "./index.html";
    return;
  }

  if (!cart.length) return;

  const text = encodeURIComponent(buildOrderMessage());
  const url = `https://wa.me/${COMPANY_WHATSAPP}?text=${text}`;
  window.open(url, "_blank");
}

// clique no finalizar (só se existir na página)
const finalizarBtn = document.querySelector(".cart--finalizar");
if (finalizarBtn) {
  finalizarBtn.addEventListener("click", goToWhatsAppCheckout);
}