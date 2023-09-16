import mongoose, { Document, Schema } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: [true, "Role name is required."],
    unique: [true, "Role name must be unique."],
  },
  description: {
    type: String,
    required: [true, "Role description is required."],
  },
});

export interface RoleDocument extends Document {
  name: string;
  description: string;
}

const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);

export default RoleModel;
