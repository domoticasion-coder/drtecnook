import React, { useState } from "react";
import { Hammer, Search, ShieldCheck, Mail, Phone, Clock, FileText, CheckCircle2, Cpu, HelpCircle, ArrowRight } from "lucide-react";

interface TicketDetails {
  ticket_number: string;
  customer_name: string;
  device_type: string;
  brand_model: string;
  issue_description: string;
  status: "recibido" | "en_diagnostico" | "presupuestado" | "en_reparacion" | "listo_para_entregar" | "entregado";
  status_notes?: string;
  created_at: string;
}

export const ServicioTecnicoPage: React.FC = () => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deviceType, setDeviceType] = useState("Celular");
  const [brandModel, setBrandModel] = useState("");
  const [issue, setIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState<string | null>(null);

  // Ticket status tracker state
  const [trackerInput, setTrackerInput] = useState("");
  const [trackedTicket, setTrackedTicket] = useState<TicketDetails | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // FAQs state toggle
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqData = [
    { q: "¿Cuánto tiempo demora el diagnóstico de mi equipo?", a: "El diagnóstico inicial es totalmente gratuito y demora entre 24 y 48 horas hábiles. Una vez finalizado, te enviamos el presupuesto detallado por correo o WhatsApp." },
    { q: "¿Los repuestos que utilizan son originales?", a: "Sí, en Dr Tecno trabajamos exclusivamente con módulos y componentes originales de marcas oficiales. Todas nuestras reparaciones cuentan con repuestos certificados." },
    { q: "¿Qué garantía tienen las reparaciones?", a: "Todas nuestras intervenciones de hardware (cambio de pantallas, baterías, soldadura microelectrónica) cuentan con una garantía escrita oficial de 3 meses." },
    { q: "¿Tengo que sacar un turno previo para llevar mi dispositivo?", a: "No es estrictamente necesario, podés traer tu equipo directamente a nuestro laboratorio central de Lunes a Sábados de 09:00 a 20:00 hs. No obstante, registrando la solicitud online agilizás el ingreso en mesa." }
  ];

  // Submit service request
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !brandModel.trim() || !issue.trim()) {
      alert("Por favor, completá todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          device_type: deviceType,
          brand_model: brandModel,
          issue_description: issue
        })
      });

      if (response.ok) {
        const data = await response.json();
        setNewTicket(data.ticket_number);
        // Clear form fields
        setName("");
        setEmail("");
        setPhone("");
        setBrandModel("");
        setIssue("");
      } else {
        alert("Ocurrió un error al procesar tu solicitud técnico. Por favor intentá nuevamente.");
      }
    } catch (err) {
      console.error("Error submitting tech service:", err);
      alert("Error de conexión al servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search status of a ticket
  const handleSearchTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerInput.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setTrackedTicket(null);

    try {
      const response = await fetch(`/api/service-requests/${encodeURIComponent(trackerInput.trim().toUpperCase())}`);
      if (response.ok) {
        const data = await response.json();
        setTrackedTicket(data);
      } else if (response.status === 404) {
        setSearchError("No se encontró ningún ticket de servicio técnico con ese número. Verificá si está escrito correctamente (Ej: TEC-1001).");
      } else {
        setSearchError("Ocurrió un error al buscar el ticket.");
      }
    } catch (err) {
      console.error("Error searching ticket status:", err);
      setSearchError("Error de conexión al servidor.");
    } finally {
      setIsSearching(false);
    }
  };

  const statusWorkflow = [
    { id: "recibido", label: "Recibido", color: "bg-blue-500", desc: "Equipo ingresado al laboratorio." },
    { id: "en_diagnostico", label: "En Diagnóstico", color: "bg-amber-500", desc: "Ingenieros revisando componentes." },
    { id: "presupuestado", label: "Presupuestado", color: "bg-purple-500", desc: "Esperando aprobación de presupuesto." },
    { id: "en_reparacion", label: "En Reparación", color: "bg-sky-500", desc: "Manos a la obra aplicando componentes." },
    { id: "listo_para_entregar", label: "Listo para Entregar", color: "bg-emerald-500", desc: "Pruebas de calidad aprobadas. ¡Listo!" },
    { id: "entregado", label: "Entregado", color: "bg-gray-500", desc: "Retirado con éxito por el cliente." }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 font-sans tech-bg">
      
      {/* Page Header */}
      <div className="border-b border-border/40 pb-4 text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-serif uppercase tracking-widest text-accent font-bold">Soporte Técnico</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Laboratorio Dr Tecno</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Reparaciones de celulares, laptops y consolas con repuestos 100% originales, diagnóstico sin cargo en 24 horas y garantía oficial certificada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* ================= LEFT COLUMN: REGISTRATION FORM ================= */}
        <section className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1.5 border-b border-border/30 pb-3">
            <span className="px-2.5 py-0.5 bg-accent/15 border border-accent/25 text-[9px] text-accent font-serif uppercase font-bold rounded">
              Nueva Solicitud
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <Hammer className="w-5 h-5 text-accent animate-pulse-subtle" />
              <span>Ingreso de Dispositivo Online</span>
            </h2>
            <p className="text-xs text-muted-foreground">Registrá tu equipo para agilizar la recepción presencial o envío.</p>
          </div>

          {newTicket ? (
            <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-center space-y-4 animate-scale-up">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-lg text-foreground">¡Solicitud Ingresada con Éxito!</h4>
                <p className="text-xs text-muted-foreground">Tu número de ticket asignado es:</p>
                <div className="inline-block px-4 py-2 bg-background border border-border rounded-lg text-xl font-serif font-bold text-accent tracking-widest mt-2 select-all">
                  {newTicket}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-normal">
                Guardá este código para consultar el estado de tu reparación en tiempo real en la columna de la derecha. Te enviamos un correo con los pasos a seguir.
              </p>
              <button
                onClick={() => setNewTicket(null)}
                className="mt-2 px-4 py-2 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 rounded-lg text-xs font-serif uppercase font-bold transition-colors cursor-pointer"
              >
                Registrar otra Orden
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold">Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Sofía Martínez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold">Teléfono de contacto *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: +54 11 9876-5432"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-semibold">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="Ej: sofia@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold">Tipo de Dispositivo *</label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground outline-none focus:border-accent"
                  >
                    {["Celular", "Notebook", "Tablet", "Consola", "PC de Escritorio", "Otro"].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold">Marca y Modelo del equipo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Samsung S23 Ultra / ASUS ZenBook"
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-semibold">Falla o problema detallado *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describí los síntomas de tu equipo (Ej: No prende tras golpe, pantalla astillada, batería hinchada, limpieza técnica general...)"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground outline-none focus:border-accent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-accent text-accent-foreground font-serif font-bold uppercase tracking-wider rounded-lg hover:bg-accent/90 disabled:opacity-40 transition-colors flex items-center justify-center gap-2 cursor-pointer pt-0.5"
              >
                <span>{isSubmitting ? "Registrando Orden..." : "Generar Ticket de Turno"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

        {/* ================= RIGHT COLUMN: LIVE TRACKER & WORKFLOW ================= */}
        <section className="space-y-6">
          
          {/* Tracker bar */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] text-accent uppercase font-serif tracking-wider font-bold">Estado en Tiempo Real</span>
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <Search className="w-5 h-5 text-accent" />
                <span>Seguimiento de Reparación</span>
              </h3>
              <p className="text-xs text-muted-foreground">Ingresá tu código único de ticket para conocer el avance del equipo en laboratorio.</p>
            </div>

            <form onSubmit={handleSearchTicket} className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: TEC-1001"
                value={trackerInput}
                onChange={(e) => setTrackerInput(e.target.value)}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-accent font-serif font-semibold tracking-wider placeholder:tracking-normal"
              />
              <button
                type="submit"
                disabled={isSearching || !trackerInput.trim()}
                className="px-5 bg-accent text-accent-foreground rounded-lg text-xs font-serif font-bold uppercase transition-colors cursor-pointer hover:bg-accent/90 shrink-0"
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </button>
            </form>

            {searchError && (
              <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-[11px] text-rose-300 leading-normal">
                ⚠️ {searchError}
              </div>
            )}

            {/* Display tracked ticket timeline */}
            {trackedTicket && (
              <div className="space-y-6 border-t border-border/30 pt-5 animate-slide-down">
                <div className="flex items-center justify-between text-xs bg-muted/60 p-3 rounded-lg border border-border/40">
                  <div>
                    <span className="text-[10px] text-accent font-serif block">TICKET #</span>
                    <span className="font-serif font-bold text-foreground text-sm">{trackedTicket.ticket_number}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground font-serif block">DISPOSITIVO</span>
                    <span className="font-sans font-medium text-foreground">{trackedTicket.device_type} · {trackedTicket.brand_model}</span>
                  </div>
                </div>

                {/* Workflow timeline stepper list */}
                <div className="relative pl-6 space-y-5 border-l border-border/50">
                  {statusWorkflow.map((step) => {
                    // check status index matching
                    const activeIdx = statusWorkflow.findIndex(s => s.id === trackedTicket.status);
                    const currentStepIdx = statusWorkflow.findIndex(s => s.id === step.id);
                    const isCompleted = currentStepIdx <= activeIdx;
                    const isActive = step.id === trackedTicket.status;

                    return (
                      <div key={step.id} className="relative text-xs">
                        {/* Stepper Bullet icon */}
                        <span className={`absolute -left-[30px] top-0.5 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isActive 
                            ? "bg-accent border-background text-accent-foreground animate-pulse" 
                            : isCompleted 
                            ? "bg-emerald-500 border-background text-white" 
                            : "bg-background border-border"
                        }`}>
                          {isCompleted && <span className="h-1.5 w-1.5 bg-current rounded-full" />}
                        </span>

                        <div className="space-y-0.5">
                          <h4 className={`font-serif font-bold ${
                            isActive ? "text-accent" : isCompleted ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {step.label}
                          </h4>
                          <p className="text-[10px] text-muted-foreground leading-normal">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Status notes if any */}
                {trackedTicket.status_notes && (
                  <div className="p-3 bg-muted border-l-2 border-accent rounded-r-lg text-[11px] text-muted-foreground leading-normal">
                    <span className="font-semibold text-foreground block font-serif uppercase tracking-widest text-[9px] mb-0.5">Notas del Diagnóstico</span>
                    {trackedTicket.status_notes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick info specs widget */}
          <div className="grid grid-cols-2 gap-4 bg-muted/30 border border-border/40 p-4 rounded-xl text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-foreground font-serif uppercase text-[9px] tracking-wider block">HORARIOS</span>
              <p className="text-muted-foreground">Lunes a Sábados</p>
              <p className="text-muted-foreground font-bold">09:00 - 20:00 hs</p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-foreground font-serif uppercase text-[9px] tracking-wider block">CONTACTO DIRECTO</span>
              <p className="text-muted-foreground">reparaciones@drtecno.com</p>
              <p className="text-accent hover:underline cursor-pointer font-bold">+54 (11) 5555-8326</p>
            </div>
          </div>
        </section>

      </div>

      {/* Collapsible FAQ Technical section */}
      <section className="bg-card border border-border/50 rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1 pb-4">
          <h3 className="font-serif text-xl font-bold text-foreground">Preguntas Frecuentes</h3>
          <p className="text-xs text-muted-foreground">Todo lo que necesitás saber sobre nuestro servicio técnico.</p>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto text-xs">
          {faqData.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="bg-muted/40 border border-border/40 hover:border-border rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 font-serif font-bold text-foreground hover:text-accent flex items-center justify-between cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-accent text-sm font-bold">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-muted-foreground leading-relaxed animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
