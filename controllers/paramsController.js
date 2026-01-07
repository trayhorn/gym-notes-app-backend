import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";
import { TrainingOption } from "../models/TrainingOption.js";

const getAllParams = async (req, res) => {
  const { _id } = req.user;
  const params = await TrainingOption.find({ owner: _id.toString() });

  res.status(200).json({
    params: params[0]
  });
}

const addParam = async (req, res) => {
  const { _id } = req.user;
  const { type, value } = req.body;

  const param = await TrainingOption.findOne({ owner: _id.toString() });
  if (param[type].includes(value)) {
    throw HttpError(400, `This value already exists in ${type}`);
  }

  await TrainingOption.updateOne({ owner: _id.toString() }, {
    $push: { [type]: value }
  });

  res.status(201).json({message: "success"});
}

const editParam = async (req, res) => {
  const { _id } = req.user;
  const { type, value } = req.body;

  const param = await TrainingOption.find({ owner: _id.toString() });

  const filteredValue = param[0][type].filter(item => item !== value);

  const updatedParam = await TrainingOption.findByIdAndUpdate(param[0]._id, {
    [type]: [...filteredValue]
  }, { returnDocument: "after" })

  res.status(201).json(updatedParam);
}

const deleteParam = async (req, res) => {
  const {_id} = req.user;
  const { type, item } = req.body;

  if(!type || !item) throw HttpError(400, "Both arguments are required");

  await TrainingOption.updateOne({ owner: _id.toString() }, {
    $pull: {[type]: item}
  });

  const params = await TrainingOption.find({owner: _id.toString()})

  res.status(200).json({
    params
  });
}


export const ctrl = {
	getAllParams: ctrlWrapper(getAllParams),
	addParam: ctrlWrapper(addParam),
	editParam: ctrlWrapper(editParam),
  deleteParam: ctrlWrapper(deleteParam)
};