import React from "react";
import { Award, ShieldCheck, Heart, Users, CheckCircle2, Star } from "lucide-react";
import { useNavigate } from "../components/router.js";

export const SobreNosotrosPage: React.FC = () => {
  const { navigate } = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 font-sans tech-bg">
      
      {/* Page Header */}
      <div className="border-b border-border/40 pb-4 text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-serif uppercase tracking-widest text-accent font-bold">Nuestra Historia</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Quiénes Somos</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Dr Tecno nació con la misión de democratizar el hardware de alto rendimiento y ofrecer el soporte técnico más confiable de la región.
        </p>
      </div>

      {/* Main Intro banner details */}
      <div className="flex flex-col lg:flex-row bg-card border border-border/50 rounded-2xl overflow-hidden shadow-lg items-stretch">
        <div className="w-full lg:w-1/2 min-h-[300px] relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
            alt="Laboratorio Dr Tecno"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-6 sm:p-10 space-y-4 flex flex-col justify-center">
          <span className="text-[10px] text-accent uppercase font-serif tracking-widest block font-bold">DESDE 2018</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Innovación, Respeto y Compromiso Escrito</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Comenzamos como un laboratorio especializado en microelectrónica y reparación de placas base. Ante la demanda de nuestros clientes por conseguir hardware confiable y original, evolucionamos para convertirnos en un e-commerce tecnológico líder.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Hoy en día, no solo comercializamos laptops, teléfonos y accesorios de última generación, sino que brindamos asesoría personalizada (a través de nuestro recomendador inteligente y chat automatizado) y garantizamos cada compra con respaldo técnico oficial y garantía directa por 12 meses.
          </p>
        </div>
      </div>

      {/* Core values cards bento list */}
      <section className="space-y-6">
        <div className="text-center">
          <h3 className="font-serif text-lg font-bold text-foreground">Valores que nos definen</h3>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Originalidad Garantizada", desc: "No comercializamos copias o refabricados genéricos. Todos nuestros equipos son nuevos y sellados de fábrica con estampilla oficial.", icon: Award },
            { title: "Soporte Sin Vueltas", desc: "Garantía oficial directa. Al contar con taller de reparaciones propio, resolvemos cualquier falla técnica en tiempo récord sin demoras de terceros.", icon: ShieldCheck },
            { title: "Cliente Primero", desc: "Ofrecemos 10 días de cambio directo e inmediato ante cualquier falla de fábrica. Tu entera conformidad es nuestra prioridad.", icon: Heart },
            { title: "Equipo Profesional", desc: "Nuestros asesores y técnicos de laboratorio reciben capacitaciones continuas para dominar el hardware y las arquitecturas de vanguardia.", icon: Users },
          ].map((val) => {
            const IconComponent = val.icon;
            return (
              <div key={val.title} className="bg-card border border-border/40 p-5 rounded-xl space-y-3">
                <div className="p-2.5 bg-accent/15 border border-accent/25 text-accent rounded-lg w-fit">
                  <IconComponent className="w-5 h-5 animate-pulse-subtle" />
                </div>
                <h4 className="font-sans font-semibold text-sm text-foreground">{val.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Action Footer banner */}
      <div className="bg-muted p-8 rounded-2xl border border-border text-center max-w-xl mx-auto space-y-4 shadow">
        <h4 className="font-serif text-lg font-bold text-foreground">¿Querés conocernos en persona?</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Vení a visitar nuestra sucursal central y laboratorio técnico en Buenos Aires. Estaremos encantados de asesorarte y mostrarte el rendimiento de los equipos en vivo.
        </p>
        <button
          onClick={() => navigate("/contacto")}
          className="px-5 py-2.5 bg-accent text-accent-foreground text-xs font-serif font-bold uppercase rounded-lg hover:bg-accent/90 transition-all cursor-pointer"
        >
          Ver Ubicación y Contacto
        </button>
      </div>

    </div>
  );
};
