const app = require("./index");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const { cards, projects, users_projects } = require("./models");
const socketCanvas = require("./controllers/canvas");

try {
  io.on("connection", (socket) => {
    // 프로젝트 입장하면 해당 프로젝트로 소켓 연결, 다른 사람에게 입장 정보를 알려준다.
    socket.on("enterRoom", (roomName) => {
      socket.join(roomName);
      socket.emit("enterRoom", socket.id);
      socket.to(roomName).emit("enterRoom", socket.id);

      console.log(socket.rooms);
      console.log("SOCKETIO connect EVENT: ", socket.id, " client connect");
    });

    // 프로젝트 퇴장 시 같은 프로젝트에 접속해있는 사람에게 퇴장 정보를 알려준다.
    socket.on("disconnect", () => {
      socket.rooms.forEach((room) => socket.to(room).emit("bye"));

      console.log(
        "SOCKETIO disconnect EVENT: ",
        socket.id,
        " client disconnect"
      );
      console.log(socket.rooms);
    });

    socketCanvas(socket);
  });
} catch (err) {
  console.log(err);
}
//createCard, addMindmap, deleteMindmap, initData, editBlock, enterRoom, editBlockStart, editBlockEnd
module.exports = server;
