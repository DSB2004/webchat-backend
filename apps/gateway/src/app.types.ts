// websockets
export enum SERVER_EVENT {
  SERVER_ADD_MESSAGE = 'server.message.add',
  SERVER_DELETE_MESSAGE = 'server.message.delete',
  SERVER_UPDATE_MESSAGE = 'server.message.update',
  SERVER_CLEAR_MESSAGE = 'server.message.clear',
  SERVER_STATUS_MESSAGE = 'server.message.status',

  SERVER_USER_BLOCK = 'server.user.block',
  SERVER_USER_UNBLOCK = 'server.user.unblock',

  SERVER_ADD_PARTICIPANT = 'server.participant.add',
  SERVER_REMOVE_PARTIPANT = 'server.participant.remove',
  SERVER_JOIN_PARTICIPANT = 'server.pariticpant.join',
  SERVER_LEAVE_PARTICIPANT = 'server.participant.leave',

  SERVER_ADD_ADMIN = 'server.admin.add',
  SERVER_REMOVE_ADMIN = 'server.admin.remove',

  SERVER_NEW_CHATROOM = 'server.chatroom.new',
}

export enum CLIENT_EVENT {
  CLIENT_ADD_MESSAGE = 'client.message.add',
  CLIENT_DELETE_MESSAGE = 'client.message.delete',
  CLIENT_UPDATE_MESSAGE = 'client.message.update',
  CLIENT_CLEAR_MESSAGE = 'client.message.clear',
  CLIENT_STATUS_MESSAGE = 'server.message.status',

  CLIENT_USER_BLOCK = 'client.user.block',
  CLIENT_USER_UNBLOCK = 'client.user.unblock',

  CLIENT_ADD_PARTICIPANT = 'client.participant.add',
  CLIENT_REMOVE_PARTICIPANT = 'client.participant.remove',
  CLIENT_JOIN_PARTICIPANT = 'client.pariticpant.join',
  CLIENT_LEAVE_PARTICIPANT = 'client.participant.leave',

  CLIENT_ADD_ADMIN = 'client.admin.add',
  CLIENT_REMOVE_ADMIN = 'client.admin.remove',

  CLIENT_NEW_CHATROOM = 'client.chatroom.new',
}
