const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
const PORT = 5000;
const JWT_SECRET = "your_jwt_secret_key";
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ticket-buy-and-sell-front.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/TickTrade", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.get("/check-username", async (req, res) => {
  const { username } = req.query;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1m",
    });

    res.status(200).json({
      token,
      username: user.username,
      userId: user._id,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "Your_Email",
    pass: "Your_Password",
  },
});

app.post("/verify-email", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ isRegistered: true });
    } else {
      res.json({ isRegistered: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

let otpStore = {};

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    console.log(`OTP sent to ${email}: ${otp}`);

    const token = jwt.sign({ otp }, JWT_SECRET, { expiresIn: "10m" });

    await transporter.sendMail({
      from: '"TickTrade" <Your_Email>',
      to: email,
      subject: "Your OTP Code",
      html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
    <img src="cid:ticktrade_logo" alt="TickTrade Logo" style="height: 80px; width: auto; margin-bottom: 20px;" />
    <h1 style="color: #007BFF; font-size: 24px; margin-bottom: 10px;">Welcome to TickTrade</h1>
    <p style="color: #555; font-size: 16px; margin: 0;">Your one-stop solution for all ticketing needs</p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <p style="font-size: 18px; color: #333; margin-bottom: 20px;">We’re thrilled to have you with us. Please use the OTP below to complete your verification:</p>
    <div style="display: inline-block; padding: 15px 30px; background-color: #f5f5f5; border-radius: 8px; border: 2px solid #007BFF; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); font-size: 24px; font-weight: bold; color: #d9534f;">
      <i style="color: #007BFF; font-size: 28px; vertical-align: middle;">&#128274;</i> 
      <span style="padding-left: 10px;">${otp}</span>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; background-color: #007BFF; color: white; border-radius: 8px; margin-top: 20px;">
    <p style="margin: 0; font-size: 16px;">If you did not request this OTP, please contact us immediately at <a href="mailto:support@ticktrade.com" style="color: #f9f9f9; text-decoration: underline;">support@ticktrade.com</a>.</p>
  </div>

  <div style="text-align: center; padding: 10px; font-size: 14px; color: #999; margin-top: 30px;">
    <p style="margin: 0;">Thank you for choosing TickTrade!</p>
  </div>
</div>
      `,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "assests", "logo.png"),
          cid: "ticktrade_logo",
        },
      ],
    });

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];

  console.log(`Received OTP for ${email}: ${otp}`);
  console.log(`Stored OTP for ${email}: ${storedOtp}`);

  if (!storedOtp) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }

  if (storedOtp === otp) {
    delete otpStore[email];
    res.status(200).json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "Password cannot be the same as the old one." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  phone: { type: String, required: true }, 
  address: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Ticket = mongoose.model("Ticket", TicketSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.post("/tickets", upload.single("image"), async (req, res) => {
  const { title, description, price, availability, location, phone, address, userId } =
    req.body;
  console.log("Received data:", {
    title,
    description,
    price,
    availability,
    location,
    phone,  
    address,
    userId,
  });
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const image = req.file.filename;

  try {
    const newTicket = new Ticket({
      title,
      description,
      price,
      availability,
      location,
      image,
      phone,  
      address,
      userId,
    });
    await newTicket.save();
    res
      .status(201)
      .json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving ticket" });
  }
});

app.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    console.log(tickets);

    const formattedTickets = tickets.map((ticket) => ({
      _id: ticket._id,
      title: ticket.title,
      image: `${req.protocol}://${req.get("host")}/images/${ticket.image}`,
      description: ticket.description,
      price: ticket.price,
      availability: ticket.availability,
      location: ticket.location,
      phone: ticket.phone,
      address: ticket.address,
    }));

    res.status(200).json(formattedTickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/tickets/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const tickets = await Ticket.find({ userId });

    const currentDate = new Date();

    const formattedTickets = tickets.map((ticket) => {
      const isExpired =
        new Date(ticket.createdAt) <
        new Date(currentDate.setDate(currentDate.getDate() - 2));

      return {
        _id: ticket._id,
        title: ticket.title,
        image: `${req.protocol}://${req.get("host")}/images/${ticket.image}`,
        description: ticket.description,
        price: ticket.price,
        availability: ticket.availability,
        location: ticket.location,
        phone: ticket.phone,
        address: ticket.address,
        status: isExpired ? "expired" : "active",
      };
    });

    res.status(200).json(formattedTickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,  
    to: 'aniket021978@gmail.com',  
    replyTo: email,  
    subject: `New Contact Form Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <div style="text-align: center;">
          <img src="cid:ticktrade_logo" alt="Logo" style="width: 150px; height: auto;"/>
        </div>
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f9f9f9; padding: 10px; border-radius: 4px;">${message}</p>
        <p style="color: #666; font-size: 0.9em;">This message was sent from your contact form.</p>
      </div>
    `,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "assests", "logo.png"),
        cid: "ticktrade_logo",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ success: false, error });
    }
    res.status(200).send({ success: true, messageId: info.messageId });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
