const OfficialsModel = require("../../models/Officials");

const getOfficials = async (req, res) => {
  const { name, position } = req.body;

  let payload = {};

  if (name) payload.name = name;
  if (position) payload.position = position;
  try {
    const response = await OfficialsModel.find(payload).sort({ level: -1 });
    return res.status(200).json({ data: response, code: 0 });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getOfficials };
