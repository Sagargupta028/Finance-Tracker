# Finance Tracker

A simple web application for tracking personal finances.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Finance Tracker is a web application designed to help individuals manage and visualize their personal finances. With a focus on simplicity and usability, it allows users to track their expenses, categorize them, and set budgets.

## Features

### Stage 1: Basic Transaction Tracking

- Add/Edit/Delete transactions (amount, date, description)
- Transaction list view
- Single chart: Monthly expenses bar chart
- Basic form validation

### Stage 2: Categories

- All Stage 1 features
- Predefined categories for transactions
- Category-wise pie chart
- Dashboard with summary cards: total expenses, category breakdown, most recent transactions

### Stage 3: Budgeting

- All Stage 2 features
- Set monthly category budgets
- Budget vs actual comparison chart
- Simple spending insights

## Tech Stack

- **Frontend**: Next.js, React, shadcn/ui, Recharts
- **Backend**: MongoDB

## Installation

To get started with the Finance Tracker, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Sagargupta028/Finance-Tracker.git
cd Finance-Tracker
```


2. Install the dependencies:
```bash
npm install
```

3. Set up the environment variables:
Create a .env file in the root directory and add the necessary environment variables:
```bash
MONGODB_URI=<your-mongodb-uri>
NEXT_PUBLIC_API_URL=<your-api-url>
```
4. Start the development server:
```bash
npm run dev
```

## Usage
1. Open the application in your browser.
2. Use the transaction form to add, edit, or delete transactions.
3. View the transaction list and charts for a visual representation of your expenses.
4. Navigate to the dashboard for a summary of your financial data.
