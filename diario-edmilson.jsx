import { useState, useEffect } from "react";

const STORAGE_KEY = "diario_edmilson_v1";

const defaultEntry = {
  doraAcordar: null,
  rigidezMinutos: "",
  localPior: [],
  ajudouMelhorar: [],
  tempoSentado: null,
  movimentacao: null,
  atividade: [],
  dorAposMov: null,
  medoTravar: null,
  medoSituacao: "",
  dificuldade: [],
  doraFimDia: null,
  esqueceuDor: null,
  esqueceuFazendo: "",
  melhorPorMais: "",
  observacoes: "",
};

const locais = ["Lombar", "Quadril direito", "Quadril esquerdo", "Pescoço", "Corpo todo", "Outro"];
const ajudas = ["Levantar da cama", "Caminhar", "Alongamento", "Café", "Banho quente", "Exercício", "Tempo", "Outro"];
const atividades = ["Caminhada", "Pilates", "Fortalecimento", "Beach tênis", "Vôlei", "Não fiz"];
const dificuldades = ["Colocar calçado", "Pegar algo no chão", "Entrar/sair do carro", "Levantar da cadeira", "Nenhuma"];

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(key) {
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
}

function PainScale({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
      {Array.from({ length: 11 }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          style={{
            width: 40, height: 40, borderRadius: "50%", border: "none",
            cursor: "pointer", fontWeight: 700, fontSize: 14,
            background: value === i
              ? i <= 3 ? "#22c55e" : i <= 6 ? "#f59e0b" : "#ef4444"
              : "#1e293b",
            color: value === i ? "#fff" : "#64748b",
            transition: "all 0.15s",
            boxShadow: value === i ? "0 0 0 3px rgba(255,255,255,0.2)" : "none",
          }}
        >{i}</button>
      ))}
    </div>
  );
}

function CheckGroup({ options, value = [], onChange, single = false }) {
  const toggle = (opt) => {
    if (single) {
      onChange(value[0] === opt ? [] : [opt]);
    } else {
      onChange(value.includes(opt)
        ? value.filter(v => v !== opt)
        : [...value, opt]
      );
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
      {options.map(opt => (
        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div onClick={() => toggle(opt)} style={{
            width: 20, height: 20, borderRadius: single ? "50%" : 4,
            border: "2px solid", borderColor: value.includes(opt) ? "#60a5fa" : "#334155",
            background: value.includes(opt) ? "#60a5fa" : "transparent",
            flexShrink: 0, transition: "all 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {value.includes(opt) && <div style={{ width: 8, height: 8, borderRadius: single ? "50%" : 2, background: "#fff" }} />}
          </div>
          <span style={{ color: "#cbd5e1", fontSize: 14 }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function Section({ title, emoji, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function DiaryForm({ entry, onChange, onSave }) {
  const set = (key, val) => onChange({ ...entry, [key]: val });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      <Section title="Ao acordar" emoji="🌅">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>Qual nota da sua dor?</p>
        <PainScale value={entry.doraAcordar} onChange={v => set("doraAcordar", v)} />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Rigidez matinal" emoji="⏱">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>Quanto tempo durou até o corpo "acordar"?</p>
        <input
          type="text"
          placeholder="Ex: 30 minutos, 1 hora..."
          value={entry.rigidezMinutos}
          onChange={e => set("rigidezMinutos", e.target.value)}
          style={{
            background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
            color: "#e2e8f0", padding: "10px 14px", fontSize: 14, width: "100%",
            outline: "none", boxSizing: "border-box",
          }}
        />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Localização" emoji="📍">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Onde estava pior ao acordar?</p>
        <CheckGroup options={locais} value={entry.localPior} onChange={v => set("localPior", v)} />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="O que ajudou" emoji="✨">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>O que ajudou mais a melhorar?</p>
        <CheckGroup options={ajudas} value={entry.ajudouMelhorar} onChange={v => set("ajudouMelhorar", v)} />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Sedentarismo" emoji="🪑">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Hoje ficou quanto tempo sentado sem levantar?</p>
        <CheckGroup single options={["Menos de 1h", "1–2h", "2–4h", "Mais de 4h"]} value={entry.tempoSentado ? [entry.tempoSentado] : []} onChange={v => set("tempoSentado", v[0] || null)} />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Movimento" emoji="🚶">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Quantas vezes se movimentou durante o dia?</p>
        <CheckGroup single options={["Pouco", "Médio", "Bastante"]} value={entry.movimentacao ? [entry.movimentacao] : []} onChange={v => set("movimentacao", v[0] || null)} />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Atividade" emoji="🏃">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Fez alguma atividade?</p>
        <CheckGroup options={atividades} value={entry.atividade} onChange={v => set("atividade", v)} />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Resposta ao movimento" emoji="📊">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Como ficou a dor depois de se movimentar?</p>
        <CheckGroup single options={["Muito melhor", "Melhor", "Igual", "Pior"]} value={entry.dorAposMov ? [entry.dorAposMov] : []} onChange={v => set("dorAposMov", v[0] || null)} />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Medo de travar" emoji="🔒">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Em algum momento teve medo de travar?</p>
        <CheckGroup single options={["Não", "Sim"]} value={entry.medoTravar ? [entry.medoTravar] : []} onChange={v => set("medoTravar", v[0] || null)} />
        {entry.medoTravar === "Sim" && (
          <input
            type="text"
            placeholder="Em qual situação?"
            value={entry.medoSituacao}
            onChange={e => set("medoSituacao", e.target.value)}
            style={{
              marginTop: 10, background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
              color: "#e2e8f0", padding: "10px 14px", fontSize: 14, width: "100%",
              outline: "none", boxSizing: "border-box",
            }}
          />
        )}
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Limitações" emoji="⚠️">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Hoje teve dificuldade para:</p>
        <CheckGroup options={dificuldades} value={entry.dificuldade} onChange={v => set("dificuldade", v)} />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Dor no fim do dia" emoji="🌙">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>Qual nota da sua dor agora?</p>
        <PainScale value={entry.doraFimDia} onChange={v => set("doraFimDia", v)} />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Janela sem dor" emoji="💭">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Hoje teve algum momento em que esqueceu da dor?</p>
        <CheckGroup single options={["Não", "Sim"]} value={entry.esqueceuDor ? [entry.esqueceuDor] : []} onChange={v => set("esqueceuDor", v[0] || null)} />
        {entry.esqueceuDor === "Sim" && (
          <input
            type="text"
            placeholder="Fazendo o quê?"
            value={entry.esqueceuFazendo}
            onChange={e => set("esqueceuFazendo", e.target.value)}
            style={{
              marginTop: 10, background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
              color: "#e2e8f0", padding: "10px 14px", fontSize: 14, width: "100%",
              outline: "none", boxSizing: "border-box",
            }}
          />
        )}
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Melhor estratégia" emoji="🎯">
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>O que fez você se sentir melhor por mais tempo hoje?</p>
        <textarea
          value={entry.melhorPorMais}
          onChange={e => set("melhorPorMais", e.target.value)}
          rows={2}
          placeholder="Escreva aqui..."
          style={{
            background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
            color: "#e2e8f0", padding: "10px 14px", fontSize: 14, width: "100%",
            outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
          }}
        />
      </Section>

      <div style={{ height: 1, background: "#1e293b", margin: "4px 0 24px" }} />

      <Section title="Observações livres" emoji="📝">
        <textarea
          value={entry.observacoes}
          onChange={e => set("observacoes", e.target.value)}
          rows={3}
          placeholder="Qualquer coisa que queira registrar..."
          style={{
            background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
            color: "#e2e8f0", padding: "10px 14px", fontSize: 14, width: "100%",
            outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
          }}
        />
      </Section>

      <button
        onClick={onSave}
        style={{
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          border: "none", borderRadius: 12, color: "#fff",
          padding: "16px", fontSize: 15, fontWeight: 700, cursor: "pointer",
          letterSpacing: "0.05em", marginTop: 8,
          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
        }}
      >
        Salvar dia de hoje
      </button>

      <p style={{ color: "#334155", fontSize: 12, textAlign: "center", marginTop: 12, fontStyle: "italic" }}>
        Não tente melhorar o diário. Só observe.<br />O objetivo não é acertar o comportamento, é entender como seu corpo funciona.
      </p>
    </div>
  );
}

function SummaryView({ allData, onBack }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = Object.keys(allData).sort();

  const generateSummary = async () => {
    setLoading(true);
    setError("");
    setSummary("");

    const entriesText = days.map(day => {
      const e = allData[day];
      return `
Data: ${formatDate(day)}
- Dor ao acordar: ${e.doraAcordar ?? "não respondido"}/10
- Rigidez matinal: ${e.rigidezMinutos || "não informado"}
- Local pior: ${e.localPior?.join(", ") || "não informado"}
- O que ajudou: ${e.ajudouMelhorar?.join(", ") || "não informado"}
- Tempo sentado: ${e.tempoSentado || "não informado"}
- Movimentação: ${e.movimentacao || "não informado"}
- Atividade: ${e.atividade?.join(", ") || "não informado"}
- Dor após movimento: ${e.dorAposMov || "não informado"}
- Medo de travar: ${e.medoTravar || "não informado"}${e.medoSituacao ? ` — ${e.medoSituacao}` : ""}
- Dificuldades: ${e.dificuldade?.join(", ") || "não informado"}
- Dor fim do dia: ${e.doraFimDia ?? "não respondido"}/10
- Esqueceu a dor: ${e.esqueceuDor || "não informado"}${e.esqueceuFazendo ? ` — ${e.esqueceuFazendo}` : ""}
- Melhor por mais tempo: ${e.melhorPorMais || "—"}
- Observações: ${e.observacoes || "—"}
      `.trim();
    }).join("\n\n---\n\n");

    const prompt = `Você é um fisioterapeuta clínico especialista em dor musculoesquelética. 
Abaixo estão os registros diários de dor de um paciente chamado Edmilson, coletados por ${days.length} dias.

O padrão clínico suspeito é: rigidez inflamatória matinal (melhora com movimento), componente de kinesiofobia, e dor lombar/quadril com resposta positiva à atividade física.

Analise os dados e produza um relatório clínico estruturado com:

1. **RESUMO DO PERÍODO** — quantos dias registrados, aderência, visão geral
2. **PADRÃO DE DOR** — variação da dor ao acordar vs fim do dia, tendência ao longo dos dias
3. **RIGIDEZ MATINAL** — padrão observado, duração média, variações
4. **RESPOSTA AO MOVIMENTO** — correlação entre atividade/movimentação e melhora da dor
5. **SEDENTARISMO** — padrão de tempo sentado e impacto
6. **COMPONENTE DE MEDO (KINESIOFOBIA)** — frequência do medo de travar, situações associadas
7. **JANELAS SEM DOR** — quando e como o paciente esquece da dor
8. **ESTRATÉGIAS EFICAZES** — o que mais ajudou de forma consistente
9. **HIPÓTESES CLÍNICAS** — interpretação dos padrões para guiar a conduta
10. **SUGESTÕES PARA PRÓXIMAS SESSÕES** — pontos a explorar com o paciente

Seja direto, técnico e útil. Use linguagem clínica mas sem jargão desnecessário. Destaque padrões consistentes e inconsistências relevantes.

DADOS:

${entriesText}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "";
      setSummary(text);
    } catch (e) {
      setError("Erro ao gerar resumo. Verifique a conexão e tente novamente.");
    }
    setLoading(false);
  };

  const avgPain = (key) => {
    const vals = days.map(d => allData[d][key]).filter(v => v !== null && v !== undefined);
    if (!vals.length) return "—";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  const countPattern = (key, value) => {
    return days.filter(d => {
      const v = allData[d][key];
      if (Array.isArray(v)) return v.includes(value);
      return v === value;
    }).length;
  };

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 14, marginBottom: 20, padding: 0 }}>
        ← Voltar ao diário
      </button>

      <h2 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Resumo Clínico</h2>
      <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>{days.length} dia(s) registrado(s) · {formatDate(days[0])} a {formatDate(days[days.length - 1])}</p>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Dor média\nao acordar", value: `${avgPain("doraAcordar")}/10`, color: "#f59e0b" },
          { label: "Dor média\nno fim do dia", value: `${avgPain("doraFimDia")}/10`, color: "#60a5fa" },
          { label: "Dias com\nmedo de travar", value: `${countPattern("medoTravar", "Sim")}/${days.length}`, color: "#f87171" },
          { label: "Dias que\nesqueceu a dor", value: `${countPattern("esqueceuDor", "Sim")}/${days.length}`, color: "#4ade80" },
        ].map(s => (
          <div key={s.label} style={{ background: "#1e293b", borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ color: s.color, fontSize: 22, fontWeight: 800, fontFamily: "monospace" }}>{s.value}</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 4, whiteSpace: "pre-line", lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {!summary && !loading && (
        <button
          onClick={generateSummary}
          disabled={days.length < 1}
          style={{
            width: "100%", background: days.length < 1 ? "#1e293b" : "linear-gradient(135deg, #0ea5e9, #6366f1)",
            border: "none", borderRadius: 12, color: days.length < 1 ? "#475569" : "#fff",
            padding: "16px", fontSize: 15, fontWeight: 700, cursor: days.length < 1 ? "not-allowed" : "pointer",
            boxShadow: days.length >= 1 ? "0 4px 20px rgba(14,165,233,0.35)" : "none",
          }}
        >
          {days.length < 1 ? "Registre pelo menos 1 dia" : `Gerar relatório clínico com IA (${days.length} dias)`}
        </button>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ color: "#60a5fa", fontSize: 13, marginBottom: 8 }}>Analisando padrões clínicos...</div>
          <div style={{ color: "#334155", fontSize: 12 }}>Isso pode levar alguns segundos</div>
        </div>
      )}

      {error && <p style={{ color: "#f87171", fontSize: 14, textAlign: "center" }}>{error}</p>}

      {summary && (
        <div>
          <div style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12,
            padding: 20, fontSize: 13, lineHeight: 1.8, color: "#cbd5e1",
            whiteSpace: "pre-wrap", marginTop: 8,
          }}>
            {summary}
          </div>
          <button
            onClick={generateSummary}
            style={{
              marginTop: 12, width: "100%", background: "none",
              border: "1px solid #334155", borderRadius: 10, color: "#64748b",
              padding: "12px", fontSize: 13, cursor: "pointer",
            }}
          >
            Regenerar análise
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [allData, setAllData] = useState(loadData);
  const [view, setView] = useState("diary"); // diary | history | summary
  const [selectedDay, setSelectedDay] = useState(todayKey());
  const [saved, setSaved] = useState(false);

  const currentEntry = allData[selectedDay] || { ...defaultEntry };

  const updateEntry = (entry) => {
    const updated = { ...allData, [selectedDay]: entry };
    setAllData(updated);
    saveData(updated);
  };

  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzp9D9m7Dz0f1ixROlZdvGObJX7uQZ6IwhWvu-cGeDWA7OpkggbkJWW8nKsqsV4MXi6/exec";

  const handleSave = async () => {
    saveData(allData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    try {
      const entry = allData[selectedDay] || currentEntry;
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: selectedDay, ...entry }),
      });
    } catch (e) {
      console.error("Erro ao salvar no Sheets:", e);
    }
  };

  const days = Object.keys(allData).sort().reverse();

  if (view === "summary") {
    return (
      <div style={{
        minHeight: "100vh", background: "#0f172a", fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        padding: "24px 20px", maxWidth: 520, margin: "0 auto",
      }}>
        <SummaryView allData={allData} onBack={() => setView("diary")} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 20px 20px", borderBottom: "1px solid #1e293b",
        position: "sticky", top: 0, background: "#0f172a", zIndex: 10,
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: "#475569", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>Diário de Dor</div>
              <div style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 800 }}>Edmilson</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setView("diary")}
                style={{
                  padding: "8px 12px", borderRadius: 8, border: "none", fontSize: 12, cursor: "pointer",
                  background: view === "diary" ? "#1e3a5f" : "#1e293b",
                  color: view === "diary" ? "#60a5fa" : "#64748b", fontFamily: "inherit",
                }}
              >Hoje</button>
              <button
                onClick={() => setView("history")}
                style={{
                  padding: "8px 12px", borderRadius: 8, border: "none", fontSize: 12, cursor: "pointer",
                  background: view === "history" ? "#1e3a5f" : "#1e293b",
                  color: view === "history" ? "#60a5fa" : "#64748b", fontFamily: "inherit",
                }}
              >Histórico</button>
              <button
                onClick={() => setView("summary")}
                style={{
                  padding: "8px 12px", borderRadius: 8, border: "none", fontSize: 12, cursor: "pointer",
                  background: "#1e293b", color: "#a78bfa", fontFamily: "inherit",
                }}
              >Resumo IA</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 20px" }}>

        {view === "history" ? (
          <div>
            <h3 style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              {days.length} dia(s) registrado(s)
            </h3>
            {days.length === 0 && (
              <p style={{ color: "#475569", fontSize: 14, textAlign: "center", marginTop: 40 }}>Nenhum dia registrado ainda.</p>
            )}
            {days.map(day => {
              const e = allData[day];
              return (
                <div
                  key={day}
                  onClick={() => { setSelectedDay(day); setView("diary"); }}
                  style={{
                    background: "#1e293b", borderRadius: 12, padding: "16px", marginBottom: 10,
                    cursor: "pointer", border: "1px solid #334155",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14 }}>{formatDate(day)}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#f59e0b", fontSize: 12 }}>↑ {e.doraAcordar ?? "—"}</span>
                      <span style={{ color: "#64748b", fontSize: 12 }}>→</span>
                      <span style={{ color: "#60a5fa", fontSize: 12 }}>↓ {e.doraFimDia ?? "—"}</span>
                    </div>
                  </div>
                  <div style={{ color: "#475569", fontSize: 11, marginTop: 6 }}>
                    {e.atividade?.join(" · ") || "sem atividade"} · {e.movimentacao || "—"} mov.
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#60a5fa", fontSize: 14, fontWeight: 700 }}>
                  {selectedDay === todayKey() ? "Hoje" : formatDate(selectedDay)}
                </span>
                {saved && (
                  <span style={{ color: "#4ade80", fontSize: 12, animation: "fadeIn 0.2s" }}>✓ Salvo</span>
                )}
              </div>
              {selectedDay !== todayKey() && (
                <button
                  onClick={() => setSelectedDay(todayKey())}
                  style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 12, padding: 0 }}
                >
                  Ir para hoje →
                </button>
              )}
            </div>
            <DiaryForm entry={currentEntry} onChange={updateEntry} onSave={handleSave} />
          </div>
        )}
      </div>
    </div>
  );
}
