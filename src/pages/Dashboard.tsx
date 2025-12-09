import { useState, useEffect } from "react";
import { Sparkles, Plus, History, Settings, ChevronLeft, X, ImagePlus, Pencil, Save, Loader2, Clock, Download, Menu, ArrowUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'nueva' | 'versiones' | 'ajustes'>('nueva');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [ideaCentral, setIdeaCentral] = useState<string>("");
  const [formato, setFormato] = useState<string>("Storytelling de impacto");
  const [tono, setTono] = useState<string>("Inspiracional");
  const [idioma, setIdioma] = useState<string>("español");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNarrative, setGeneratedNarrative] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState<string>("");
  const [originalText, setOriginalText] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [versions, setVersions] = useState<Array<{ story_id: string; major: number; minor: number; narrative: string }>>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<"PDF" | "HTML">("PDF");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewStory = () => {
    // Reset all fields
    setUploadedImage(null);
    setUploadedFile(null);
    setImageError("");
    setIdeaCentral("");
    setTono("Inspiracional");
    setFormato("Storytelling de impacto");
    setGeneratedNarrative("");
    setEditedText("");
    setOriginalText("");
    setIsEditing(false);
    setStoryId(null);
    setActiveSection('nueva');
  };

  const handleExport = async (format: "PDF" | "HTML") => {
    if (!generatedNarrative) return;

    setIsExporting(true);
    try {
      const response = await fetch("https://ai-agent-monolitico-1.onrender.com/story/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          narrative: generatedNarrative,
          format: format,
        }),
      });

      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = format === "PDF" ? "story_export.pdf" : "story_export.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exportación ${format} completada`);
    } catch (error) {
      console.error("Error exporting:", error);
      toast.error("Error al exportar", {
        description: "Intenta de nuevo más tarde",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch versions when activeSection changes to 'versiones'
  useEffect(() => {
    const fetchVersions = async () => {
      if (activeSection !== 'versiones') return;
      if (!storyId) {
        setVersions([]);
        return;
      }

      setIsLoadingVersions(true);
      try {
        const response = await fetch(`https://ai-agent-monolitico-1.onrender.com/story/${storyId}/versions`);
        if (!response.ok) throw new Error('Error fetching versions');
        const data = await response.json();
        setVersions(data.versions || data || []);
      } catch (error) {
        console.error('Error fetching versions:', error);
        toast.error("Error al cargar las versiones");
        setVersions([]);
      } finally {
        setIsLoadingVersions(false);
      }
    };

    fetchVersions();
  }, [activeSection, storyId]);

  const handleSelectVersion = (narrative: string) => {
    setGeneratedNarrative(narrative);
    setEditedText(narrative);
    setOriginalText(narrative);
    setActiveSection('nueva');
    toast.success("Versión cargada correctamente");
  };

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      setImageError("Formato no válido. Solo se permiten JPEG, PNG, WEBP o GIF.");
      toast.error("Formato no válido", {
        description: "Solo se permiten archivos JPEG, PNG, WEBP o GIF."
      });
      return;
    }

    setImageError("");
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      toast.success("Imagen cargada correctamente");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setImageError("");
  };

  const handleEditClick = () => {
    if (!generatedNarrative) return;
    setOriginalText(generatedNarrative);
    setEditedText(generatedNarrative);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(originalText);
  };

  const handleSaveEdit = async () => {
    if (!storyId) {
      toast.error("No hay historia generada para guardar");
      return;
    }
    
    // Solo guardar si el texto es diferente
    if (editedText === originalText) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await fetch("https://ai-agent-monolitico-1.onrender.com/save_edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story_id: storyId,
          narrative: editedText,
        }),
      });

      setGeneratedNarrative(editedText);
      setOriginalText(editedText);
      setIsEditing(false);
      toast.success(
        <div className="flex items-center gap-2">
          <span>Cambios guardados correctamente.</span>
          <button
            onClick={() => setActiveSection('versiones')}
            className="text-primary underline hover:no-underline font-medium"
          >
            Ver versiones
          </button>
        </div>
      );
    } catch (error) {
      console.error('Error saving edit:', error);
      toast.error("Error al guardar los cambios", {
        description: "Intenta de nuevo más tarde"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateStory = async () => {
    // Validation: at least image or text must be provided
    if (!uploadedImage && !ideaCentral.trim()) {
      toast.error("Error de validación", {
        description: "Debes subir una imagen o escribir texto para generar una historia."
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedNarrative("");

    try {
      const formData = new FormData();
      
      // Add image if available
      if (uploadedImage && uploadedFile) {
        formData.append('image', uploadedFile, uploadedFile.name);
      }
      
      // Add texto if available
      if (ideaCentral.trim()) {
        formData.append('texto', ideaCentral.trim());
      }
      
      // Add required fields
      formData.append('tono', tono);
      formData.append('formato', formato);

      const apiResponse = await fetch('https://ai-agent-monolitico-1.onrender.com/story', {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error('Error al generar la historia');
      }

      const data = await apiResponse.json();
      if (!data.story_id) throw new Error("El backend no devolvió story_id");
      setStoryId(data.story_id);
      const narrativeText = data.narrative || data.story || "";
      setGeneratedNarrative(narrativeText);
      setOriginalText(narrativeText);
      setEditedText(narrativeText);
      setIsEditing(false);
      toast.success("Historia generada correctamente");
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error("Error al generar la historia", {
        description: "Intenta de nuevo más tarde"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "border-r border-border/50 bg-muted/20 flex flex-col transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo & Toggle */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between gap-2">
            <a
              href="https://auto-story-builder-one.vercel.app/"
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                sidebarCollapsed ? "justify-center" : ""
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20",
                sidebarCollapsed ? "w-10 h-10" : "w-12 h-12"
              )}>
                <Sparkles className={cn("text-primary", sidebarCollapsed ? "w-5 h-5" : "w-6 h-6")} />
              </div>
              {!sidebarCollapsed && (
                <span className="font-semibold text-base tracking-tight">AutoStory</span>
              )}
            </a>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg hover:bg-muted/50 transition-colors",
                sidebarCollapsed && "absolute left-4 top-4"
              )}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={handleNewStory}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              activeSection === 'nueva' 
                ? "bg-background text-foreground shadow-sm border border-border/50" 
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Nueva historia</span>}
          </button>
          
          <button
            onClick={() => setActiveSection('versiones')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              activeSection === 'versiones' 
                ? "bg-background text-foreground shadow-sm border border-border/50" 
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            <History className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Mis versiones</span>}
          </button>
          
          <button
            onClick={() => setActiveSection('ajustes')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              activeSection === 'ajustes' 
                ? "bg-background text-foreground shadow-sm border border-border/50" 
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Ajustes</span>}
          </button>
        </nav>

        <div className="p-3 border-t border-border/50">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "w-full gap-2 rounded-xl hover:bg-muted/50 transition-colors",
              sidebarCollapsed ? "justify-center px-2" : "justify-start"
            )}
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Volver al inicio</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
          <div className="px-6 lg:px-8 py-5">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-xl lg:text-2xl font-semibold mb-1.5 tracking-tight">
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
          <div className="px-6 lg:px-8 py-6 lg:py-8">
            <div className="max-w-5xl mx-auto space-y-6">
              {activeSection === 'nueva' && (
                <>
                  {/* Sección superior – Subida de imagen */}
                  <div className="rounded-2xl border border-border/50 bg-card p-6 lg:p-8 shadow-sm">
                    <h3 className="text-sm font-medium mb-5 text-foreground/90">Subir imagen (opcional)</h3>
                    
                    {!uploadedImage ? (
                      <div
                        className={cn(
                          "relative h-44 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer",
                          dragActive 
                            ? "border-primary/50 bg-primary/5" 
                            : "border-border/60 bg-muted/10 hover:border-primary/30 hover:bg-muted/20",
                          imageError && "border-destructive/50"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <ImagePlus className="w-10 h-10 text-muted-foreground/40" />
                        <div className="text-center">
                          <p className="text-sm text-foreground/60 mb-1">
                            Sube una imagen (opcional)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPEG, PNG, WEBP o GIF
                          </p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={handleFileInput}
                        />
                      </div>
                    ) : (
                      <div className="relative h-44 rounded-xl overflow-hidden bg-muted/10 border border-border/50">
                        <img 
                          src={uploadedImage} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 h-8 w-8 rounded-lg shadow-md"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {imageError && (
                      <p className="text-xs text-destructive mt-2">{imageError}</p>
                    )}
                  </div>

                  {/* Sección inferior – Texto + opciones */}
                  <div className="rounded-2xl border border-border/50 bg-card p-6 lg:p-8 shadow-sm">
                    <h3 className="text-sm font-medium mb-5 text-foreground/90">Idea central y configuración</h3>
                    
                    <div className="space-y-5">
                      {/* Textarea para idea central */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">
                          Idea central (opcional)
                        </label>
                        <textarea
                          value={ideaCentral}
                          onChange={(e) => setIdeaCentral(e.target.value)}
                          placeholder="Describe la idea principal de tu historia..."
                          className="w-full min-h-[110px] px-4 py-3 rounded-xl border border-border/50 bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 placeholder:text-muted-foreground/50"
                        />
                      </div>

                      {/* Selector de Formato */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-3 block">
                          Formato <span className="text-destructive">*</span>
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'Storytelling de impacto', label: 'Storytelling de impacto' },
                            { value: 'Post social', label: 'Post social' },
                            { value: 'Resumen de caso', label: 'Resumen de caso' }
                          ].map((option) => (
                            <label
                              key={option.value}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
                                formato === option.value
                                  ? "border-primary/40 bg-primary/5 shadow-sm"
                                  : "border-border/50 hover:bg-muted/20 hover:border-border"
                              )}
                            >
                              <input
                                type="radio"
                                name="formato"
                                value={option.value}
                                checked={formato === option.value}
                                onChange={(e) => setFormato(e.target.value)}
                                className="w-4 h-4 accent-primary"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Selector de Tono */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-3 block">
                          Tono <span className="text-destructive">*</span>
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'Inspiracional', label: 'Inspiracional' },
                            { value: 'Educativo', label: 'Educativo' },
                            { value: 'Técnico', label: 'Técnico' }
                          ].map((option) => (
                            <label
                              key={option.value}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
                                tono === option.value
                                  ? "border-primary/40 bg-primary/5 shadow-sm"
                                  : "border-border/50 hover:bg-muted/20 hover:border-border"
                              )}
                            >
                              <input
                                type="radio"
                                name="tono"
                                value={option.value}
                                checked={tono === option.value}
                                onChange={(e) => setTono(e.target.value)}
                                className="w-4 h-4 accent-primary"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Generate Button */}
                      <div className="pt-3">
                        <Button
                          onClick={handleGenerateStory}
                          disabled={isGenerating}
                          className="w-full rounded-xl h-11 text-sm font-medium shadow-sm"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generando...
                            </>
                          ) : (
                            'Generar historia'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Sección de Resultado */}
                  <div className="rounded-2xl border border-border/50 bg-card p-6 lg:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-sm font-medium text-foreground/90">Narrativa generada</h3>
                      {generatedNarrative && !isEditing && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditClick}
                            className="gap-2 rounded-lg border-border/50 hover:bg-muted/50"
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isExporting}
                                className="gap-2 rounded-lg border-border/50 hover:bg-muted/50"
                              >
                                {isExporting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                                Exportar
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border border-border/50 rounded-xl shadow-lg">
                              <DropdownMenuItem onClick={() => handleExport("PDF")} className="cursor-pointer rounded-lg">
                                Exportar como PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExport("HTML")} className="cursor-pointer rounded-lg">
                                Exportar como HTML
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="rounded-lg border-border/50"
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                            className="gap-2 rounded-lg"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Guardar cambios
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    {generatedNarrative ? (
                      <div className="space-y-4">
                        <div className="min-h-[22rem] rounded-xl border border-border/50 bg-background p-5">
                          {isEditing ? (
                            <textarea
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                              className="w-full h-full min-h-[20rem] text-sm bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg p-2"
                            />
                          ) : (
                            <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
                              {generatedNarrative}
                            </div>
                          )}
                        </div>
                        
                        {/* Export format selector */}
                        {!isEditing && (
                          <div className="flex items-center gap-3 pt-2">
                            <span className="text-xs font-medium text-muted-foreground">Exportar como:</span>
                            <div className="flex gap-2">
                              {(['PDF', 'HTML'] as const).map((format) => (
                                <button
                                  key={format}
                                  onClick={() => setSelectedExportFormat(format)}
                                  className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
                                    selectedExportFormat === format
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                  )}
                                >
                                  {format}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-80 rounded-xl border border-border/50 bg-muted/10 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          La narrativa generada aparecerá aquí
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeSection === 'versiones' && (
                <div className="space-y-4">
                  {!storyId ? (
                    <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-sm">
                      <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                      <h3 className="text-lg font-semibold mb-2">No hay historia generada</h3>
                      <p className="text-sm text-muted-foreground">
                        Todavía no generaste ninguna historia para mostrar versiones.
                      </p>
                    </div>
                  ) : isLoadingVersions ? (
                    <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-sm">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40 animate-spin" />
                      <p className="text-sm text-muted-foreground">Cargando versiones...</p>
                    </div>
                  ) : versions.length === 0 ? (
                    <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-sm">
                      <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                      <h3 className="text-lg font-semibold mb-2">No hay versiones guardadas</h3>
                      <p className="text-sm text-muted-foreground">
                        Las versiones de tu historia aparecerán aquí
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {versions.map((version) => (
                        <div
                          key={`${version.story_id}-${version.major}-${version.minor}`}
                          className="rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
                          onClick={() => handleSelectVersion(version.narrative)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-semibold">
                                v{version.major}.{version.minor}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg"
                            >
                              Seleccionar
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {version.narrative?.substring(0, 150)}
                            {version.narrative?.length > 150 && '...'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'ajustes' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border/50 bg-card p-6 lg:p-8 shadow-sm space-y-5">
                    <h3 className="font-semibold text-foreground/90">Preferencias generales</h3>
                    
                    {/* Idioma de salida */}
                    <div className="pt-2">
                      <label className="text-xs font-medium text-muted-foreground mb-3 block">
                        Idioma de salida
                      </label>
                      <p className="text-xs text-muted-foreground/70 mb-3">
                        Idioma para las historias generadas
                      </p>
                      <div className="space-y-2">
                        {[
                          { value: 'español', label: 'Español' },
                          { value: 'inglés', label: 'Inglés' },
                          { value: 'portugués', label: 'Portugués' }
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={cn(
                              "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
                              idioma === option.value
                                ? "border-primary/40 bg-primary/5 shadow-sm"
                                : "border-border/50 hover:bg-muted/20 hover:border-border"
                            )}
                          >
                            <input
                              type="radio"
                              name="idioma"
                              value={option.value}
                              checked={idioma === option.value}
                              onChange={(e) => setIdioma(e.target.value)}
                              className="w-4 h-4 accent-primary"
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
