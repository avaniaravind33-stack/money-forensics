# Money Forensics Engine

**A payment event reconstruction system that answers: "Where did my money go?"**

A complete, production-ready application that reconstructs what happened to a customer's money from fragmented transaction events.

## The Problem

Customer says: *"₹4,999 disappeared from my account. The payment says failed. Where is my money?"*

Most payment systems give you:
- Transaction ID
- Status: "Failed"
- No context
- Support escalation

Your Money Forensics Engine gives:
- Complete event reconstruction (Authorization → Capture → Settlement → Refund)
- Clear explanation of what happened
- Customer-friendly narrative
- Internal action items

## What It Does

### Transaction Flow Reconstruction

Traces every step of a payment:

```
Authorization
     ↓
Payment Attempt
     ↓
Authentication
     ↓
Capture
     ↓
Settlement
     ↓
Refund (if needed)
     ↓
Bank-Side Delay
```

### Six Common Scenarios

1. **Authorization Hold** — Authorized but not captured. Auto-releases in 48 hours.
2. **Capture Failed** — Authorized but merchant couldn't capture. Automatic refund.
3. **Bank Delay** — Processing at bank's end. 1-3 days normal.
4. **Duplicate Charge** — Same transaction twice. Automatic reversal.
5. **Authentication Failed** — OTP verification failed. Money never left account.
6. **Settlement Pending** — Captured but pending settlement. 24-48 hours normal.

### Output for Each Case

For every transaction analyzed, the system produces:

- **What Happened** — Technical explanation
- **Customer Impact** — How this affects them
- **What to Tell the Customer** — Plain English explanation
- **Internal Action** — Escalation decision

## Why It's Different

Most students build: *"Payment Dashboard"*

You're building: *A money-event forensic engine*

That screams:
- ✅ Payments expertise
- ✅ Analytical thinking
- ✅ Troubleshooting mindset
- ✅ Customer empathy
- ✅ System design thinking

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **Database**: PostgreSQL
- **AI**: Claude API for forensic analysis
- **Deployment**: Vercel (frontend) + Railway (backend) + Supabase (database)

## Features

- 🔍 Real-time transaction analysis
- 📊 Interactive payment flow visualization
- 💰 6 pre-built case scenarios
- 🎯 Clear customer explanations
- ⚡ Instant diagnosis (no manual review)
- 🏦 Bank-grade accuracy
- 📱 Responsive, theme-aware design

## Project Structure

```
money-forensics/
├── frontend/                 # Next.js app
│   ├── app/
│   ├── components/
│   ├── pages/
│   └── public/
├── backend/                  # FastAPI server
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── models/
│   │   ├── core/
│   │   └── services/
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Deployment

- **GitHub**: Full source code
- **Vercel**: Frontend
- **Railway**: Backend API
- **Supabase**: PostgreSQL database

Three shareable URLs with recruiters:
1. GitHub repository
2. Live application (Vercel)
3. API documentation

## Next Steps

1. Set up the project
2. Implement forensic analysis engine
3. Create interactive demo cases
4. Deploy to GitHub + Vercel + Railway
5. Share with recruiters

---

**This is your portfolio differentiator. Not just a payment tool — a forensic system that shows real analytical thinking.**
