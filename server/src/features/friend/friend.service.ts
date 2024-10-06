import User from "../user/user.model";
import FriendRequest from "../friendRequest/friendRequest.model";

async function getUserFriends(userId: string) {
  return User.findById(userId)
    .populate("friends", "username profilePhoto")
    .select("username profilePhoto friends");
}

async function removeUserFriend(userId: string, friendId: string) {
  await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
  await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

  await FriendRequest.findOneAndDelete({
    $or: [
      { sender: userId, receiver: friendId },
      { sender: friendId, receiver: userId },
    ],
  });

  return true;
}

export { getUserFriends, removeUserFriend };
