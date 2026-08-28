import mongoose, {
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);
