import { ArrowRight, Upload, Sparkles, FileText, CheckCircle2, Zap, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-subtle">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-lg">StoryGen AI</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Acceder
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
              Historias visuales
              <br />
              <span className="text-muted-foreground">que cuentan más</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforma tus archivos en narrativas visuales profesionales con inteligencia artificial.
              Simple, rápido y efectivo.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => navigate('/dashboard')}
            >
              Probar el Generador
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Ver ejemplos
            </Button>
          </div>
        </div>

        {/* Mockup */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-xl border border-subtle bg-muted/30 overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3 p-8">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Vista previa del generador</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="border-t border-subtle bg-muted/30">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-background border border-subtle text-xs font-medium">
                El problema
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold">
                Crear contenido visual
                <br />
                lleva demasiado tiempo
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Los equipos pasan horas organizando información, diseñando layouts y ajustando cada detalle.</p>
                <p>El resultado: menos tiempo para estrategia y más recursos gastados en producción manual.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-background border border-subtle text-xs font-medium">
                La solución
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold">
                Automatización inteligente
                <br />
                para equipos ágiles
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>La IA analiza tus archivos y genera historias visuales coherentes en minutos.</p>
                <p>Enfócate en el mensaje mientras la tecnología se encarga del diseño y la narrativa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold">Cómo funciona</h2>
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
              <div key={index} className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg border border-subtle bg-muted/30">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">{item.step}</div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-subtle bg-muted/30">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold">Ideal para equipos modernos</h2>
              <p className="text-lg text-muted-foreground">
                Marketing, comunicación y contenido trabajando de forma más eficiente
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
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
                <div key={index} className="p-6 rounded-xl border border-subtle bg-background space-y-4 hover-lift">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold">Ejemplos de resultados</h2>
            <p className="text-lg text-muted-foreground">
              Historias visuales generadas automáticamente a partir de diferentes tipos de contenido
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group rounded-xl border border-subtle bg-card overflow-hidden hover-lift">
                <div className="aspect-video bg-muted/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-background/80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-semibold">Historia de ejemplo {item}</h3>
                  <p className="text-sm text-muted-foreground">
                    Narrativa visual generada automáticamente a partir de datos estructurados.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-subtle">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-semibold">
                Comienza a crear historias hoy
              </h2>
              <p className="text-lg text-muted-foreground">
                Sin configuración complicada. Sin curva de aprendizaje. Solo resultados.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => navigate('/dashboard')}
              >
                Probar el Generador
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-subtle">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">StoryGen AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StoryGen AI. Generador de historias visuales con IA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
