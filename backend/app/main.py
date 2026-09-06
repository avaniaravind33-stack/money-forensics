from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Money Forensics Engine",
    description="Reconstruct what happened to a customer's money from transaction events",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Transaction analysis scenarios
SCENARIOS = {
    'auth-hold': {
        'statusIcon': '⏱️',
        'statusTitle': 'Authorization Hold (No Capture)',
        'whatHappened': 'Your payment was authorized by the bank, but the merchant did not capture the funds within 24 hours. The authorization will automatically expire and release the funds back to your account in 48 hours.',
        'customerImpact': 'Temporary authorization hold on your account. Your available balance shows reduced, but the amount is not deducted. Once the hold expires, your balance updates automatically.',
        'whatToTell': 'Your payment was authorized but not captured by the merchant. Don\'t worry—your money is not gone. The authorization hold will automatically release in 48 hours, and your account will show the full balance. If it takes longer, contact us.',
        'internalAction': 'No escalation needed. This is a normal authorization hold. Set reminder to follow up if customer reports issue after 48 hours.',
        'priority': 'low',
        'escalate': False
    },
    'capture-failed': {
        'statusIcon': '❌',
        'statusTitle': 'Capture Failed - Refund Processing',
        'whatHappened': 'Payment was authorized successfully, but the merchant\'s system failed to capture the funds. Our system detected this and automatically initiated a refund. Your money is being returned to your account.',
        'customerImpact': 'Amount will be refunded within 3-5 business days depending on your bank. You may see the authorization hold disappear immediately.',
        'whatToTell': 'Your payment couldn\'t be completed on the merchant\'s side. We\'ve automatically refunded the amount. You\'ll see the money back in your account within 3-5 business days. No action needed from you.',
        'internalAction': 'Contact merchant to investigate why capture failed. Check if this is a recurring issue. Update merchant if needed.',
        'priority': 'medium',
        'escalate': True
    },
    'bank-delay': {
        'statusIcon': '⏳',
        'statusTitle': 'Bank Processing Delay',
        'whatHappened': 'Payment was successfully processed on our end and captured. It\'s now pending at your bank\'s clearing system. This is normal—banks take 1-3 business days to finalize settlements.',
        'customerImpact': 'Money has left your account but not yet settled. May show as "pending" or "processing". Will be fully settled within 2-3 business days.',
        'whatToTell': 'Your payment was successful on our end. It\'s now being processed by your bank, which typically takes 2-3 business days. Your account will update once settled. Check with your bank if you see different information there.',
        'internalAction': 'No action needed. Standard bank processing time. If customer reports issue after 4 days, investigate settlement with acquiring bank.',
        'priority': 'low',
        'escalate': False
    },
    'duplicate': {
        'statusIcon': '🔄',
        'statusTitle': 'Duplicate Charge Detected',
        'whatHappened': 'The same transaction was charged twice due to a network retry. The first charge is valid. The second charge has been automatically flagged for reversal and will be refunded within 24 hours.',
        'customerImpact': 'Both charges temporarily show on your account. The duplicate will be reversed automatically. You\'ll see a credit within 24 hours.',
        'whatToTell': 'We detected a duplicate charge on your account. Don\'t worry—we\'ve automatically reversed the duplicate. You\'ll see the refund within 24 hours. We apologize for the confusion.',
        'internalAction': 'High priority: Investigate why duplicate was created. Check API retry logic. Monitor customer account for confirmation of reversal.',
        'priority': 'high',
        'escalate': True
    },
    'auth-failed': {
        'statusIcon': '❌',
        'statusTitle': 'Authentication Failed',
        'whatHappened': 'Your payment required OTP verification. The OTP verification failed (expired OTP, incorrect entry, timeout). The payment was rejected before authorization. Your account was never charged.',
        'customerImpact': 'No money was deducted. Your account balance is unchanged. Try the payment again with a fresh OTP.',
        'whatToTell': 'Your OTP verification didn\'t go through. This could be due to expired OTP, network issues, or incorrect entry. Your money was not charged. Please try again with a fresh OTP.',
        'internalAction': 'No action needed. Customer needs to retry payment. Monitor if customer reports repeated OTP failures—may indicate account security concern.',
        'priority': 'low',
        'escalate': False
    },
    'settlement-pending': {
        'statusIcon': '📋',
        'statusTitle': 'Settlement Pending',
        'whatHappened': 'Payment has been captured successfully. It\'s now in the settlement queue with your bank. Settlement typically completes within 24-48 hours.',
        'customerImpact': 'Money has been deducted from your account. It\'s being transferred and will be settled within 24-48 hours.',
        'whatToTell': 'Your payment was successful and is now being settled. This usually takes 24-48 hours. You can track the status in your transaction history.',
        'internalAction': 'No action needed. Standard settlement timeframe. Follow up if not settled after 3 days.',
        'priority': 'low',
        'escalate': False
    }
}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Money Forensics Engine",
        "version": "0.1.0"
    }

@app.get("/scenarios")
async def get_scenarios():
    """Get all available analysis scenarios"""
    return {
        "scenarios": list(SCENARIOS.keys()),
        "count": len(SCENARIOS)
    }

@app.get("/analyze/{transaction_id}")
async def analyze_transaction(transaction_id: str, amount: float = None):
    """Analyze a transaction and reconstruct what happened"""

    if not transaction_id:
        raise HTTPException(status_code=400, detail="Transaction ID is required")

    # In a real system, this would query the database for the transaction
    # For now, return a simulated analysis
    import random
    scenario_key = random.choice(list(SCENARIOS.keys()))
    scenario = SCENARIOS[scenario_key]

    return {
        "transactionId": transaction_id,
        "amount": amount,
        "scenario": scenario_key,
        "statusIcon": scenario['statusIcon'],
        "statusTitle": scenario['statusTitle'],
        "whatHappened": scenario['whatHappened'],
        "customerImpact": scenario['customerImpact'],
        "whatToTell": scenario['whatToTell'],
        "internalAction": scenario['internalAction'],
        "priority": scenario['priority'],
        "escalate": scenario['escalate']
    }

@app.get("/docs")
async def get_api_docs():
    """Get API documentation"""
    return {
        "name": "Money Forensics Engine API",
        "version": "0.1.0",
        "endpoints": {
            "GET /health": "Health check",
            "GET /scenarios": "List all analysis scenarios",
            "GET /analyze/{transaction_id}": "Analyze a transaction"
        },
        "description": "Reconstruct what happened to a customer's money from transaction events"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
