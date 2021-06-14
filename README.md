# Flag
A Javascript object that assigns multiple booleans to bits in an integer.

## Background
I was working for a company that sells their products online (on different plarforms) and I was in charge for one of the platforms. So among other things, I needed to transfer our products data to servers and use that data for assignement to the relevant categories. I didn't have much freedom in terms of information I could use for myself but I was allowed to use a couple of labels (strings that were not automatically pubished with the rest of the fields). So I decided to use a set of flags for one of those labels, basically booleans combined and expressed as bits in an integer. It has the advantage of being lightweight to transfer and easy to read and write. It also gives tools to process many flags rapidly. I think / hope this simple project can be useful to someone else.

## How to use?

Provide keys / labels as strings in a Javascript array.

Use that array as the unique parameter.

```javascript
const labels = ["outOfStock", "onSale", "backOrder", "newItem", "discontinued"];
const productsFlag = new Flag(labels);
```
The index of the keys (strings in the array) is what determines the bit associated with each of them.

In this example:

"outOfStock" = 1 when true,

"onSale" = 2,

"backOrder" = 4 etc.

Values can be read / assigned in a couple of ways:

```javascript
// This will set productsFlag.value to 2 (if all others are false)
productsFlag.onSale = true;

// This will set "outOfStock" (1), "onSale" (2) and "backOrder" (4) to true => 4 + 2 + 1 = 7
productsFlag.value = 7;

console.log(`Flags value: ${productsFlag}`);
// Output: 'Flags value: 7'
```
What is particularly useful is the possibility to create custom filters.
```javascript
const checkFlags = productFlag.getCheck({ "newItem": true, "onSale": true, "outOfStock": false });

// Let's say you have many products with the following flag values (combined in an array here for simplicity)
// You can then use the above function to select only the ones that match the given criterias
[5, 8, 13, 10, 15, 31, 17, 14].forEach(n => {
  if (checkFlags(n)) {
    console.log(`${n} matches`);
  }
});
```
