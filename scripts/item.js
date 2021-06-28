
// a function to display the selected item from the catalogue
function displaySelectedItem () {
  // load the catalogue and the selected-Item from the storage
  const catalogue = JSON.parse(sessionStorage.getItem('catalogue'))
  const itemID = JSON.parse(sessionStorage.getItem('selectedItemIndex'))
  // retrive the item based on it's id (index)
  const item = catalogue[Number(itemID)]

  // retrive the name element and update it
  const itemName = document.getElementById('itemName')
  itemName.innerHTML = item.name

  // retrive the item div
  const itemDiv = document.getElementById('item')
  // create a row div
  const adiv = document.createElement('div')
  adiv.setAttribute('class', 'row')

  // create a div element for the item image
  const imgDiv = document.createElement('div')
  imgDiv.setAttribute('class', 'col-8 float-left')

  // create an image element and give it the path to the image
  const img = document.createElement('img')
  img.setAttribute('src', item.image)
  img.setAttribute('class', 'card-img-top img-fluid')
  img.setAttribute('alt', item.name)

  // create a div element for text
  const tetxDiv = document.createElement('div')
  tetxDiv.setAttribute('class', 'col-4 float-right')
  tetxDiv.style.marginTop = '50px'

  // create a h4 lement for the item name
  const cardTitle = document.createElement('h4')
  cardTitle.setAttribute('class', 'card-title')
  cardTitle.innerHTML = item.name

  // create a p lement for the item type and number of avaiable colours
  const descriptionP = document.createElement('p')
  descriptionP.innerHTML = item.type + ' (' + item.numberOfColours + ')'

  // create a p lement for the item price
  const priceP = document.createElement('p')
  priceP.innerHTML = 'R ' + item.price

  // add to cart button
  const button = document.createElement('button')
  button.setAttribute('class', 'btn btn-outline-secondary')
  button.setAttribute('onclick', 'addToCart(event)')
  button.setAttribute('id', String(itemID))

  // add to cart icon
  const cartIcon = document.createElement('i')
  cartIcon.setAttribute('class', 'fas fa-shopping-cart')
  cartIcon.setAttribute('id', String(itemID))
  cartIcon.innerHTML = 'ADD TO CART'

  // put the icon inside the button
  button.appendChild(cartIcon)

  // put the image inside the image container
  imgDiv.appendChild(img)

  // put the item details inside the text div (including the add to cart button)
  tetxDiv.appendChild(cardTitle)
  tetxDiv.appendChild(descriptionP)
  tetxDiv.appendChild(priceP)
  tetxDiv.appendChild(button)

  // add the image div and text div
  adiv.appendChild(imgDiv)
  adiv.appendChild(tetxDiv)

  // add the div to the item div
  itemDiv.appendChild(adiv)
}

$(document).ready(function () {
  // display the selected item
  displaySelectedItem()
})
