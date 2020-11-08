// In-Class 5 by Zion "Sean" Ko - 11/07/20

// ADD NEW ITEM TO END OF LIST
// create element then create word, then append the word in element as a node,
// then append the word at the end of the listing
var listing = document.getElementsByTagName('ul')[0]; // to access ul
var newItemEndList = document.createElement('li');
var newWordEnd = document.createTextNode('cream');
newItemEndList.appendChild(newWordEnd);
listing.appendChild(newItemEndList);

// ADD NEW ITEM START OF LIST
// create element then create word, then insert the word in element as a node,
// then insert the word at the start of the list.
var newItemStart = document.createElement('li');
var newWordStart = document.createTextNode('kale');
newItemStart.appendChild(newWordStart);
listing.insertBefore(newItemStart, listing.firstChild);

// ADD A CLASS OF COOL TO ALL LIST ITEMS
// loop to make every thing green by changing all class  cool
var itemList = document.querySelectorAll('li'); // to access the li
var i;
for (i = 0; i < itemList.length; i++) {
  itemList[i].className = 'cool';
}

// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
// number of item would be just length of the list
// so make a new heading by appending the length of the list at the current heading
var heading = document.querySelector('h2');  // access h2
var newHeading =  heading.firstChild.nodeValue + '<span>' + itemList.length + '</span>';
heading.innerHTML = newHeading; // now new heading will be the heading.
