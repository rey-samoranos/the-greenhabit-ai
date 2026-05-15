## GreenHabit - AI-Powered Sustainable Habit Builder

## Project Overview

GreenHabit is an AI-powered web application that helps users build eco-friendly habits through personalized weekly action plans. Users can choose environmental goals (Reduce Plastic, Save Water, Lower Energy, Cut Carbon) and receive AI-generated 7-day habit plans to track their progress and make a positive environmental impact.

## Features

- User Authentication - Login and Sign up with email/password
- Goal Selection - Choose from 4 environmental goals
- AI-Powered Plan - Generate personalized 7-day habit checklists
- Progress Tracking - Mark habits as complete, track streaks
- Save Progress - Auto-save completed plans to history
- Progress History - View all past challenges with edit capabilities

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React + TypeScript | Frontend framework |
| Tailwind CSS | Styling and responsive design |
| Vite | Build tool and dev server |
| Supabase | Backend (authentication + database + Edge Functions) |
| Groq API (Llama 3 70B) | AI habit plan generation |
| Vercel | Deployment |
| GitHub | Version control |

## Getting Started

### Prerequisites

- Node.js (node-v22.22.2-x6)
- npm 
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/rey-samoranos/the-greenhabit-ai.git

# Navigate to project folder
cd greenhabit-ai

# Install dependencies
npm install

# Start development server
npm run dev
