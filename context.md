# PawTrack Project Context

Welcome to **PawTrack**, a premium, client-side multi-page pet care tracking platform. This file provides an architectural overview, feature breakdown, data schemas, and style rules for developers and AI agents working on this project.

---

## 🚀 Project Overview
**PawTrack** is a fully client-side Single-Page Application (SPA) designed to help pet owners track their pets' daily schedules, medical history, activity, and financials. It supports managing multiple pets with independent tracking datasets, automatic age/birthday calculations, recurring task schedules, expense tracking with charts, vet appointments calendars, secure local document metadata storage, and an interactive veterinary Q&A chatbot.

---

## 🛠️ Technology Stack
The application is built using minimalist, lightweight, and modern web standards:
1. **Core Structure**: Semantic HTML5 ([index.html](file:///c:/Users/User/Desktop/PawTrack/index.html)).
2. **Styling**: Pure CSS (embedded within the `<style>` block in [index.html](file:///c:/Users/User/Desktop/PawTrack/index.html)), structured around a centralized CSS variable-based design system supporting custom themes and printing layouts.
3. **Logic & Interactivity**: Vanilla JavaScript (embedded in a `<script>` block in [index.html](file:///c:/Users/User/Desktop/PawTrack/index.html)) with direct DOM manipulation.
4. **Routing**: Client-side hash-based routing (`window.location.hash`), showing and hiding page-view containers dynamically.
5. **Data Persistence**: Synchronous updates using the browser's `localStorage` API (under the key `pawtrack_data`).
6. **Assets**: Google Fonts (*Nunito*) and native Emojis for icons to ensure zero dependency and fast loading times.

---

## 📋 Features Walkthrough
The application is divided into a sidebar navigation menu and a main content area containing the following page views:

### 🏠 Dashboard Overview
A hub displaying the active pet's summary:
- Latest weight and delta comparison (loss/gain) from the previous record.
- Count of pending tasks and details of the next upcoming task.
- Details of the next upcoming vet appointment.
- Sum total of expenses recorded during the current calendar month.
- **Overdue Alerts panel**: Compiles overdue vaccines, overdue tasks, and missed medication doses.
- Quick action shortcuts to trigger logs instantly.

### 🐾 Care Tracker (Original Tabbed UI)
Maintains the original 9 tabs:
1. **🍽️ Feeding**: Daily meal logs (Breakfast, Lunch, Dinner) with meal history and custom notes.
2. **🎂 Age**: Calendar age (Years/Months/Days), live birthday countdown, and custom species human age conversion.
3. **💊 Medications**: Medication dosage scheduler with frequency countdown timers and dose logs.
4. **💩 Poop & Pee**: Quick-logging poop/pee events with location tags and weekly summary grid.
5. **💉 Health & Vaccines**: Vaccine logging with overdue highlighting and printable health cards.
6. **🚶 Walks**: Active stopwatch logging walk durations, distances, and notes.
7. **📛 Names**: Interactive 200+ name finder database with bookmarks.
8. **📋 Sitter**: Live-preview instruction sheet template for sitters.
9. **🛁 Bath**: Logs bathing and trimming routines.

### 📊 Weight Log (`#weight`)
Logs weight over time, calculates gains/losses since the last log, and plots trends on a custom, interactive SVG line chart.

### 📋 Tasks & Reminders (`#tasks`)
Allows scheduling one-time or recurring tasks (daily, weekly, monthly, custom days). When a recurring task is marked complete, it automatically schedules a new task for the next recurrence date. Overdue tasks are highlighted in red.

### 💰 Expenses (`#expenses`)
Records pet expenses (Food, Vet, Grooming, Toys, Other). Shows a total spent indicator and categorizes expenditure proportions using responsive, colored progress bars.

### 🏥 Vet Visits (`#appointments`)
Tracks upcoming and past vet checkups. Past appointments are greyed out automatically. Reminder notifications are sent on the day of the appointment.

### 📄 Documents (`#documents`)
Logs health certificates, prescriptions, and lab sheets. Files under 500KB are uploaded and stored as Base64 data strings for direct local download, with warnings advising metadata-only logs for larger files.

### 🤖 AI Helper (`#chat`)
A custom rule-based veterinary Q&A chatbot responding to queries like chocolate toxicity, fever signs, tick removal, diet imbalances, and puppy vaccination rules.

---

## 💾 Data Architecture & Schema
All application state is saved under the localStorage key `pawtrack_data`. The JSON schema maps to the following structure:

```json
{
  "pets": [
    {
      "id": "pet_1718700000000_abcd",
      "name": "Luna",
      "type": "dog",
      "birthdate": "2024-05-15",
      "size": "medium",
      "feeding": {
        "breakfast": { "fed": true, "time": "2026-06-18T07:30:00.000Z", "note": "Kibble" },
        "lunch": { "fed": false, "time": null, "note": "" },
        "dinner": { "fed": false, "time": null, "note": "" },
        "history": [
          { "meal": "breakfast", "time": "2026-06-18T07:30:00.000Z", "date": "2026-06-18", "note": "Kibble" }
        ]
      },
      "medications": [],
      "poopPee": { "logs": [] },
      "vaccinations": [],
      "walks": [],
      "favorites": [],
      "sitter": { "petName": "Luna" },
      "bath": { "baths": [], "trims": [] }
    }
  ],
  "currentPetId": "pet_1718700000000_abcd",
  "theme": "warm",
  "weightLogs": [
    {
      "id": "weight_1718712345",
      "petId": "pet_1718700000000_abcd",
      "weight": 12.5,
      "date": "2026-06-18",
      "notes": "Post-vet check"
    }
  ],
  "tasks": [
    {
      "id": "task_1718712345",
      "petId": "pet_1718700000000_abcd",
      "title": "Heartworm Chewable",
      "description": "Give with breakfast",
      "priority": "high",
      "dueDate": "2026-07-18",
      "isRecurring": true,
      "recurrenceRule": "monthly",
      "recurrenceInterval": null,
      "completed": false,
      "createdAt": "2026-06-18T09:30:00.000Z"
    }
  ],
  "expenses": [
    {
      "id": "exp_1718712345",
      "petId": "pet_1718700000000_abcd",
      "category": "Food",
      "amount": 45.99,
      "date": "2026-06-18",
      "description": "Premium Kibble Bag"
    }
  ],
  "vetAppointments": [
    {
      "id": "appt_1718712345",
      "petId": "pet_1718700000000_abcd",
      "vetName": "Green Valley Clinic",
      "reason": "Annual checkup",
      "date": "2026-06-25",
      "time": "10:30",
      "reminder": true,
      "notes": "Bring fecal sample"
    }
  ],
  "documents": [
    {
      "id": "doc_1718712345",
      "petId": "pet_1718700000000_abcd",
      "name": "Rabies Cert",
      "type": "Vaccination",
      "date": "2026-06-18",
      "description": "Valid until 2029",
      "fileData": "data:image/png;base64,..."
    }
  ]
}
```

---

## 🛠️ Development & Customization Guidelines

### Multi-Page Routing
All views are elements with class `.page-view`. Routing is managed via the `handleRouting()` function responding to `hashchange`. To add a new page:
1. Append an navigation link `<a href="#pagename">` to the sidebar.
2. Add a `<div class="page-view" id="page-pagename">` container.
3. Write matching updater functions inside `updateNewPagesUI(pet)` and registration listeners.

### Design System and Color Schemes
All variables are scoped under `:root`, `[data-theme="midnight"]`, and `[data-theme="forest"]`.
- Sidebar, cards, buttons, and custom SVG line drawings dynamically adjust hues based on standard variables: `--bg`, `--card-bg`, `--accent`, `--border`, etc.
- Always use semantic classes (`.btn`, `.btn-sm`, `.timeline-item`, `.card`) when styling new elements to keep page layouts harmonized.
