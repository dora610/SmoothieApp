const Smoothie = require('../models/Smoothie');

const handleError = (err) => {
  console.error('from error handler');
  console.error(err.message, err.code);
  let errors = {};
  if (err.message.includes('Invalid')) {
    const [prop, _, msg] = err.message.split(':');
    errors[prop.trim()] = msg.trim();
  }
  if (err.message.includes('Smoothie validation failed')) {
    const errArr = Object.entries(err.errors);
    errArr.forEach(([key, { properties }]) => {
      errors[key] = properties.message;
    });
  }
  console.log(errors);
  return errors;
};

module.exports.showSmoothies = async (req, res) => {
  try {
    const smoothies = await Smoothie.find({});
    res.render('smoothies', { smoothies: smoothies });
  } catch (err) {
    handleError(err);
    res.status(400).json({ error: err });
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
      msg: `Successfully added smoothie with id: ${smoothie._id}`,
    });
  } catch (err) {
    res.status(400).json({ errors: handleError(err) });
  }
};

module.exports.editSmoothiePage = async (req, res) => {
  try {
    const { name, ingredients } = await Smoothie.findById(req.params.id);
    console.log(name, ingredients);
    res.render('addSmoothie', {
      title: 'Edit Smoothie',
      name,
      ingredients,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports.updateSmoothie = (req, res) => {
  res.json(req.body);
};
