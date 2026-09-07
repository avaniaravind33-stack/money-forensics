'use client'

import { useState } from 'react'

const SCENARIOS = [
  {
    id: 'auth-hold',
    icon: '⏱️',
    label: 'Authorization Hold',
    tag: 'COMMON',
    tagColor: '#2563eb',
    amount: '₹4,999',
    txnId: 'TXN-2024-001',
    summary: 'Authorized but not captured',
    whatHappened: 'Your payment was authorized by the bank, but the merchant did not capture the funds within 24 hours. The authorization will automatically expire and release the funds back to your account in 48 hours.',
    customerMessage: "Your money is not gone. The authorization hold will automatically release in 48 hours, and your account will show the full balance restored.",
    internalAction: 'No escalation needed. Standard authorization hold. Follow up if customer reports issue after 48 hours.',
    priority: 'Low',
    priorityColor: '#16a34a',
    escalate: false,
    timeline: [
      { step: 'Payment Initiated', status: 'done', time: '10:32 AM' },
      { step: 'Bank Authorization', status: 'done', time: '10:32 AM' },
      { step: 'Merchant Capture', status: 'failed', time: 'Not received' },
      { step: 'Auto-Release', status: 'pending', time: 'In ~48 hrs' },
    ]
  },
  {
    id: 'capture-failed',
    icon: '❌',
    label: 'Capture Failed',
    tag: 'ACTION NEEDED',
    tagColor: '#dc2626',
    amount: '₹12,500',
    txnId: 'TXN-2024-002',
    summary: 'Merchant capture error — refund initiated',
    whatHappened: 'Payment was authorized successfully, but the merchant's system failed to capture the funds. Our system detected this and automatically initiated a refund.',
    customerMessage: "Your payment couldn't be completed on the merchant's side. We've automatically refunded the amount. You'll see the money back in your account within 3–5 business days.",
    internalAction: 'Contact merchant to investigate why capture failed. Check if this is a recurring issue. Update merchant firewall if needed.',
    priority: 'Medium',
    priorityColor: '#d97706',
    escalate: true,
    timeline: [
      { step: 'Payment Initiated', status: 'done', time: '2:14 PM' },
      { step: 'Bank Authorization', status: 'done', time: '2:14 PM' },
      { step: 'Merchant Capture', status: 'failed', time: '2:16 PM' },
      { step: 'Auto-Refund Triggered', status: 'done', time: '2:17 PM' },
      { step: 'Refund to Account', status: 'pending', time: '3–5 business days' },
    ]
  },
  {
    id: 'bank-delay',
    icon: '⏳',
    label: 'Bank Processing Delay',
    tag: 'NORMAL',
    tagColor: '#7c3aed',
    amount: '₹8,200',
    txnId: 'TXN-2024-003',
    summary: 'Payment captured, bank settling',
    whatHappened: 'Payment was successfully processed and captured. It's now pending at your bank's clearing system. Banks take 1–3 business days to finalize settlements — this is completely normal.',
    customerMessage: "Your payment was successful on our end. It's being processed by your bank and will fully settle within 2–3 business days. No action needed.",
    internalAction: 'No action needed. Standard bank processing time. Investigate if not settled after 4 days.',
    priority: 'Low',
    priorityColor: '#16a34a',
    escalate: false,
    timeline: [
      { step: 'Payment Initiated', status: 'done', time: '9:00 AM' },
      { step: 'Authorization', status: 'done', time: '9:00 AM' },
      { step: 'Capture Successful', status: 'done', time: '9:01 AM' },
      { step: 'Bank Settlement', status: 'pending', time: '1–3 business days' },
    ]
  },
  {
    id: 'duplicate',
    icon: '🔄',
    label: 'Duplicate Charge',
    tag: 'HIGH PRIORITY',
    tagColor: '#dc2626',
    amount: '₹3,499 × 2',
    txnId: 'TXN-2024-004',
    summary: 'Double charge detected — auto-reversal',
    whatHappened: 'The same transaction was charged twice due to a network retry. The first charge is valid. The second has been flagged for automatic reversal and will be credited within 24 hours.',
    customerMessage: "We detected a duplicate charge on your account and have automatically reversed it. You'll see the refund within 24 hours. We apologize for the confusion.",
    internalAction: 'HIGH PRIORITY: Investigate API retry logic. Monitor customer account for reversal confirmation. Review duplicate detection thresholds.',
    priority: 'High',
    priorityColor: '#dc2626',
    escalate: true,
    timeline: [
      { step: 'First Charge', status: 'done', time: '3:45 PM' },
      { step: 'Second Charge (Retry)', status: 'failed', time: '3:45 PM' },
      { step: 'Duplicate Detected', status: 'done', time: '3:45 PM' },
      { step: 'Auto-Reversal Initiated', status: 'done', time: '3:46 PM' },
      { step: 'Credit to Account', status: 'pending', time: 'Within 24 hrs' },
    ]
  },
  {
    id: 'auth-failed',
    icon: '🔐',
    label: 'Authentication Failed',
    tag: 'RESOLVED',
    tagColor: '#16a34a',
    amount: '₹6,750',
    txnId: 'TXN-2024-005',
    summary: 'OTP failed — no money deducted',
    whatHappened: 'Payment required OTP verification. The OTP failed (expired, incorrect entry, or timeout). The payment was rejected before authorization — your account was never charged.',
    customerMessage: "Your OTP verification didn't go through. Your money was NOT charged. Please try again with a fresh OTP — it expires in 10 minutes.",
    internalAction: 'No action needed. Customer needs to retry. Monitor if customer reports repeated OTP failures — may indicate account security concern.',
    priority: 'Low',
    priorityColor: '#16a34a',
    escalate: false,
    timeline: [
      { step: 'Payment Initiated', status: 'done', time: '11:20 AM' },
      { step: 'OTP Sent to Customer', status: 'done', time: '11:20 AM' },
      { step: 'OTP Verification', status: 'failed', time: '11:22 AM' },
      { step: 'Payment Rejected', status: 'failed', time: '11:22 AM' },
      { step: 'Account Unchanged', status: 'done', time: '11:22 AM' },
    ]
  },
  {
    id: 'settlement-pending',
    icon: '📋',
    label: 'Settlement Pending',
    tag: 'IN PROGRESS',
    tagColor: '#2563eb',
    amount: '₹21,000',
    txnId: 'TXN-2024-006',
    summary: 'Captured, awaiting final settlement',
    whatHappened: 'Payment was captured successfully and is now in the settlement queue with your bank. Settlement completes within 24–48 hours.',
    customerMessage: "Your payment was successful and is now being settled. This usually takes 24–48 hours. You can track the status in your transaction history.",
    internalAction: 'No action needed. Standard settlement timeframe. Follow up if not settled after 3 days.',
    priority: 'Low',
    priorityColor: '#16a34a',
    escalate: false,
    timeline: [
      { step: 'Payment Initiated', status: 'done', time: '8:00 AM' },
      { step: 'Authorization', status: 'done', time: '8:00 AM' },
      { step: 'Capture Confirmed', status: 'done', time: '8:01 AM' },
      { step: 'Settlement Queue', status: 'pending', time: '24–48 hrs' },
    ]
  },
]

type TabKey = 'customer' | 'internal' | 'timeline'

export default function Home() {
  const [selected, setSelected] = useState(SCENARIOS[0])
  const [activeTab, setActiveTab] = useState<TabKey>('customer')
  const [txnInput, setTxnInput] = useState('')
  const [amtInput, setAmtInput] = useState('')
  const [liveResult, setLiveResult] = useState<null | typeof SCENARIOS[0]>(null)
  const [loading, setLoading] = useState(false)

  function analyze() {
    if (!txnInput) return
    setLoading(true)
    setTimeout(() => {
      const rand = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
      setLiveResult({ ...rand, txnId: txnInput, amount: amtInput ? `₹${amtInput}` : rand.amount })
      setLoading(false)
    }, 1200)
  }

  const display = liveResult || selected

  const timelineStatusStyle = (status: string) => {
    if (status === 'done') return { background: '#16a34a', color: '#fff' }
    if (status === 'failed') return { background: '#dc2626', color: '#fff' }
    return { background: '#d1d5db', color: '#374151' }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Top Nav */}
      <nav style={{ borderBottom: '1px solid #1e293b', padding: '0 32px', display: 'flex', alignItems: 'center', height: 60, gap: 12 }}>
        <span style={{ fontSize: 20 }}>🔍</span>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.3px' }}>Money Forensics</span>
        <span style={{ marginLeft: 8, fontSize: 11, background: '#1e3a5f', color: '#60a5fa', padding: '2px 8px', borderRadius: 4, fontWeight: 600, letterSpacing: 0.5 }}>BETA</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#64748b' }}>By Avani Aravind</span>
        <a
          href="https://github.com/avaniaravind33-stack/money-forensics"
          target="_blank"
          rel="noreferrer"
          style={{ marginLeft: 16, fontSize: 13, color: '#94a3b8', textDecoration: 'none', border: '1px solid #334155', padding: '4px 12px', borderRadius: 6 }}
        >
          GitHub ↗
        </a>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '56px 24px 40px' }}>
        <div style={{ display: 'inline-block', background: '#1e293b', border: '1px solid #334155', borderRadius: 20, padding: '4px 16px', fontSize: 12, color: '#94a3b8', marginBottom: 20, letterSpacing: 0.5 }}>
          PAYMENT FORENSICS ENGINE
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px', letterSpacing: '-1px', lineHeight: 1.1 }}>
          Where did my money go?
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: '#94a3b8', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Reconstruct the complete payment event chain — authorization, capture, settlement, refund — and give customers a clear answer instantly.
        </p>

        {/* Live Analyzer */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: '28px 32px', maxWidth: 560, margin: '0 auto', textAlign: 'left' }}>
          <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 16, letterSpacing: 0.5 }}>TRY THE ANALYZER</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input
              placeholder="Transaction ID (e.g. TXN-9281)"
              value={txnInput}
              onChange={e => setTxnInput(e.target.value)}
              style={{ flex: 2, background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none' }}
            />
            <input
              placeholder="Amount (₹)"
              value={amtInput}
              onChange={e => setAmtInput(e.target.value)}
              style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none' }}
            />
          </div>
          <button
            onClick={analyze}
            disabled={!txnInput || loading}
            style={{
              width: '100%', background: txnInput ? '#3b82f6' : '#1e293b', color: txnInput ? '#fff' : '#64748b',
              border: 'none', borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 600, cursor: txnInput ? 'pointer' : 'default', transition: 'background 0.2s'
            }}
          >
            {loading ? '🔍 Analyzing...' : '🔍 Analyze Transaction'}
          </button>
          {liveResult && (
            <div style={{ marginTop: 16, background: '#0f172a', borderRadius: 8, padding: '12px 16px', borderLeft: '3px solid #3b82f6' }}>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Result for <strong style={{ color: '#e2e8f0' }}>{liveResult.txnId}</strong></div>
              <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>{liveResult.icon} {liveResult.label}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: '#94a3b8' }}>{liveResult.summary}</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>

        {/* Scenario List */}
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>CASE SCENARIOS</div>
          {SCENARIOS.map(s => (
            <div
              key={s.id}
              onClick={() => { setSelected(s); setLiveResult(null); setActiveTab('customer') }}
              style={{
                padding: '12px 14px', borderRadius: 10, marginBottom: 6, cursor: 'pointer',
                background: selected.id === s.id && !liveResult ? '#1e293b' : 'transparent',
                border: selected.id === s.id && !liveResult ? '1px solid #334155' : '1px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', paddingLeft: 24 }}>{s.amount}</div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, overflow: 'hidden' }}>

          {/* Panel Header */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>{display.icon}</span>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f8fafc' }}>{display.label}</h2>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, padding: '3px 8px', borderRadius: 4, background: display.tagColor + '22', color: display.tagColor }}>
                    {display.tag}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div><span style={{ fontSize: 11, color: '#64748b' }}>TXN ID  </span><span style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>{display.txnId}</span></div>
                  <div><span style={{ fontSize: 11, color: '#64748b' }}>AMOUNT  </span><span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{display.amount}</span></div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>PRIORITY  </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: display.priorityColor }}>{display.priority}</span>
                  </div>
                </div>
              </div>
              {display.escalate && (
                <div style={{ background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#fca5a5', fontWeight: 600 }}>
                  ⚠️ Escalation Required
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #334155' }}>
            {(['customer', 'internal', 'timeline'] as TabKey[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '12px', fontSize: 13, fontWeight: 600,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: activeTab === tab ? '#3b82f6' : '#64748b',
                  borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                {tab === 'customer' ? '👤 Customer View' : tab === 'internal' ? '🔧 Internal Action' : '📅 Event Timeline'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '28px' }}>

            {activeTab === 'customer' && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>WHAT HAPPENED</div>
                  <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: 0, fontSize: 15 }}>{display.whatHappened}</p>
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>💬 WHAT TO TELL THE CUSTOMER</div>
                  <p style={{ color: '#e2e8f0', lineHeight: 1.7, margin: 0, fontSize: 15, fontStyle: 'italic' }}>
                    "{display.customerMessage}"
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'internal' && (
              <div>
                <div style={{ background: '#0f172a', border: `1px solid ${display.escalate ? '#991b1b' : '#334155'}`, borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: display.escalate ? '#f87171' : '#94a3b8', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
                    {display.escalate ? '⚠️ ESCALATION REQUIRED' : '✅ NO ESCALATION NEEDED'}
                  </div>
                  <p style={{ color: '#e2e8f0', lineHeight: 1.7, margin: 0, fontSize: 14 }}>{display.internalAction}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '16px 18px' }}>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>PRIORITY LEVEL</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: display.priorityColor }}>{display.priority}</div>
                  </div>
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '16px 18px' }}>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>ESCALATE</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: display.escalate ? '#f87171' : '#4ade80' }}>
                      {display.escalate ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: 1, marginBottom: 20 }}>PAYMENT EVENT CHAIN</div>
                <div style={{ position: 'relative' }}>
                  {display.timeline.map((event, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < display.timeline.length - 1 ? 0 : 0, position: 'relative' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, flexShrink: 0, zIndex: 1,
                          ...timelineStatusStyle(event.status)
                        }}>
                          {event.status === 'done' ? '✓' : event.status === 'failed' ? '✗' : '◔'}
                        </div>
                        {i < display.timeline.length - 1 && (
                          <div style={{ width: 2, flex: 1, background: event.status === 'done' ? '#16a34a55' : '#334155', minHeight: 28 }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: 24, paddingTop: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: event.status === 'failed' ? '#f87171' : '#e2e8f0' }}>{event.step}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{event.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '32px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center' }}>
          {[
            { value: '6', label: 'Payment Scenarios', desc: 'Auth → Settlement' },
            { value: '<1s', label: 'Analysis Time', desc: 'Real-time forensics' },
            { value: '40%', label: 'Fewer Support Tickets', desc: 'Self-service resolution' },
            { value: '100%', label: 'Event Coverage', desc: 'Complete audit trail' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#3b82f6', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginTop: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 24px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
        <span style={{ fontSize: 13, color: '#475569' }}>
          Built by <strong style={{ color: '#94a3b8' }}>Avani Aravind</strong> · Payment Forensics Portfolio Project ·
          <a href="https://github.com/avaniaravind33-stack/money-forensics" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', marginLeft: 8, textDecoration: 'none' }}>GitHub →</a>
        </span>
      </div>
    </div>
  )
}
