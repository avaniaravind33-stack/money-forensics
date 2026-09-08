import streamlit as st
import numpy as np
import scipy.integrate as spi
import plotly.graph_objects as go
import plotly.express as px

# -----------------------------
# PAGE CONFIG
# -----------------------------
st.set_page_config(
    page_title="The Mathematics of Forgotten Money",
    page_icon="💳",
    layout="wide"
)

st.title("💳 The Mathematics of Forgotten Money")
st.markdown("### A Differential Equation Model of Gift-Card Issuance, Redemption & Breakage")
st.write("Analyze financial dynamics, seasonal peaks, breakage leakage, and steady-state balance limits using calculus and differential equations.")

# -----------------------------
# SIDEBAR & STRESS TESTS
# -----------------------------
st.sidebar.header("⚙️ Model Parameters")

# Stress Test Preset State
if "stress_preset" not in st.state_counts if hasattr(st, "state_counts") else True:
    if "preset" not in st.session_state:
        st.session_state.preset = "default"

st.sidebar.subheader("🔥 Financial Stress Tests")
col_s1, col_s2 = st.sidebar.columns(2)
if col_s1.button("🎄 Holiday Stress"):
    st.session_state.preset = "holiday"
if col_s2.button("📉 High Redemption"):
    st.session_state.preset = "high_redemption"

col_s3, col_s4 = st.sidebar.columns(2)
if col_s3.button("💀 High Breakage"):
    st.session_state.preset = "high_breakage"
if col_s4.button("🔄 Reset Default"):
    st.session_state.preset = "default"

# Set defaults based on preset
defaults = {
    "default": {"B0": 1000000, "I0": 100000, "r": 8.0, "b": 2.0, "A": 20.0, "months": 24},
    "holiday": {"B0": 1000000, "I0": 200000, "r": 8.0, "b": 2.0, "A": 60.0, "months": 24},
    "high_redemption": {"B0": 1000000, "I0": 100000, "r": 25.0, "b": 2.0, "A": 20.0, "months": 24},
    "high_breakage": {"B0": 1000000, "I0": 100000, "r": 5.0, "b": 8.0, "A": 20.0, "months": 24},
}[st.session_state.preset]

if st.session_state.preset != "default":
    st.sidebar.info(f"Active Preset: **{st.session_state.preset.replace('_', ' ').title()}**")

B0 = st.sidebar.slider("Initial Balance B(0) (₹)", 0, 5000000, defaults["B0"], 50000)
I0 = st.sidebar.slider("Monthly Issuance I₀ (₹)", 10000, 500000, defaults["I0"], 10000)
r_pct = st.sidebar.slider("Redemption Rate r (%)", 0.0, 30.0, defaults["r"], 0.5)
b_pct = st.sidebar.slider("Breakage Rate b (%)", 0.0, 10.0, defaults["b"], 0.5)
A_pct = st.sidebar.slider("Seasonality A (%)", 0.0, 100.0, defaults["A"], 5.0)
months = st.sidebar.slider("Simulation Horizon (months)", 1, 60, defaults["months"])

r = r_pct / 100.0
b = b_pct / 100.0
A = A_pct / 100.0
k = r + b

# -----------------------------
# NUMERICAL MODEL SOLVER
# -----------------------------
t = np.linspace(0, months, 500)
omega = 2 * np.pi / 12

def issuance(time):
    return I0 * (1 + A * np.sin(omega * time))

def model(time, B):
    return issuance(time) - k * B

solution = spi.solve_ivp(model, [0, months], [B0], t_eval=t)
B = solution.y[0]

redemption = r * B
breakage = b * B
new_issuance = issuance(t)
equilibrium = I0 / k if k > 0 else np.inf

# -----------------------------
# KEY METRICS
# -----------------------------
mcol1, mcol2, mcol3, mcol4 = st.columns(4)
mcol1.metric("Final Outstanding Balance", f"₹{B[-1]:,.0f}")
mcol2.metric("Long-Run Equilibrium B*", f"₹{equilibrium:,.0f}" if equilibrium != np.inf else "∞")
mcol3.metric("Final Monthly Redemption", f"₹{redemption[-1]:,.0f}")
mcol4.metric("Final Monthly Breakage", f"₹{breakage[-1]:,.0f}")

st.markdown("---")

# -----------------------------
# EXPLANATION ENGINE (FEATURE 3)
# -----------------------------
st.subheader("💡 Automated Financial Forensic Analysis")
pct_diff = ((B[-1] - equilibrium) / equilibrium) * 100 if equilibrium > 0 else 0
breakage_accumulated = np.trapz(breakage, t)

st.info(
    f"**Model Insight:** At current parameters (Redemption = **{r_pct:.1f}%**, Breakage = **{b_pct:.1f}%**):\n\n"
    f"- **Long-run Equilibrium ($B^*$):** The system stabilizes around **₹{equilibrium:,.0f}**. The current balance at Month {months} is **₹{B[-1]:,.0f}** ({abs(pct_diff):.1f}% {'above' if pct_diff > 0 else 'below'} steady state).\n"
    f"- **Accumulated Breakage (Unclaimed Cash):** Over {months} months, an estimated **₹{breakage_accumulated:,.0f}** of unredeemed gift cards is recognized as non-refundable merchant revenue (Breakage).\n"
    f"- **Accounting Impact (ASC 606 / Ind AS 115):** Merchants can recognize breakage as revenue in proportion to the pattern of rights exercised by the customer."
)

st.markdown("---")

# -----------------------------
# MAIN CHARTS
# -----------------------------
t1, t2 = st.tabs(["📈 Financial Dynamics", "🌊 Seasonal Issuance"])

with t1:
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=t, y=B, mode="lines", name="Outstanding Balance B(t)", line=dict(color="#3b82f6", width=3)))
    fig.add_trace(go.Scatter(x=t, y=redemption, mode="lines", name="Monthly Redemption r·B(t)", line=dict(color="#22c55e", width=2)))
    fig.add_trace(go.Scatter(x=t, y=breakage, mode="lines", name="Monthly Breakage b·B(t)", line=dict(color="#ef4444", width=2, dash="dash")))

    if equilibrium != np.inf:
        fig.add_hline(y=equilibrium, line_dash="dot", line_color="#94a3b8", annotation_text=f"Equilibrium B* = ₹{equilibrium:,.0f}")

    fig.update_layout(
        title="Gift-Card Outstanding Balance, Redemption, and Breakage Over Time",
        xaxis_title="Time (months)",
        yaxis_title="Amount (₹)",
        template="plotly_dark",
        height=450
    )
    st.plotly_chart(fig, use_container_width=True)

with t2:
    fig2 = go.Figure()
    fig2.add_trace(go.Scatter(x=t, y=new_issuance, mode="lines", name="Seasonal Issuance I(t)", line=dict(color="#a855f7", width=3)))
    fig2.update_layout(
        title="Seasonal Gift-Card Issuance Wave Pattern",
        xaxis_title="Time (months)",
        yaxis_title="New Issuance I(t) (₹)",
        template="plotly_dark",
        height=450
    )
    st.plotly_chart(fig2, use_container_width=True)

st.markdown("---")

# -----------------------------
# SENSITIVITY HEATMAP (FEATURE 1)
# -----------------------------
st.subheader("🔥 Sensitivity Heatmap: Long-Run Balance (B*)")
st.write("Explore how varying Redemption ($r$) and Breakage ($b$) rates impact the steady-state outstanding balance $B^* = \\frac{I_0}{r+b}$.")

r_range = np.linspace(0.01, 0.30, 30)
b_range = np.linspace(0.005, 0.10, 30)
R_grid, B_grid = np.meshgrid(r_range, b_range)
Z_equilibrium = I0 / (R_grid + B_grid)

fig_heat = go.Figure(data=go.Heatmap(
    x=r_range * 100,
    y=b_range * 100,
    z=Z_equilibrium,
    colorscale="Viridis",
    colorbar=dict(title="Equilibrium B* (₹)")
))

# Highlight current operational point
fig_heat.add_trace(go.Scatter(
    x=[r_pct], y=[b_pct],
    mode="markers+text",
    marker=dict(color="red", size=14, symbol="cross"),
    name="Current Setup",
    text=[" Current"],
    textposition="top right"
))

fig_heat.update_layout(
    xaxis_title="Redemption Rate r (%)",
    yaxis_title="Breakage Rate b (%)",
    template="plotly_dark",
    height=480
)
st.plotly_chart(fig_heat, use_container_width=True)

st.markdown("---")

# -----------------------------
# MATHEMATICAL THEORY
# -----------------------------
st.subheader("📐 Mathematical Model Formulation")
st.latex(r"\frac{dB}{dt} = I(t) - (r + b)B(t)")
st.write("Where:")
st.markdown(r"""
- $B(t)$: Outstanding gift-card balance liability at time $t$
- $I(t) = I_0 (1 + A \sin(\omega t))$: Monthly new gift card issuance with annual seasonal variation
- $r$: Constant rate of monthly redemption
- $b$: Constant rate of breakage (expired / unredeemed funds)
- $k = r + b$: Combined total decay rate
""")

st.latex(r"B^* = \lim_{t \to \infty} \bar{B}(t) = \frac{I_0}{r + b}")
st.write("The long-run average equilibrium balance depends solely on the mean issuance rate divided by the total decay rate $r + b$.")
