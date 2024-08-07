import FriendRequest from './friendRequest.model'

async function getAllRequestsForUser(userId: string) {

  const allRequests = await FriendRequest.find({ receiver: userId, status: 'pending' }).populate('sender', 'username')
  console.log(allRequests)

  return allRequests ? allRequests : false
}

async function getRequest(senderId: string, receiverId: string) {

  const request = await FriendRequest.findOne({
    sender: senderId,
    receiver: receiverId
  })

  return request ? request.status : false;
}

async function sendRequest(senderId: string, receiverId: string) {

  const friendRequest = new FriendRequest({
    sender: senderId,
    receiver: receiverId
  })
  const savedFriendRequest = await friendRequest.save()

  return savedFriendRequest ? true : false
}

async function acceptRequest(requestId: string) {

  const updatedFriendRequest = await FriendRequest.findByIdAndUpdate(requestId, {
    status: 'accepted'
  }, { new: true })

  return updatedFriendRequest ? true : false
}

async function cancelRequest(senderId: string, receiverId: string) {

  const removedFriendRequest = await FriendRequest.findOneAndDelete({
    sender: senderId,
    receiver: receiverId,
    status: 'pending'
  })

  return removedFriendRequest ? true : false
}

export { getAllRequestsForUser, getRequest, sendRequest, acceptRequest, cancelRequest }