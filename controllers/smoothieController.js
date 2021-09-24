const Smoothie = require('../models/Smoothie');

const handleError = (err) => {
  console.error(err.message, err.code);
  let errors = {};
  if (err.message.includes('Invalid')) {
    const [prop, _, msg] = err.message.split(':');
    errors[prop.trim()] = msg.trim();
  }
  if (err.message.includes('Validation failed')) {
    const errArr = Object.entries(err.errors);
    errArr.forEach(
      ([key, { properties }]) => (errors[key] = properties.message)
    );
  }
  if (!Object.keys(errors).length) {
    errors['err'] = err.message;
  }
  return errors;
};

module.exports.showSmoothies = async (req, res) => {
  try {
    const smoothies = await Smoothie.find({});
    res.render('smoothies', { smoothies: smoothies });
  } catch (err) {
    res.status(400).json({ error: handleError(err) });
  }
};

module.exports.addSmoothie = (req, res) => {
  res.render('addSmoothie', { title: 'Add Smoothie' });
};

module.exports.createSmoothie = async (req, res) => {
  try {
    const { name, ingredients } = req.body;
    const smoothie = await Smoothie.create({
      name,
      ingredients,
      createdBy: res.locals.user._id,
    });
    res.status(201).json({
      success: 1,
      msg: `Successfully added smoothie: ${smoothie.name}`,
    });
  } catch (err) {
    res.status(400).json({ errors: handleError(err) });
  }
};

module.exports.editSmoothiePage = async (req, res) => {
  try {
    // 1. Find out store by given _id value
    const { name, ingredients, createdBy } = await Smoothie.findById(
      req.params.id
    );
    if (!name || !ingredients) {
      res.status(403).send('Store not found!'); // TODO: check if we can send & redirect together
      return;
    }
    // 2. Check if the user own that store
    if (!createdBy.equals(res.locals.user._id)) {
      res.status(403).send('You cannot edit that!'); // TODO: check if we can send & redirect together
      return;
    }
    //3. Render edit store page
    res.render('addSmoothie', {
      title: 'Edit Smoothie',
      name,
      ingredients,
    });
  } catch (err) {
    res.status(404).json({ errors: handleError(err) });
  }
};

module.exports.updateSmoothie = async (req, res) => {
  try {
    // TODO: validate both smoothie and user at once
    // 1. validate the smoothie by id
    const smoothie = await Smoothie.findById(req.params.id);
    if (!smoothie) {
      res.status(404).send('invalid smoothie!!');
      return;
    }
    // 2. validate user & creaby by
    if (!smoothie.createdBy.equals(res.locals.user._id)) {
      res.status(404).send('You cannot edit that!!');
      return;
    }
    // 3. update smoothie
    const newSmoothie = await Smoothie.findByIdAndUpdate(store._id, req.body, {
      new: true,
      timestamps: true,
      runValidators: true,
    });
    // 4. redirect
    res.status(201).json({
      success: 1,
      msg: `Successfully edited smoothie: ${newSmoothie.name}`,
    });
  } catch (err) {
    res.status(404).json({ errors: handleError(err) });
  }
};
