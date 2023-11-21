// socker 이벤트 정의(서버)
const { Server } = require("socket.io");

const socketHandler = (server) => {
  // io에 등록
  const io = new Server(server);
  io.on("connection", (socket) => {
    // 접속 시 서버에서 실행되는 코드
    const req = socket.request;
    const socket_id = socket.id;
    const client_ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    console.log("connection!");
    console.log("socket ID : ", socket_id);
    console.log("client IP : ", client_ip);

    socket.on("disconnect", () => {
      // 사전 정의 된 callback (disconnect, error)
      console.log(socket.id, "client disconnected");
    });

    // 이벤트 리스너 등록
    socket.on("event1", (msg) => {
      // 생성한 이벤트 이름 event1 호출 시 실행되는 callback
      //console.log(msg);
      socket.emit("getID", socket.id);
    });

    // 모두에게
    socket.on("input", (data) => {
      io.emit("msg", { id: socket.id, message: data });
      //console.log(socket_id, " 가 보낸 메시지 : ", data);
    });

    // 본인 제외한 모든 사용자에게
    socket.on("inputWM", (data) => {
      socket.broadcast.emit("msg", { id: socket.id, message: data });
      //console.log(data, " 를 받음, 본인 빼고 ");
    });

    // 특정 사용자에게
    socket.on("private", (id, data) => {
      io.to(id).emit("msg", { id: socket.id, message: data });
      //console.log(socket_id, " 가 ", id, "에게 보내는 메시지 : ", data);
    });
  });
};

module.exports = socketHandler;
