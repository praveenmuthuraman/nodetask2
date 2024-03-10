import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());

// data storage
let rooms = [
  {
    id: 1,
    roomName: "Room 101",
    seats: 30,
    amenities: ["Projector", "Whiteboard"],
    pricePerHour: 50,
  },
  {
    id: 2,
    roomName: "Room 102",
    seats: 20,
    amenities: ["Whiteboard"],
    pricePerHour: 40,
  },
  {
    id: 3,
    roomName: "Room 103",
    seats: 25,
    amenities: ["Projector"],
    pricePerHour: 45,
  },
  { id: 4, roomName: "Room 104", seats: 15, amenities: [], pricePerHour: 30 },
  {
    id: 5,
    roomName: "Room 105",
    seats: 40,
    amenities: ["Projector", "Whiteboard"],
    pricePerHour: 60,
  },
];;
let bookings = [];
// home page
app.get("/", (req, res) => {
  const responseHTML = `
    <h1 style='text-align: center;'>Here</h1>
    <br>
    <h4 style='text-align: center;'>1.Create a Room: <a href="http://localhost:3000/rooms">http://localhost:3000/rooms</a></h4>
        <h4 style='text-align: center;'>2.Book a Room: <a href="http://localhost:3000/bookings">http://localhost:3000/bookings</a></h4>
        <h4 style='text-align: center;'>3.List all Rooms with Booked Data: <a href="http://localhost:3000/rooms/bookings">http://localhost:3000/rooms/bookings</a></h4>
        <h4 style='text-align: center;'>4.List all Customers with Booked Data: <a href="http://localhost:3000/customers/bookings">http://localhost:3000/customers/bookings</a></h4>
        <h4 style='text-align: center;'>5.List how many times a customer has booked the room: <a href="http://localhost:3000//customers/:customerName/booking-history">http://localhost:3000//customers/:customerName/booking-history</a></h4>
`;

  res.status(200).send(responseHTML);
});


// 1. Create a Room
app.post("/rooms", (req, res) => {
  const { roomName, seats, amenities, pricePerHour } = req.body;
  const room = {
    id: rooms.length + 1,
    roomName,
    seats,
    amenities,
    pricePerHour,
  };
  rooms.push(room);
  res.status(201).json(room);
});


// 2. Book a Room
app.post("/bookings", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const booking = {
    id: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId,
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

// 3. List all Rooms with Booked Data
app.get("/rooms/bookings", (req, res) => {
  const roomBookings = rooms.map((room) => {
    const bookingsForRoom = bookings.filter(
      (booking) => booking.roomId === room.id
    );
    return {
      roomName: room.roomName,
      bookedStatus: bookingsForRoom.length > 0,
      bookings: bookingsForRoom,
    };
  });
  res.json(roomBookings);
});

// 4. List all Customers with Booked Data
app.get("/customers/bookings", (req, res) => {
  const customersWithBookings = bookings.map((booking) => {
    const room = rooms.find((r) => r.id === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: room.roomName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });
  res.json(customersWithBookings);
});
// 5. List how many times a customer has booked the room

app.get("/customers/:customerName/booking-history", (req, res) => {
  const { customerName } = req.params;
  const customerBookings = bookings
    .filter((booking) => booking.customerName === customerName)
    .map((booking) => {
      const room = rooms.find((r) => r.id === booking.roomId);
      return {
        customerName: booking.customerName,
        roomName: room.roomName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.id,
        bookingDate: new Date().toISOString(),
        bookingStatus: "Confirmed",
      };
    });
  res.json(customerBookings);
});

app.listen(PORT, () => {
  console.log("Server is running now", PORT);
});
