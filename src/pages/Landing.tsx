import { useState } from "react";
import { ArrowRight, Upload, Sparkles, FileText, CheckCircle2, Zap, Users, TrendingUp, Send, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.nombre || !contactForm.email || !contactForm.mensaje) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Mensaje enviado correctamente");
    setContactForm({ nombre: "", email: "", mensaje: "" });
    setIsSubmitting(false);
  };

  const navItems = [
    { label: "Inicio", target: "hero" },
    { label: "Cómo funciona", target: "como-funciona" },
    { label: "Ejemplos", target: "ejemplos" },
    { label: "Contacto", target: "contacto" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="https://auto-story-builder-one.vercel.app/"
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/10 border border-foreground/20 group-hover:bg-foreground/20 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">AutoStory</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => scrollToSection(item.target)}
                className="nav-link text-sm font-medium py-1"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('contacto')}
              className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 hover:scale-105"
            >
              Contacto
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl animate-fade-in">
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.target}
                  onClick={() => scrollToSection(item.target)}
                  className="text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <Button 
                onClick={() => scrollToSection('contacto')}
                className="mt-2 rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                Contacto
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-24 md:py-40">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                Historias visuales
                <br />
                <span className="text-muted-foreground">que cuentan más</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transforma tus archivos en narrativas visuales profesionales con inteligencia artificial.
                Simple, rápido y efectivo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-base gap-2 bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all duration-200 shadow-lg"
                onClick={() => navigate('/dashboard')}
              >
                Probar el Generador
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full px-8 py-6 text-base border-foreground/20 hover:bg-foreground/10 transition-all duration-200"
                onClick={() => scrollToSection('ejemplos')}
              >
                Ver ejemplos
              </Button>
            </div>
          </div>

          {/* Mockup */}
          <div className="mt-20 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative aspect-video rounded-2xl border border-border/50 bg-card overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-background/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-foreground/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Vista previa del generador</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div className="space-y-6 animate-fade-up">
              <div className="inline-block px-4 py-1.5 rounded-full bg-card border border-border/50 text-xs font-medium">
                El problema
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Crear contenido visual
                <br />
                lleva demasiado tiempo
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Los equipos pasan horas organizando información, diseñando layouts y ajustando cada detalle.</p>
                <p>El resultado: menos tiempo para estrategia y más recursos gastados en producción manual.</p>
              </div>
            </div>

            <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-block px-4 py-1.5 rounded-full bg-card border border-border/50 text-xs font-medium">
                La solución
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Automatización inteligente
                <br />
                para equipos ágiles
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>La IA analiza tus archivos y genera historias visuales coherentes en minutos.</p>
                <p>Enfócate en el mensaje mientras la tecnología se encarga del diseño y la narrativa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-24 border-t border-border/30 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold">Cómo funciona</h2>
              <p className="text-lg text-muted-foreground">
                Tres pasos simples entre tus archivos y una historia visual profesional
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: Upload,
                  step: "01",
                  title: "Carga tus archivos",
                  description: "Sube documentos, imágenes o datos. El sistema acepta múltiples formatos."
                },
                {
                  icon: Sparkles,
                  step: "02",
                  title: "La IA procesa",
                  description: "Nuestro modelo analiza el contenido y estructura una narrativa visual coherente."
                },
                {
                  icon: FileText,
                  step: "03",
                  title: "Descarga tu historia",
                  description: "Obtén una historia visual lista para presentar, compartir o editar."
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="space-y-5 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border/50 bg-card">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">{item.step}</div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold">Ideal para equipos modernos</h2>
              <p className="text-lg text-muted-foreground">
                Marketing, comunicación y contenido trabajando de forma más eficiente
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Velocidad",
                  description: "De horas a minutos. Genera múltiples versiones rápidamente."
                },
                {
                  icon: Users,
                  title: "Colaboración",
                  description: "Equipos sincronizados con narrativas consistentes."
                },
                {
                  icon: TrendingUp,
                  title: "Escalabilidad",
                  description: "Produce más contenido sin aumentar recursos."
                }
              ].map((benefit, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl border border-border/50 bg-card space-y-4 hover-lift animate-fade-up group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted/50 group-hover:bg-foreground/10 transition-colors duration-300">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="ejemplos" className="py-24 border-t border-border/30 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold">Ejemplos de resultados</h2>
              <p className="text-lg text-muted-foreground">
                Historias visuales generadas automáticamente a partir de diferentes tipos de contenido
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item, index) => (
                <div 
                  key={item} 
                  className="group rounded-2xl border border-border/50 bg-card overflow-hidden hover-lift animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-video bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background/80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="font-semibold group-hover:text-foreground transition-colors">Historia de ejemplo {item}</h3>
                    <p className="text-sm text-muted-foreground">
                      Narrativa visual generada automáticamente a partir de datos estructurados.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Comienza a crear historias hoy
              </h2>
              <p className="text-lg text-muted-foreground">
                Sin configuración complicada. Sin curva de aprendizaje. Solo resultados.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-base gap-2 bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all duration-200 shadow-lg"
                onClick={() => navigate('/dashboard')}
              >
                Probar el Generador
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 border-t border-border/30 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto space-y-10 animate-fade-up">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Contacto</h2>
              <p className="text-muted-foreground">
                ¿Quieres trabajar con nosotros o necesitas soporte? Escríbenos.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Nombre
                </label>
                <input
                  type="text"
                  value={contactForm.nombre}
                  onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Mensaje
                </label>
                <textarea
                  value={contactForm.mensaje}
                  onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })}
                  placeholder="¿En qué podemos ayudarte?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl py-6 text-base gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all duration-200"
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    Enviar mensaje
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <a 
              href="https://auto-story-builder-one.vercel.app/"
              className="flex items-center gap-3 group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-foreground/10 border border-foreground/20 group-hover:bg-foreground/20 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-foreground" />
              </div>
              <span className="font-semibold">AutoStory</span>
            </a>
            <p className="text-sm text-muted-foreground">
              © 2024 AutoStory. Generador de historias visuales con IA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
