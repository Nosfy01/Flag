# Flag
A Javascript object that assigns multiple booleans to bits in an integer.

## Background
My first needs for this snippet / object were related to products for ecommerce but it was made so that it can be useful in many applications. Please keep this in mind when viewing the examples, they are related to online sales only because they provide an easy to undestand context.

Many servers that offer the possibility to run Javascript code only support old versions of JS. I could maintain two versions (legacy and es6+) but I at least for now a good compromise is to go with "_recent_" Javascript code complemented with a few polyfills.

## Reference

**new Flag(**_keys_**)**;

A Flag instance is an object that assigns the bits of an integer as booleans to the _keys_ it received in a javascript array.

The index (position in the array) of each key is what determines the bit value associated with it.

```javascript
const labels = ["outOfStock", "onSale", "backOrder", "newItem", "discontinued"];
const productsFlag = new Flag(labels);
```
Here is how the values of "_labels_" will be assigned

Index | Key Name | Op | Value (when true)
------|----------|----|------------------
0 | outOfStock | 2 ** 0 | 1
1 | onSale | 2 ** 1 | 2
2 | backOrder | 2 ** 2 | 4
3 | newItem | 2 ** 3 | 8
4 | discontinued | 2 ** 4 | 16

The integer itself can be get / set through the "_value_" key. Each of the keys can be get / set like traditional boolean properties of an object.

```javascript
productsFlag.backOrder = true;
console.log(productsFlag.value);
// outputs 4

productsFlag.newItem = true;
// Now "value" becomes 12 => backOrder (4) + newItem (8) = 12;
console.log(productsFlag.value);
// outputs 12

productsFlag.value = 17;
// This sets "outOfStock" and "discontinued" to true. All others to false.
```

### getCheckValues

A Flag instance can use the values of its keys (see table above) to generate a filter function. What tells it how to make the filter is an object that contains the needed keys assigned to the needed values.

The benefit is that we can easily obtain many distinct functions that are fast to execute and can be used in loops without creating Flag instances for each integer.

Suppose you have many objects (products) that contain a property representing values of a Flag (an integer), let's say this property is named "_flags_". You might want to identify the products with flags property corresponding **new** and **on sale**, and want to make sure they're not **out of stock**.

```javascript
// isNewAndOnSale is in no way influenced by the value property of productsFlag
// productsFlag is only using key values to generate the filter function.
const isNewAndOnSale = productsFlag.getCheckValues({ "newItem": true, "onSale": true, "outOfStock": false });

// For simplicity, let's assume the array here below is an array of product objects
// and that we access each one's flags property to obtain the value.
[5, 8, 13, 10, 15, 31, 17, 14].forEach(n => {
  if (isNewAndOnSale(n)) {
    console.log(`${n} matches`);
  }
});
// In this case, the products corresponding to the values 10 and 14 would match
```

