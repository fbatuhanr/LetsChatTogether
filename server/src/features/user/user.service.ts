import User from "./user.model"

async function getAll() {
  return User.find();
}

async function get(id: any) {
  return User.findOne({ _id: id });
}

async function create(data: any) {
  return new User(data).save();
}

async function update(id:any, data:any) {
  return User.findOneAndUpdate({ _id: id }, data);
}

async function remove(id:any) {
  return User.findByIdAndDelete(id);
}

export { getAll, get, create, update, remove };