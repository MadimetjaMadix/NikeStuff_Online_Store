// main script for common functions across pages

// a function to add items to the cart
function addToCart (event) {
  // load the cart from the storage
  const cart = JSON.parse(sessionStorage.getItem('cart'))
  // add the ID of the selected item to the cart
  cart.push(event.target.id)
  // store the cart in the storage
  sessionStorage.setItem('cart', JSON.stringify(cart))

  if (cart.length === 0) {
    // hide cart notification if the cart is empty
    $('#cartCounter').css({ visibility: 'hidden' })
  } else {
    // show the animated cart notification if it is not empty (with the cart length being the notification number)
    $('#cartCounter').css({ visibility: 'visible' })
    $('#cartCounter').text(String(cart.length)).animate({ fontSize: '2em' }, 300).animate({ fontSize: '1em' }, 250).animate({ fontSize: '1.5em' }, 200).animate({ fontSize: '1em' }, 100)

    // laad the catalogue
    catalogue = JSON.parse(sessionStorage.getItem('catalogue'))
    let total = 0
    // calculate the total of all the cart items
    cart.forEach(index => {
      const price = catalogue[Number(index)].price.split(' ').join('')
      total = eval(total + '+' + price)
      total = total.toFixed(2)
    })
    // store the updated total
    sessionStorage.setItem('cartTotal', JSON.stringify(total))
    $('#cartTotal').text(total)
    // display the total of the cart as an alert
    alert(`Your cart total is currently R ${total}`)
  }
}

$(document).ready(function () {
  // cart notification
  if (sessionStorage.getItem('cart') === null) {
    // hide notification if cart doesnt exist
    $('#cartCounter').css({ visibility: 'hidden' })
  } else {
    // load cart
    const cart = JSON.parse(sessionStorage.getItem('cart'))
    const cartTotal = JSON.parse(sessionStorage.getItem('cartTotal'))
    $('#cartTotal').text(cartTotal)

    if (cart.length === 0) {
      // hide notification if cart is empty
      $('#cartCounter').css({ visibility: 'hidden' })
    } else {
      // show notification if cart is not empty
      $('#cartCounter').css({ visibility: 'visible' })
      $('#cartCounter').text(String(cart.length))
    }
  }

  // Drop down section to show the cart total when you hover over the cart
  $('#accordion').accordion({
    event: 'mouseover',
    collapsible: true,
    active: false
  }).on('mouseleave', function () {
    $(this).accordion('option', 'active', false)
  })
})
