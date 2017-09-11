var socket;
module.exports.init = function(io) {
	socket = io;
};

module.exports.send = function (title, data) {
	socket.sockets.emit(title, data);
};