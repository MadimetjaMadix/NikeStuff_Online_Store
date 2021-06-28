
// a list of available coupons
const DiscoutCoupons = ['05OFF', '10OFF', '10OFF', '20OFF', '25OFF']

// a list of delivery options
const DeliveryChoices = [{ name: 'Standard (R70)', price: '70.00' }, { name: 'Fast (R120)', price: '120.00' }]

// a global variable for the cart total
let total = 0

// a function to handle the change in the quantity input field
function handleQuantityChange (input) {
  // make sure the minimum value is 1
  if (input.value < 1) input.value = 1
  // make sure the maximum value is 10
  if (input.value > 10) input.value = 10

  // get the id(index of item with the modified quantity)
  const id = input.id[input.id.length - 1]
  // get price element using the id and retrive the price
  const priceEl = document.getElementById('price' + id)
  let price = priceEl.innerHTML
  price = price.substring(1).split(' ').join('') // remove any spaces from the text
  price = eval(price + '*' + input.value) // multiply the price by the new quantity value (input)
  price = price.toFixed(2) // fix it to 2 decimal places

  // get the price-tag element based on the id and update the price with the new price
  const priceTag = document.getElementById('pricetag' + id)
  priceTag.innerHTML = String(price)

  // re-calculate the cart total
  getCartTotal()
}

// a function to appy the coupon if it is enterd
function applyCoupon (total) {
  // get the coupon input element
  const input = document.getElementById('coupon')

  // check if the entered coupon is in the coupon list
  if (DiscoutCoupons.includes(input.value)) {
    // get the percentage
    const percentage = input.value.substring(0, 2)
    // calculate the discount
    const discount = eval(`${total} * (${percentage}/100)`)
    // calculate the new total
    total = eval(`${total} - ${discount}`)
    total = total.toFixed(2)// fix it to 2 decimal places

    // show the discount value and update it
    $('#discount').css({ visibility: 'visible' })
    $('#discount').text(`discount (${percentage}%): - R ${discount.toFixed(2)}`)
  } else {
    // hide the discount value
    $('#discount').css({ visibility: 'hidden' })
  }
  // return the new total
  return total
}

// a function to calculate the total of the cart
function getCartTotal () {
  // get all the cart prices based on the class name
  const cartPrices = document.getElementsByClassName('price')
  total = 0 // initialise the total

  // calculate the total by adding all the prices to the total
  for (var price of cartPrices) {
    price = price.innerHTML.split(' ').join('')// remove any spaces from the text
    total = eval(total + '+' + price) // add to total
    total = total.toFixed(2) // fix to 2 decimal places
  }
  // claculate the VAT which is 15% from the total(all prices incled vat)
  const VAT = eval(`${total} * 0.15`).toFixed(2)
  // calculate the total without vat
  const subTotal = (total - VAT).toFixed(2)

  // get the new total if the coupon is applied
  total = applyCoupon(total)

  // update the cart total accordion
  sessionStorage.setItem('cartTotal', JSON.stringify(total))
  $('#cartTotal').text(total)
  // update the text field of the VAT,Sub-total and Total
  $('#totalCartPrice').text('Total (VAT included): R ' + String(total))
  $('#subtotalCartPrice').text('Sub Total (Without VAT): R ' + String(subTotal))
  $('#VAT').text('(VAT 15%): R ' + String(VAT))
}

// the checkout function
function checkout () {
  // retrive the cart
  var cart = JSON.parse(sessionStorage.getItem('cart'))

  // calculate the reference number
  // [multiply the current date-time with a random number ] - [add the indexes of the cart items]
  var refNum = (Date.now() * Math.random()).toFixed(0) + '-' + cart.join('')

  // alert the reference number
  alert(`Your order has been placed.\n Your reference number is : ${refNum}.\n Thank you for your parchase, \n Come back soon`)
  // clear cart
  cart = []
  // update the cart in storage
  sessionStorage.setItem('cart', JSON.stringify(cart))
  // go to home page
  location.replace('../index.html')

  // clear cat total
  sessionStorage.setItem('cartTotal', JSON.stringify('0.00'))
  $('#cartTotal').text('0.00')
}

// a function to display delivery options
function displayDeliveryOptions () {
  // get the dropdown div element
  var dropdownDiv = document.getElementById('options')
  dropdownDiv.innerHTML = 'Delivery Options :'

  // create a dropdown menu using the select element
  var selectEl = document.createElement('select')
  selectEl.setAttribute('id', 'deliveryOptions')
  selectEl.setAttribute('onchange', 'getDeliveryOption()') // call the function getDeliveryOption() on-change

  // the delivery option as options to the dropdown menu
  DeliveryChoices.forEach(choice => {
    var optionEl = document.createElement('option')
    optionEl.innerHTML = choice.name
    optionEl.setAttribute('value', choice.price)
    selectEl.appendChild(optionEl)
  })

  // add the drop-down menu to the div
  dropdownDiv.appendChild(selectEl)
}

// a function to handle the change in delivery option
function getDeliveryOption () {
  // get the options
  const dropOptions = document.getElementById('deliveryOptions')
  // get the text of the selectd option
  const selectedOption = dropOptions.options[dropOptions.selectedIndex].innerHTML
  // get the value of the selected option
  const selectedOptionPrice = dropOptions.options[dropOptions.selectedIndex].value

  // update the delivery option text
  const optionId = document.getElementById('delveryOption')
  optionId.innerHTML = `Delivery: ${selectedOption}`
  // update the delivery option price
  const optionPrice = document.getElementById('optionPrice')
  optionPrice.innerHTML = selectedOptionPrice

  // re-calculate the cart total
  getCartTotal()
}

// a function to display the delivery options
function deliveryOption () {
  // get the radio value
  const radioValue = $("input[name='CollectOrDeliver']:checked").val()

  // check for the option selected (0: collect & 1: delivery)
  if (radioValue === '0') {
    // update the delivery option text to collect
    const optionId = document.getElementById('delveryOption')
    optionId.innerHTML = 'Collect'
    // update the delivery option price to R 0.00
    const optionPrice = document.getElementById('optionPrice')
    optionPrice.innerHTML = '0.00'

    // clear the delivery options dropdown menu
    const dropdownDiv = document.getElementById('options')
    dropdownDiv.innerHTML = ''
  } else {
    // else the delivery option is selected
    displayDeliveryOptions()
    // displays the defult delivery option
    getDeliveryOption()
  }
  // re-calculate the cart total
  getCartTotal()
}

// a function to display a cart item
function displayItem (item, id) {
  // get the cart items div
  const cartItemsDiv = document.getElementById('cartItems')

  // create a row div
  const divRow = document.createElement('div')
  divRow.setAttribute('class', 'col-10 item row')

  // create a div for the item image
  const divImg = document.createElement('div')
  divImg.setAttribute('class', 'col-2')

  // create the image for the item
  const img = document.createElement('img')
  img.setAttribute('src', item.image)
  img.setAttribute('height', '150px')

  // add the image to the image div
  divImg.appendChild(img)

  // create a details div
  const divDetails = document.createElement('div')
  divDetails.setAttribute('class', 'col-6')

  // create a h4 element for the card-title = item name
  const nameH4 = document.createElement('h4')
  nameH4.innerHTML = item.name

  // create a p lement for the item type and number of avaiable colours
  const descriptionP = document.createElement('p')
  descriptionP.innerHTML = item.type + ' (' + item.numberOfColours + ')'

  // create a p lement for the item price
  const priceP = document.createElement('p')
  priceP.setAttribute('id', 'price' + id)
  priceP.innerHTML = 'R ' + item.price

  // add the details (name, description and price) to the details div
  divDetails.appendChild(nameH4)
  divDetails.appendChild(descriptionP)
  divDetails.appendChild(priceP)

  // create a price div
  const divPrice = document.createElement('div')
  divPrice.setAttribute('class', 'col-2')

  // create a lable for the Qualtity input field
  const lable = document.createElement('lable')
  lable.setAttribute('for', '#quantity' + id)
  lable.innerHTML = 'Quantity'

  // create an imput number field for the quantity
  const quantityInput = document.createElement('input')
  quantityInput.setAttribute('type', 'number')
  quantityInput.setAttribute('name', 'quantity')
  quantityInput.setAttribute('id', 'quantity' + id)
  quantityInput.setAttribute('placeholder', '1') // defult value
  quantityInput.setAttribute('onchange', 'handleQuantityChange(this)') // onchange handle function

  // create a h5 element for the price text(lable)
  const priceLable = document.createElement('h5')
  priceLable.innerHTML = 'Price : R '

  // create a span for the price display field
  const price = document.createElement('span')
  price.setAttribute('id', 'pricetag' + id)
  price.setAttribute('class', 'price')
  price.innerHTML = item.price

  // add the price display field to the lable
  priceLable.appendChild(price)

  // create a remove from cart button
  const removeButton = document.createElement('button')
  removeButton.setAttribute('class', 'btn btn-outline-secondary')
  removeButton.setAttribute('onclick', 'removeFromCart(this)') // function handler on click
  removeButton.setAttribute('id', id)

  // create a trash icon for the remove-button
  const trashIcon = document.createElement('i')
  trashIcon.setAttribute('class', 'fas fa-trash-alt')
  trashIcon.innerHTML = 'Remove'

  // add the icon to the button
  removeButton.appendChild(trashIcon)

  // add ellements to the price div
  divPrice.appendChild(lable)
  divPrice.appendChild(quantityInput)
  divPrice.appendChild(priceLable)
  divPrice.appendChild(removeButton)

  // add all the item's details (image, details and price) to a row div
  divRow.appendChild(divImg)
  divRow.appendChild(divDetails)
  divRow.appendChild(divPrice)

  // and the row div to the cart items div
  cartItemsDiv.appendChild(divRow)
}

// a function to display cart items
function displayCartItems () {
  // get cart items div and clear it
  const cartItemsDiv = document.getElementById('cartItems')
  cartItemsDiv.innerHTML = ''

  // retrive the cart and the catalogue fro storage
  const cart = JSON.parse(sessionStorage.getItem('cart'))
  const catalogue = JSON.parse(sessionStorage.getItem('catalogue'))

  // check if the cart is not empty
  if (cart.length !== 0) {
    let id = 0 // initiaise the id
    // iterate through the cart list
    cart.forEach(index => {
      // retrive the item object based on the index
      const item = catalogue[Number(index)]
      // display the item
      displayItem(item, id)
      // increment the id
      id++
    })

    // display the checkout div
    $('#checkoutDiv').css({ visibility: 'visible' })
    // get the total div and clear it
    const divTotal = document.getElementById('divTotal')
    divTotal.innerHTML = ''

    // create a h5 elemnt for the sub-total
    const subTotal = document.createElement('h5')
    subTotal.setAttribute('id', 'subtotalCartPrice')
    subTotal.style.textAlign = 'right'

    // create a h5 elemnt for the VAT
    const VATtotal = document.createElement('h5')
    VATtotal.setAttribute('id', 'VAT')
    VATtotal.style.textAlign = 'right'

    // create a h5 elemnt for the discount
    const discount = document.createElement('h5')
    discount.setAttribute('id', 'discount')
    discount.style.textAlign = 'right'
    discount.style.color = 'green'

    // create a h4 elemnt for the total
    const total = document.createElement('h4')
    total.setAttribute('id', 'totalCartPrice')
    total.style.textAlign = 'right'

    // create a check-out button
    const checkOutButton = document.createElement('button')
    checkOutButton.setAttribute('class', 'btn btn-outline-secondary')
    checkOutButton.setAttribute('onclick', 'checkout()') // handler function on click
    checkOutButton.setAttribute('id', 'checkOutButton')
    checkOutButton.style.float = 'right'
    checkOutButton.style.color = 'green'

    // create a cart icon
    const cartIcon = document.createElement('i')
    cartIcon.setAttribute('class', 'fas fa-shopping-cart')
    cartIcon.innerHTML = ' CHECKOUT'

    // add the icon the button
    checkOutButton.appendChild(cartIcon)

    // apped to the total div
    divTotal.appendChild(subTotal)
    divTotal.appendChild(VATtotal)
    divTotal.appendChild(discount)
    divTotal.appendChild(total)
    divTotal.appendChild(checkOutButton)

    // calculate the total & display it
    getCartTotal()
  } else {
    // hide notification and checkout div if cart is empty
    $('#checkoutDiv').css({ visibility: 'hidden' })
    $('#cartCounter').css({ visibility: 'hidden' })

    // if cart empty, clear the cart items div
    cartItemsDiv.innerHTML = ''
    // create a h4 element to display the 'cart empty' text
    const text = document.createElement('h4')
    text.setAttribute('class', 'text-center')
    text.innerHTML = 'Cart Empty'
    // add the text to the cart items div
    cartItemsDiv.appendChild(text)
  }
}

// a function to remove items from cart
function removeFromCart (item) {
  // get the cart list
  const cart = JSON.parse(sessionStorage.getItem('cart'))
  // remove the @index = id, one item
  cart.splice(item.id, 1)

  // update cart notification
  if (cart.length === 0) {
    // hide notification and checkout div if cart is empty
    $('#cartCounter').css({ visibility: 'hidden' })
    $('#checkoutDiv').css({ visibility: 'hidden' })
  } else {
    // show animated notification and checkout div if cart is not empty
    $('#cartCounter').css({ visibility: 'visible' })
    $('#cartCounter').text(String(cart.length)).animate({ fontSize: '0em' }, 300).animate({ fontSize: '1em' }, 100)
    $('#checkoutDiv').css({ visibility: 'visible' })
  }
  // store cart
  sessionStorage.setItem('cart', JSON.stringify(cart))
  // display the updated cart list
  displayCartItems()
}

$(document).ready(function () {
  // display cart items
  displayCartItems()
})
