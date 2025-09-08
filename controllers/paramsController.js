import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { TrainingOption } from "../models/TrainingOption.js";

const getAllParams = async (req, res) => {
  const { _id } = req.user;
  const params = await TrainingOption.find({ owner: _id.toString() });

  res.status(200).json({ params });
}

const addParam = async (req, res) => {
  const { _id } = req.user;
  const { type, value } = req.body;

  const param = await TrainingOption.find({ owner: _id.toString() });
  const updatedParam = await TrainingOption.findByIdAndUpdate(param[0]._id, {
    [type]: [...param[0][type], value]
  }, {returnDocument: "after"});

  res.status(201).json(updatedParam);
}

const deleteParam = async (req, res) => {
  const { _id } = req.user;
  const { type, value } = req.body;

  const param = await TrainingOption.find({ owner: _id.toString() });

  const filteredValue = param[0][type].filter(item => item !== value);

  const updatedParam = await TrainingOption.findByIdAndUpdate(param[0]._id, {
    [type]: [...filteredValue]
  }, { returnDocument: "after" })

  res.status(201).json(updatedParam);
}


export const ctrl = {
	getAllParams: ctrlWrapper(getAllParams),
	addParam: ctrlWrapper(addParam),
	deleteParam: ctrlWrapper(deleteParam),
};