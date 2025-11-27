import { useState } from "react";
import { Sparkles, Plus, History, Settings, Upload, FileText, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'nueva' | 'versiones' | 'ajustes'>('nueva');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop logic here
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-subtle bg-muted/30 flex flex-col">
        <div className="p-6 border-b border-subtle">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-lg">StoryGen AI</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveSection('nueva')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth",
              activeSection === 'nueva' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-background/50"
            )}
          >
            <Plus className="w-4 h-4" />
            Nueva historia
          </button>
          
          <button
            onClick={() => setActiveSection('versiones')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth",
              activeSection === 'versiones' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-background/50"
            )}
          >
            <History className="w-4 h-4" />
            Mis versiones
          </button>
          
          <button
            onClick={() => setActiveSection('ajustes')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth",
              activeSection === 'ajustes' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-background/50"
            )}
          >
            <Settings className="w-4 h-4" />
            Ajustes
          </button>
        </nav>

        <div className="p-4 border-t border-subtle">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-subtle bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-semibold mb-2">
                {activeSection === 'nueva' && 'Nueva historia visual'}
                {activeSection === 'versiones' && 'Mis versiones'}
                {activeSection === 'ajustes' && 'Ajustes'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeSection === 'nueva' && 'Sube tus archivos y deja que la IA genere una narrativa visual profesional'}
                {activeSection === 'versiones' && 'Accede a todas las historias que has creado'}
                {activeSection === 'ajustes' && 'Configura las preferencias del generador'}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-8 py-8">
            <div className="max-w-5xl mx-auto space-y-8">
              {activeSection === 'nueva' && (
                <>
                  {/* Sección superior – Subida de imagen */}
                  <div className="rounded-xl border border-subtle bg-card p-8">
                    <h3 className="text-sm font-medium mb-6">Subir imagen (opcional)</h3>
                    <div className="h-48 rounded-lg border border-subtle bg-muted/20"></div>
                  </div>

                  {/* Sección inferior – Texto + opciones */}
                  <div className="rounded-xl border border-subtle bg-card p-8">
                    <h3 className="text-sm font-medium mb-6">Idea central y configuración</h3>
                    <div className="h-64 rounded-lg border border-subtle bg-muted/20"></div>
                  </div>

                  {/* Sección de Resultado */}
                  <div className="rounded-xl border border-subtle bg-card p-8">
                    <h3 className="text-sm font-medium mb-6">Narrativa generada</h3>
                    <div className="h-96 rounded-lg border border-subtle bg-muted/20"></div>
                  </div>
                </>
              )}

              {activeSection === 'versiones' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-subtle bg-card p-12 text-center">
                    <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No hay versiones guardadas</h3>
                    <p className="text-sm text-muted-foreground">
                      Tus historias generadas aparecerán aquí
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'ajustes' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-subtle bg-card p-8 space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Preferencias generales</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-3 border-b border-subtle">
                          <div>
                            <p className="text-sm font-medium">Idioma de salida</p>
                            <p className="text-xs text-muted-foreground">Idioma para las historias generadas</p>
                          </div>
                          <Button variant="outline" size="sm">Español</Button>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-subtle">
                          <div>
                            <p className="text-sm font-medium">Estilo visual</p>
                            <p className="text-xs text-muted-foreground">Preferencia de diseño</p>
                          </div>
                          <Button variant="outline" size="sm">Minimalista</Button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-sm font-medium">Formato de exportación</p>
                            <p className="text-xs text-muted-foreground">Tipo de archivo de salida</p>
                          </div>
                          <Button variant="outline" size="sm">PDF</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
