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
    room_status: "available",
  },
  {
    id: 2,
    roomName: "Room 102",
    seats: 20,
    amenities: ["Whiteboard"],
    pricePerHour: 40,
    room_status: " not available",
  },
  {
    id: 3,
    roomName: "Room 103",
    seats: 25,
    amenities: ["Projector"],
    pricePerHour: 45,
    room_status: "available",
  },
  {
    id: 4,
    roomName: "Room 104",
    seats: 15,
    amenities: [],
    pricePerHour: 30,
    room_status: "not available",
  },
  {
    id: 5,
    roomName: "Room 105",
    seats: 40,
    amenities: ["Projector", "Whiteboard"],
    pricePerHour: 60,
    room_status: "not available",
  },
];
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
const createRoom =(req, res) => {
  try {
    let id = rooms.length ? rooms[rooms.length - 1].room_id + 1 : 1;
    req.body.room_id = id;

    rooms.push(req.body);
     res.status(200).json({
      message: "Room Created Successfully",
      Room: rooms,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

app.post("/rooms", createRoom);



// 2. get all rooms
const getAllRoom = (req, res) => {
  try {
    res.status(200).json({
      comment: "Fetch All Room Successfully",
      rooms: rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      comment: "Internal Server Error",
    });
  }
}
app.get("/rooms", getAllRoom);
//3.booking room
const bookRoom = (req, res) => {
  try {
    const { customer_name, date, start_time, end_time, roomID } = req.body;

    const room = rooms.find(
      (e) => e.room_status === "available" && e.room_id == roomID
    );

    if (!room) {
      return res.status(400).json({
        message: "Room is not Available",
      });
    } else {
      let bookedRoomsDate = bookingRoom.filter(
        (booking) => booking.booking_date === date
      );

      if (bookedRoomsDate.length > 0) {
        console.log("true block");
        return res.status(400).json({
          message: "Date is not Available",
        });
      } else {
        console.log("false block");
        let bookings ={
          customer_name,
          start_time,
          end_time,
          roomID,
          date,
          booking_id: bookingRoom.length + 1,
          booking_Date: date,
          status: "booked",
        };
        bookingRoom.push(bookings);

        return res.status(200).json({
          message: "Room booked successfully",
          Bookingroom: bookingRoom,
        });
      }
    }
  } catch (error) {
    console.error("Error booking room:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const bookedroom = (req, res) => {
  try {
    res.status(200).json({
      comment: "Fetch All Room Successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      comment: "Internal Server Error",
    });
  }
};
app.get("/bookings", bookedroom);





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

const bookCount = async (req, res) => {
  try {
    const { customer_name } = req.params;
    console.log("Requested Customer Name:", customer_name);

    const customerBooking = bookingRoom.filter((e) => {
      console.log("Booking Customer Name:", e.customer_name);
      return e.customer_name === customer_name;
    });

    console.log("Customer Booking:", customerBooking);

    res.status(200).json({
      message: "Successfully fetched",
      customer_name,
      booking_count: customerBooking.length,
      bookings: customerBooking,
    });
  } catch (error) {
    console.error("Error in bookCount:", error);
    res.status(500).json({
      comment: "Internal server error",
    });
  }
};


app.listen(PORT, () => {
  console.log("Server is running now", PORT);
});
