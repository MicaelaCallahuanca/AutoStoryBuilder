import { useState } from "react";
import { Sparkles, Plus, History, Settings, Upload, FileText, ChevronLeft, X, ImagePlus, Pencil, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'nueva' | 'versiones' | 'ajustes'>('nueva');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [ideaCentral, setIdeaCentral] = useState<string>("");
  const [formato, setFormato] = useState<string>("Storytelling de impacto");
  const [tono, setTono] = useState<string>("Inspiracional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNarrative, setGeneratedNarrative] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedNarrative, setEditedNarrative] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [storyId, setStoryId] = useState<string | null>(null);

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
    setEditedNarrative(generatedNarrative);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!storyId) { /* ... error ... */ return; }
    console.log("Intentando guardar story_id:", storyId);
    if (!storyId) {
    toast.error("No hay historia generada para guardar");
    return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('https://ai-agent-monolitico-1.onrender.com/save_edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          story_id: storyId,     
          narrative: editedNarrative,    
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar');
      }

      const data = await response.json();
      setGeneratedNarrative(editedNarrative);
      setIsEditing(false);
      toast.success(`Cambios guardados (v${data.version})`);
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
      setGeneratedNarrative(data.narrative || data.story || "");
      setEditedNarrative(data.narrative || data.story || "");
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
                    
                    {!uploadedImage ? (
                      <div
                        className={cn(
                          "relative h-48 rounded-lg border-2 border-dashed transition-smooth flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-foreground/30 hover:bg-muted/30",
                          dragActive ? "border-foreground bg-muted/40" : "border-subtle bg-muted/20",
                          imageError && "border-destructive/50"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <ImagePlus className="w-10 h-10 text-muted-foreground/50" />
                        <div className="text-center">
                          <p className="text-sm text-foreground/70 mb-1">
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
                      <div className="relative h-48 rounded-lg overflow-hidden bg-muted/20 border border-subtle">
                        <img 
                          src={uploadedImage} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
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
                  <div className="rounded-xl border border-subtle bg-card p-8">
                    <h3 className="text-sm font-medium mb-6">Idea central y configuración</h3>
                    
                    <div className="space-y-6">
                      {/* Textarea para idea central */}
                      <div>
                        <label className="text-xs font-medium text-foreground/70 mb-2 block">
                          Idea central (opcional)
                        </label>
                        <textarea
                          value={ideaCentral}
                          onChange={(e) => setIdeaCentral(e.target.value)}
                          placeholder="Describe la idea principal de tu historia..."
                          className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-subtle bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-smooth"
                        />
                      </div>

                      {/* Selector de Formato */}
                      <div>
                        <label className="text-xs font-medium text-foreground/70 mb-3 block">
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
                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-smooth",
                                formato === option.value
                                  ? "border-foreground bg-muted/30"
                                  : "border-subtle hover:bg-muted/20"
                              )}
                            >
                              <input
                                type="radio"
                                name="formato"
                                value={option.value}
                                checked={formato === option.value}
                                onChange={(e) => setFormato(e.target.value)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Selector de Tono */}
                      <div>
                        <label className="text-xs font-medium text-foreground/70 mb-3 block">
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
                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-smooth",
                                tono === option.value
                                  ? "border-foreground bg-muted/30"
                                  : "border-subtle hover:bg-muted/20"
                              )}
                            >
                              <input
                                type="radio"
                                name="tono"
                                value={option.value}
                                checked={tono === option.value}
                                onChange={(e) => setTono(e.target.value)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Generate Button */}
                      <div className="pt-4">
                        <Button
                          onClick={handleGenerateStory}
                          disabled={isGenerating}
                          className="w-full"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
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
                  <div className="rounded-xl border border-subtle bg-card p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-medium">Narrativa generada</h3>
                      {generatedNarrative && !isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditClick}
                          className="gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </Button>
                      )}
                      {isEditing && (
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="gap-2"
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
                      )}
                    </div>
                    {generatedNarrative ? (
                      <div className="min-h-[24rem] rounded-lg border border-subtle bg-background p-6">
                        {isEditing ? (
                          <textarea
                            value={editedNarrative}
                            onChange={(e) => setEditedNarrative(e.target.value)}
                            className="w-full h-full min-h-[22rem] text-sm bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20 rounded-lg p-2 border border-subtle"
                          />
                        ) : (
                          <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                            {generatedNarrative}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-96 rounded-lg border border-subtle bg-muted/20 flex items-center justify-center">
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
