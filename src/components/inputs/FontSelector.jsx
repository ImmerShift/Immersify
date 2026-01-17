                  import React, { useState, useEffect } from 'react';
                  import { api } from '@/api/client'; // Updated to use your local API
                  import { X, Plus, Search, Upload, Loader2 } from 'lucide-react';
                  import { Label } from '@/components/ui/label';
                  import { Input } from '@/components/ui/input';
                  import { Button } from '@/components/ui/button';
                  import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

                  const popularFonts = [
                    { name: 'Roboto', category: 'Sans-serif', style: 'Modern & Clean' },
                    { name: 'Open Sans', category: 'Sans-serif', style: 'Friendly & Readable' },
                    { name: 'Montserrat', category: 'Sans-serif', style: 'Geometric & Bold' },
                    { name: 'Lato', category: 'Sans-serif', style: 'Warm & Stable' },
                    { name: 'Poppins', category: 'Sans-serif', style: 'Modern & Geometric' },
                    { name: 'Playfair Display', category: 'Serif', style: 'Elegant & Editorial' },
                    { name: 'Merriweather', category: 'Serif', style: 'Classic & Readable' },
                    { name: 'Lora', category: 'Serif', style: 'Balanced & Contemporary' },
                    { name: 'Inter', category: 'Sans-serif', style: 'Clean & Technical' },
                    { name: 'Raleway', category: 'Sans-serif', style: 'Elegant & Light' },
                    { name: 'Oswald', category: 'Sans-serif', style: 'Bold & Condensed' },
                    { name: 'Nunito', category: 'Sans-serif', style: 'Rounded & Friendly' },
                    { name: 'Source Sans Pro', category: 'Sans-serif', style: 'Professional' },
                    { name: 'PT Serif', category: 'Serif', style: 'Traditional' },
                    { name: 'Work Sans', category: 'Sans-serif', style: 'Optimized for screens' },
                  ];

                  export default function FontSelector({ label, fonts = [], onChange, maxFonts = 2 }) {
                    const [searchTerm, setSearchTerm] = useState('');
                    const [isOpen, setIsOpen] = useState(false);
                    const [isAnalyzing, setIsAnalyzing] = useState(false);
                    const [customFontName, setCustomFontName] = useState('');

                    // Load selected fonts from Google Fonts dynamically
                    useEffect(() => {
                      fonts.forEach(font => {
                        if (font.source === 'google' || !font.source) {
                          const fontFamily = font.name?.replace(/ /g, '+');
                          if (fontFamily && !document.querySelector(`link[href*="${fontFamily}"]`)) {
                            const link = document.createElement('link');
                            link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;700&display=swap`;
                            link.rel = 'stylesheet';
                            document.head.appendChild(link);
                          }
                        }
                      });
                    }, [fonts]);

                    const filteredFonts = popularFonts.filter(font =>
                      font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      font.style.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    const handleAddFont = (font) => {
                      if (fonts.length >= maxFonts) return;
                      if (fonts.find(f => f.name === font.name)) return;

                      onChange([...fonts, { ...font, source: 'google' }]);
                      setIsOpen(false);
                      setSearchTerm('');
                    };

                    const handleAddCustomFont = () => {
                      if (!customFontName.trim() || fonts.length >= maxFonts) return;
                      if (fonts.find(f => f.name === customFontName)) return;

                      onChange([...fonts, { 
                        name: customFontName, 
                        category: 'Custom', 
                        style: 'Custom font',
                        source: 'custom'
                      }]);
                      setCustomFontName('');
                      setIsOpen(false);
                    };

                    const handleUploadFontImage = async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setIsAnalyzing(true);
                      try {
                        // 1. Upload Image to your Replit Server
                        const { file_url } = await api.files.upload({ file });

                        // 2. Ask AI to identify font
                        // Note: We are simulating the "Vision" capability with text prompt for now
                        // unless you use GPT-4 Vision. This prompt assumes standard text model behavior
                        // which might be limited, but wires up the architecture correctly.
                        const result = await api.ai.invoke({
                          prompt: `Analyze this image URL: ${file_url}. Identify the font characteristics.
                          Respond in JSON: { "identified_font": "Name", "category": "Serif/Sans", "style_description": "Bold", "google_font_alternatives": ["Alt1"] }`
                        });

                        if (fonts.length < maxFonts) {
                          const fontName = result.identified_font || result.google_font_alternatives?.[0] || 'Unknown Font';
                          const isGoogleFont = popularFonts.some(f => f.name.toLowerCase() === fontName.toLowerCase());

                          onChange([...fonts, {
                            name: fontName,
                            category: result.category || 'Custom',
                            style: result.style_description || 'Identified from image',
                            source: isGoogleFont ? 'google' : 'custom',
                            image_url: file_url,
                            alternatives: result.google_font_alternatives
                          }]);
                        }
                      } catch (error) {
                        console.error('Font analysis failed:', error);
                      } finally {
                        setIsAnalyzing(false);
                      }
                    };

                    const handleRemoveFont = (fontName) => {
                      onChange(fonts.filter(f => f.name !== fontName));
                    };

                    return (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">{label}</Label>

                        {/* Selected Fonts List */}
                        <div className="space-y-3 mb-4">
                          {fonts.map((font) => (
                            <div key={font.name} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span 
                                    className="font-semibold text-lg"
                                    style={{ fontFamily: font.source === 'google' ? font.name : 'inherit' }}
                                  >
                                    {font.name}
                                  </span>
                                  {font.source === 'custom' && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Custom</span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500">{font.category} • {font.style}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFont(font.name)}
                                className="p-2 text-slate-400 hover:text-destructive transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Font Button */}
                        {fonts.length < maxFonts && (
                          <>
                            {!isOpen ? (
                              <button
                                type="button"
                                onClick={() => setIsOpen(true)}
                                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors bg-slate-50/50"
                              >
                                <Plus className="w-5 h-5" />
                                Add Font ({fonts.length}/{maxFonts})
                              </button>
                            ) : (
                              <div className="border rounded-lg p-4 bg-white shadow-sm animate-in fade-in zoom-in-95">
                                <Tabs defaultValue="google" className="w-full">
                                  <TabsList className="grid w-full grid-cols-3 mb-4">
                                    <TabsTrigger value="google">Google Fonts</TabsTrigger>
                                    <TabsTrigger value="custom">Custom</TabsTrigger>
                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="google">
                                    <div className="relative mb-3">
                                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      <Input
                                        placeholder="Search fonts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                      />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                                      {filteredFonts.map((font) => (
                                        <button
                                          key={font.name}
                                          type="button"
                                          onClick={() => handleAddFont(font)}
                                          disabled={fonts.find(f => f.name === font.name)}
                                          className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                                        >
                                          <div>
                                            <span className="font-medium">{font.name}</span>
                                            <span className="text-sm text-slate-500 ml-2">{font.style}</span>
                                          </div>
                                          <span className="text-xs text-slate-400">{font.category}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="custom">
                                    <div className="space-y-3">
                                      <Input
                                        placeholder="e.g., Proxima Nova"
                                        value={customFontName}
                                        onChange={(e) => setCustomFontName(e.target.value)}
                                      />
                                      <Button onClick={handleAddCustomFont} disabled={!customFontName.trim()} className="w-full">
                                        Add Custom Font
                                      </Button>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="upload">
                                    <div className="space-y-3">
                                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-primary hover:bg-orange-50 transition-colors">
                                        <input type="file" accept="image/*" onChange={handleUploadFontImage} className="hidden" disabled={isAnalyzing} />
                                        {isAnalyzing ? (
                                          <>
                                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                            <span className="text-sm text-slate-500">AI is analyzing...</span>
                                          </>
                                        ) : (
                                          <>
                                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                            <span className="text-sm text-slate-500">Upload font image</span>
                                          </>
                                        )}
                                      </label>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                                <Button variant="ghost" onClick={() => setIsOpen(false)} className="w-full mt-3">Cancel</Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  }