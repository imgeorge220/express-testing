const express = require("express");
const router = new express.Router();
const ExpressError = require("./ExpressError");
const items = require("./fakeDb");


router.get('/', function (req, res) {
  return res.json(items);
});

router.post('/', function (req, res) {
  let newItem = req.body;
  items.push(newItem);
  return res.json({ added: newItem });
});

router.get('/:name', function (req, res, next) {
  try {
    for (let item of items) {
      if (item.name === req.params.name) {
        return res.json(item);
      }
    }
    throw new ExpressError("That Item is NOT on the list", 404);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:name', function (req, res, next) {
  let updatedItem = req.body;
  try {
    for (let item of items) {
      if (item.name === req.params.name) {
        for (let key in updatedItem) {
          item[key] = updatedItem[key];
        }
        return res.json({ updated: updatedItem });
      }
    }
    throw new ExpressError("That Item is NOT on the list", 404);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:name', function (req, res, next) {
  try {
    for (let index in items) {
      if (items[index].name === req.params.name) {
        // items = items.filter(i => i.name !== req.params.name);
        items.splice(index, 1);
        return res.json({ message: "Deleted" });
      }
    }
    throw new ExpressError("That Item is NOT on the list", 404);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;