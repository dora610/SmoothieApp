const Smoothie = require('../models/Smoothie');

const handleError = (err) => {
  console.error(err.message, err.code);
};

// TODO: read from db
module.exports.showSmoothies = async (req, res) => {
  /* let smoothies = [
    { name: 'Banana Boost', ingrdt: ['Banana', 'Vanilla ice cream', 'Milk'] },
    { name: 'Tropical Twist', ingrdt: ['Peach', 'Pinapple', 'Apple juice'] },
    {
      name: 'Protein Packer',
      ingrdt: ['Oats', 'Peanut butter', 'Mil', 'Banana', 'Blueberries'],
    },
  ]; */
  try {
    const smoothies = await Smoothie.find({});
    res.render('smoothies', { smoothies: smoothies });
  } catch (err) {
    handleError(err);
    res.status(400).json({ error: err });
  }
};

module.exports.createSmoothie = async (req, res) => {
  try {
    const { title, ingredients } = req.body;
    const smoothie = await Smoothie.create({
      title,
      ingredients,
      createdBy: res.locals.user._id,
    });
    res.status(201).json({
      success: 1,
      msg: `Successfully added smoothie with id: ${smoothie._id}`,
    });
  } catch (err) {
    handleError(err);
    res.status(400).json({ error: err });
  }
};

module.exports.addSmoothie = (req, res) => {
  res.render('addSmoothie');
};
