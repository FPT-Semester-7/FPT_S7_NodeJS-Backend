const availabilityService = require("../services/AvailabilityService");

exports.createAvailability = async (req, res) => {
  try {
    const slot = await availabilityService.createAvailability(
      req.user.id,
      req.body,
    );
    res.status(201).json({ status: "success", data: { availability: slot } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const items = await availabilityService.getAvailability(req.params.mcId);
    res.status(200).json({ status: "success", data: { availability: items } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    await availabilityService.deleteAvailability(req.params.id, req.user);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
