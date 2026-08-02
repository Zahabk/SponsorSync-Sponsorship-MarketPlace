# 🚀 SponsorSync — Event Sponsorship Marketplace

<p align="center">
  <strong>Connecting Event Organizers with Sponsors through a seamless sponsorship marketplace.</strong>
</p>

<p align="center">
  <a href="https://sponsor-sync-sponsorship-market-pla.vercel.app/">🌐 Live Demo</a>
</p>

---

## 📌 Overview

**SponsorSync** is a full-stack MERN application that simplifies the process of connecting **Event Organizers** with **Sponsors**.

Traditionally, organizers spend significant time searching for sponsors through emails, social media, and personal contacts, while sponsors struggle to discover relevant events that align with their brand. SponsorSync solves this by providing a centralized platform where organizers can showcase events, sponsors can submit sponsorship proposals, and both parties can negotiate and confirm deals — no email chains, no spreadsheets.

The platform includes secure authentication, profile management, a full proposal negotiation workflow, automated email notifications, and cloud-based media storage.

---

## 📖 Table of Contents

- [Features](#-features)
- [Proposal Workflow](#-proposal-workflow)
- [Tech Stack](#-tech-stack)
- [Email Notifications](#-email-notifications)
- [Security](#-security-features)
- [Cloudinary Integration](#-cloudinary-integration)
- [Why I Built This](#-why-i-built-sponsorsync)
- [Support](#-support)

---

## ✨ Features

### 👤 Authentication
- Secure JWT-based authentication
- Login & registration with role selection
- Protected, role-based routes (Organizer / Sponsor)

### 🎯 Organizer Features
- Create, edit, and delete event listings
- Upload event banner images (Cloudinary)
- Define Gold / Silver / Bronze sponsorship tiers with pricing and benefits
- Review incoming sponsorship proposals in a dashboard
- Approve, reject, or send a counter-offer on any proposal
- Manage organizer profile

### 💼 Sponsor Features
- Browse open events with filters (type, budget, date)
- View full event details and sponsorship tiers
- Submit sponsorship proposals with a budget and pitch message
- Track proposal status (Pending / Negotiating / Approved / Rejected)
- Accept or reject counter-offers from organizers
- Manage sponsor profile

---

## 🔄 Proposal Workflow

The core of SponsorSync is a lightweight negotiation flow driven entirely by status changes — no messaging system required.

```
Sponsor submits proposal
         ↓
     [PENDING]
         ↓
  Organizer reviews
    ↙         ↘
[REJECTED]  [APPROVED]
      ↘         ↙
   [NEGOTIATING]
    Organizer sends
     counter-offer
         ↓
   Sponsor decides
    ↙         ↘
[APPROVED]  [REJECTED]
```

- **Organizer side:** a "Counter Offer" modal lets the organizer propose a new amount with an optional note — the proposal moves to `negotiating`.
- **Sponsor side:** if a proposal is `negotiating`, the sponsor sees a counter-offer card and can **Accept** (→ `approved`) or **Reject** (→ `rejected`) with one click.

---

## 🛠 Tech Stack

**Frontend**
- React.js
- React Router
- Axios
- Context API
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication**
- JWT Authentication
- HTTP-only Cookies

**Media Storage**
- Cloudinary

**Transactional Email**
- Brevo (Transactional Email API)

---

## 📧 Email Notifications

Transactional emails are sent via **Brevo** at key points in the proposal lifecycle:

| # | Trigger | Recipient | Purpose |
|---|---------|-----------|---------|
| 1 | User registers | New user | Welcome email |
| 2 | New proposal submitted | Organizer | Notify of new sponsor interest |
| 3 | Counter-offer sent | Sponsor | Notify of new offer amount |
| 4 | Sponsor responds to counter | Organizer | Notify of sponsor's decision |
| 5 | Proposal approved | Sponsor | Confirm sponsorship |
| 6 | Proposal rejected | Sponsor | Polite rejection notice |


---

## 🔒 Security Features

- JWT authentication
- Protected API routes
- Role-based authorization (Organizer / Sponsor)
- HTTP-only cookie authentication
- Password hashing (bcrypt)
- Input validation

---

## ☁️ Cloudinary Integration

SponsorSync uses **Cloudinary** for media management.

**Uploaded assets:**
- Profile / avatar images
- Event banner images

**Benefits:**
- Fast global delivery
- Secure storage
- Automatic image optimization

---

## 👨‍💻 Why I Built SponsorSync

SponsorSync was built to solve a real-world problem: event organizers often struggle to find the right sponsors, while sponsors have difficulty discovering relevant events that fit their brand.

This project demonstrates my ability to design and build a complete full-stack application — authentication, role-based access control, REST APIs, a stateful negotiation workflow, cloud media storage, transactional email, and a scalable backend architecture using the MERN stack.

---

## ⭐ Support

If you found this project useful, consider giving it a **Star** ⭐ on GitHub — it helps a lot!

---

<p align="center">© 2025 SponsorSync · Built with the MERN Stack · Emails by Brevo · Media by Cloudinary</p>
