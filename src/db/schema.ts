import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("member"), // admin | member | donor | patient | hospital
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const donors = pgTable("donors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  bloodGroup: text("blood_group").notNull(),
  city: text("city").notNull(),
  age: integer("age"),
  available: boolean("available").notNull().default(true),
  lastDonation: text("last_donation"),
  totalDonations: integer("total_donations").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  phone: text("phone"),
  contactPerson: text("contact_person"),
  beds: integer("beds").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bloodGroup: text("blood_group").notNull(),
  phone: text("phone"),
  city: text("city").notNull(),
  hospitalId: integer("hospital_id"),
  condition: text("condition"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bloodRequests = pgTable("blood_requests", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  bloodGroup: text("blood_group").notNull(),
  units: integer("units").notNull().default(1),
  urgency: text("urgency").notNull().default("normal"), // critical | urgent | normal
  status: text("status").notNull().default("pending"), // pending | approved | fulfilled | rejected
  hospitalId: integer("hospital_id"),
  city: text("city").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull().default("info"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
