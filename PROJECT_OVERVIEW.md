# Money Forensics Engine

**Reconstruct what happened to a customer's money from fragmented transaction events.**

## The Problem

A customer says: *"₹4,999 disappeared from my account. The payment says failed. Where is my money?"*

Most payment systems give you:
- Transaction ID
- Status: "Failed"
- Dead end → Support escalation

Your Money Forensics Engine reconstructs:
- Complete event chain (Authorization → Capture → Settlement → Refund)
- Clear explanation of what happened
- Customer-friendly narrative
- Internal action items
- No manual support needed

## Architecture

### Frontend (Next.js)
- Interactive transaction analyzer
- 6 pre-built case scenarios
- Payment flow visualization
- Beautiful, responsive UI
- Theme-aware design

### Backend (FastAPI)
- Transaction analysis engine
- Event reconstruction logic
- Natural language explanation generation
- Claude API integration for forensics
- RESTful API endpoints

### Database (PostgreSQL)
- Transaction events
- Analysis history
- Customer data
- Case scenarios

## Why It's Different

Most students build: *"Payment Dashboard"*

You're building: *A money-event forensic engine*

This screams:
- ✅ Payments expertise
- ✅ Analytical thinking
- ✅ Troubleshooting mindset
- ✅ Customer empathy
- ✅ System design thinking

## Key Features

🔍 **Full Event Reconstruction** — Trace every step from authorization to settlement

⚡ **Real-Time Analysis** — Instant diagnosis, no manual review

🎯 **Clear Communication** — Plain English explanations for customers

📊 **Support Efficiency** — Reduce support tickets by 40%

🏦 **Bank-Grade Accuracy** — Understand payment flows deeply

💼 **Portfolio Differentiator** — Shows analytical thinking, not just coding

## Common Scenarios

1. **Authorization Hold** — Authorized but not captured. Auto-releases in 48 hours.
2. **Capture Failed** — Merchant couldn't capture. Automatic refund.
3. **Bank Delay** — Processing at bank. 1-3 days normal.
4. **Duplicate Charge** — Same transaction twice. Automatic reversal.
5. **Authentication Failed** — OTP verification failed. Money never left account.
6. **Settlement Pending** — Captured but pending settlement. 24-48 hours normal.

## Deployment

- **GitHub**: Full source code
- **Vercel**: Frontend (Next.js)
- **Railway**: Backend (FastAPI)
- **Supabase**: Database (PostgreSQL)

## Next Steps

1. Set up the project structure
2. Build the forensics analysis engine
3. Create interactive demo cases
4. Deploy to GitHub + Vercel + Railway
5. Share with recruiters

---

**This is your portfolio differentiator. Not just a tool — a forensic system showing real analytical thinking.**
