import FriendRequest from './friendRequest.model'
import User from '../user/user.model'

function getOutgoingRequests(userId: string) {
  return FriendRequest.find({ sender: userId, status: 'pending' }).populate('receiver', 'username')
}
function getIncomingRequests(userId: string) {
  return FriendRequest.find({ receiver: userId, status: 'pending' }).populate('sender', 'username')
}
async function acceptRequest(senderId: string, receiverId: string) {

  await FriendRequest.findOneAndUpdate({ $or: [{ sender: senderId, receiver: receiverId }, { sender: receiverId, receiver: senderId }] }, { status: 'accepted' })
  await User.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } })
  await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } })

  return true
}
async function getRequestStatusBetweenUsers(senderId: string, receiverId: string) {

  const request = await FriendRequest.findOne({ $or: [{ sender: senderId, receiver: receiverId }, { sender: receiverId, receiver: senderId }] })

  if (request) {
    const isSender = request.sender.toString() === senderId
    return { isSender, status: request.status }
  }

  return false
}
async function sendRequest(senderId: string, receiverId: string) {

  const friendRequest = new FriendRequest({
    sender: senderId,
    receiver: receiverId
  })
  const savedFriendRequest = await friendRequest.save()

  return savedFriendRequest ? true : false
}
async function cancelRequest(senderId: string, receiverId: string) {

  const removedFriendRequest = await FriendRequest.findOneAndDelete({ $or: [ { sender: senderId, receiver: receiverId, status: 'pending' }, { sender: receiverId, receiver: senderId, status: 'pending' } ] })
  return removedFriendRequest ? true : false
}
export {
  getOutgoingRequests, getIncomingRequests, getRequestStatusBetweenUsers,
  sendRequest, acceptRequest, cancelRequest
}