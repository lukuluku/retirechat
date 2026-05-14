import { useState, useRef, useEffect } from 'react'
import './App.css'

const SUGGESTIONS = [
  'What are the 401(k) limits for 2025?',
  'When should I claim Social Security?',
  'How much do I need to retire at 65?',
  'What is an RMD?',
]

const MOCK_RESPONSES = [
  {
    keywords: ['401k', '401(k)', 'limit', '2025'],
    answer: `**The 2025 401(k) contribution limit is $23,500.**

That's up from $23,000 in 2024. Here's the full picture:

- **Under 50:** up to $23,500/year
- **Age 50–59 or 64+:** add a $7,500 catch-up = **$31,000 total**
- **Age 60–63:** special SECURE 2.0 catch-up of $11,250 = **$34,750 total**

If your employer offers a match, always contribute at least enough to get the full match — that's an instant 50–100% return on that portion.

*Would you like to know how a Roth 401(k) compares to a traditional 401(k)?*

> *Please consult a qualified financial advisor for decisions specific to your situation.*`,
  },
  {
    keywords: ['social security', 'claim', 'when'],
    answer: `**The longer you wait to claim Social Security, the higher your monthly benefit — up to age 70.**

Here's how it works:

- **Age 62** (earliest): reduced benefit — roughly 25–30% less than full
- **Full Retirement Age (FRA):** age 67 for anyone born after 1960 — 100% of your benefit
- **Age 70:** maximum benefit — about **24% more** than at FRA

**Break-even rule of thumb:** If you delay from 62 to 67, you break even around age 78–80. If you expect to live past 80, waiting usually pays off.

Married couples should coordinate — the higher earner delaying to 70 maximises the survivor benefit.

*Do you know your estimated Social Security benefit? You can check it at ssa.gov.*

> *Please consult a qualified financial advisor for decisions specific to your situation.*`,
  },
  {
    keywords: ['how much', 'retire', 'need', '65'],
    answer: `**A common rule of thumb: you need 25× your annual expenses saved by retirement.**

This is based on the **4% rule** — withdrawing 4% of your portfolio each year has historically lasted 30+ years.

**Example with round numbers:**
- Annual expenses in retirement: $60,000
- Target nest egg: $60,000 × 25 = **$1,500,000**

Other factors that affect your number:
- **Social Security** reduces how much you need to draw from savings
- **Healthcare costs** tend to rise after 65
- **Lifestyle** — travel, hobbies, housing plans

A simpler starting point: aim to replace **70–80% of your pre-retirement income.**

*What's your current annual income? I can help you estimate a savings target.*

> *Please consult a qualified financial advisor for decisions specific to your situation.*`,
  },
  {
    keywords: ['rmd', 'required minimum', 'distribution'],
    answer: `**An RMD (Required Minimum Distribution) is the minimum amount you must withdraw from retirement accounts each year, starting at age 73.**

Under the SECURE 2.0 Act, the RMD age increased from 72 to **73** (and will rise to 75 in 2033).

**Which accounts require RMDs?**
- Traditional 401(k)s and 403(b)s
- Traditional IRAs
- SEP and SIMPLE IRAs

**Roth IRAs do NOT require RMDs** during the owner's lifetime — one big advantage of Roth accounts.

The amount is calculated by dividing your account balance by an IRS life expectancy factor. Miss an RMD and the penalty is **25% of the amount you should have withdrawn** (down from 50% under SECURE 2.0).

*Are you approaching age 73, or planning ahead? I can explain Roth conversion strategies to reduce future RMDs.*

> *Please consult a qualified financial advisor for decisions specific to your situation.*`,
  },
  {
    keywords: ['ira', 'roth', 'traditional', 'difference'],
    answer: `**The key difference: Traditional IRA = tax break now. Roth IRA = tax break later.**

**Traditional IRA:**
- Contributions may be tax-deductible
- Money grows tax-deferred
- Withdrawals in retirement are taxed as income

**Roth IRA:**
- Contributions are made with after-tax dollars (no deduction)
- Money grows **tax-free**
- Qualified withdrawals in retirement are **completely tax-free**

**2025 contribution limit:** $7,000/year (or $8,000 if age 50+) — shared across all your IRAs.

**Roth income limits for 2025:** phases out between $150,000–$165,000 (single) and $236,000–$246,000 (married filing jointly).

General rule: if you expect to be in a *higher* tax bracket in retirement, Roth tends to win.

*Would you like to explore Roth conversion strategies?*

> *Please consult a qualified financial advisor for decisions specific to your situation.*`,
  },
  {
    keywords: ['catch-up', 'catchup', 'over 50', 'age 50'],
    answer: `**Catch-up contributions let you save extra once you turn 50 — a powerful way to accelerate retirement savings.**

**2025 catch-up limits:**

- **401(k) / 403(b):** +$7,500/year → total of **$31,000**
- **Ages 60–63 (SECURE 2.0 bonus):** +$11,250 instead → total of **$34,750**
- **IRA:** +$1,000/year → total of **$8,000**

If you're 50 and maxing out both a 401(k) and an IRA, you can shelter up to **$39,000/year** from taxes in 2025.

Even contributing an extra $200/month starting at 50 can add $50,000–$80,000 by age 65, depending on returns.

*Are you currently maxing out your employer's match before making catch-up contributions?*

> *Please consult a qualified financial advisor for decisions specific to your situation.*`,
  },
  {
    keywords: ['4% rule', 'four percent', 'withdrawal'],
    answer: `**The 4% rule says you can withdraw 4% of your portfolio in year one of retirement, then adjust for inflation each year — and historically your money lasts 30+ years.**

**Example:**
- Portfolio: $1,000,000
- Year 1 withdrawal: $40,000
- Year 2 (2% inflation): $40,800
- And so on…

The rule comes from the **Trinity Study** (1994), which tested this across different market conditions going back to 1926.

**Caveats to know:**
- It was designed for a **30-year retirement** — retiring at 55 may need a lower rate (3–3.5%)
- A major market crash in the first few years ("sequence of returns risk") can derail it
- Some planners now suggest **3.5%** to be safer given current conditions

*Do you know roughly how large your portfolio will be at retirement? I can help you estimate a safe withdrawal amount.*

> *Please consult a qualified financial advisor for decisions specific to your situation.*`,
  },
  {
    keywords: ['asset allocation', 'stocks', 'bonds', 'portfolio', 'target date'],
    answer: `**Asset allocation is how you split your portfolio between stocks, bonds, and other assets — it's the single biggest driver of long-term returns and risk.**

**Classic rule of thumb:** subtract your age from 110 to get your stock percentage.
- Age 40 → 70% stocks, 30% bonds
- Age 60 → 50% stocks, 50% bonds

**Target-date funds** do this automatically — a "2045 Fund" gradually shifts from aggressive to conservative as you approach 2045. They're a great set-it-and-forget-it option.

**General principles:**
- Younger = more stocks (time to recover from downturns)
- Closer to retirement = more bonds (stability over growth)
- Diversify *within* asset classes (US + international stocks, short + long-term bonds)

*How many years until you plan to retire? I can suggest a rough allocation range.*

> *Please consult a qualified financial advisor for decisions specific to your situation.*`,
  },
]

const FALLBACK_RESPONSE = `That's a great retirement planning question. Here's what I can tell you:

Retirement planning involves balancing **how much you save**, **where you save it**, and **when you plan to retire**. Key principles to keep in mind:

- Start as early as possible — compounding works best over long time horizons
- Max out employer matches in your 401(k) before anything else
- Diversify across account types (pre-tax, Roth, taxable) for tax flexibility in retirement
- Revisit your plan at least once a year as your income and goals change

For a question this specific, a qualified financial advisor can give you personalised guidance based on your full financial picture.

*Is there a specific area of retirement planning you'd like to explore — such as Social Security, 401(k) limits, or withdrawal strategies?*

> *Please consult a qualified financial advisor for decisions specific to your situation.*`

function getMockResponse(text) {
  const lower = text.toLowerCase()
  for (const { keywords, answer } of MOCK_RESPONSES) {
    if (keywords.some(k => lower.includes(k))) return answer
  }
  return FALLBACK_RESPONSE
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Simple markdown renderer — no dependencies
function Markdown({ text }) {
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={i}>
          {items.map((item, j) => <li key={j}><InlineText text={item} /></li>)}
        </ul>
      )
      continue
    }

    if (/^\d+\. /.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={i}>
          {items.map((item, j) => <li key={j}><InlineText text={item} /></li>)}
        </ol>
      )
      continue
    }

    if (line.trim() === '') {
      elements.push(<br key={i} />)
    } else {
      elements.push(<p key={i}><InlineText text={line} /></p>)
    }
    i++
  }

  return <div className="markdown">{elements}</div>
}

function InlineText({ text }) {
  // Handle **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={i}>{part.slice(1, -1)}</em>
        return part
      })}
    </>
  )
}

function Avatar({ role }) {
  return (
    <div className={`avatar ${role}`}>
      {role === 'user' ? '👤' : '💼'}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="message assistant">
      <Avatar role="assistant" />
      <div className="bubble-wrap">
        <div className="bubble typing">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', content: trimmed, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Simulate network delay for realistic demo feel
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 800))
      const reply = getMockResponse(trimmed)
      setMessages(prev => [...prev, { role: 'assistant', content: reply, time: new Date() }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  function clearChat() {
    setMessages([])
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo-mark">💼</div>
          <div className="header-text">
            <h1>RetireChat</h1>
            <p>AI-powered retirement planning assistant</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button className="new-chat-btn" onClick={clearChat} title="Start new chat">
            + New chat
          </button>
        )}
      </header>

      <main className="chat-area">
        {messages.length === 0 && (
          <div className="welcome">
            <div className="welcome-icon">💼</div>
            <h2>How can I help you plan for retirement?</h2>
            <p>Get started with a question below, or type your own.</p>
            <div className="suggestions">
              {SUGGESTIONS.map(s => (
                <button key={s} className="chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role} fade-in`}>
            {m.role === 'assistant' && <Avatar role="assistant" />}
            <div className="bubble-wrap">
              <div className="bubble">
                {m.role === 'assistant'
                  ? <Markdown text={m.content} />
                  : m.content
                }
              </div>
              {m.time && (
                <span className={`timestamp ${m.role}`}>{formatTime(m.time)}</span>
              )}
            </div>
            {m.role === 'user' && <Avatar role="user" />}
          </div>
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>

      <div className="input-wrapper">
        <form className="input-bar" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about retirement planning…"
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
        <p className="disclaimer">
          Not financial advice. Always consult a qualified financial advisor.
        </p>
      </div>
    </div>
  )
}
