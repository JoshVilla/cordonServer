const OfficialsModel = require("../../models/Officials");

const getOfficials = async (req, res) => {
  const { name, position } = req.body;

  let payload = {};

  if (name) payload.name = name;
  if (position) payload.position = position;
  try {
    const response = await OfficialsModel.find(payload);
    console.log(response);

    return res.status(200).json({ data: response });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getOfficials };
