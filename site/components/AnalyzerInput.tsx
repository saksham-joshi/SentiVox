"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Upload, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AnalyzerInputProps {
    onAnalyze: (text: string) => void;
    isLoading: boolean;
    value?: string;
    readOnly?: boolean;
}

export default function AnalyzerInput({ onAnalyze, isLoading, value, readOnly = false }: AnalyzerInputProps) {
    const [text, setText] = useState(value || "");
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update text if value prop changes (useful if we want to reset it or control it later, mostly for initial load of history items)
    useEffect(() => {
        if (value !== undefined) {
            setText(value);
        }
    }, [value]);

    const handleSubmit = () => {
        if (text.trim().length >= 3 && !isLoading && !readOnly) {
            onAnalyze(text.trim());
        }
    };

    const handleFileUpload = async (file: File) => {
        if (readOnly) return;
        if (file.type === "text/plain") {
            const content = await file.text();
            setText(content);
        } else {
            alert("Please upload a plain text file");
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (readOnly) return;
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (readOnly) return;
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-slide-up">
            <div
                className={cn(
                    "relative rounded-xl border-3 transition-all duration-200 border-white",
                    isDragOver
                        ? "border-white bg-white/5"
                        : readOnly
                            ? "border-transparent bg-muted/30"
                            : "border-dashed border-white hover:border-white/40"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={readOnly ? "" : "Enter text to analyze or drop a .txt file here..."}
                    className={cn(
                        "min-h-[80px] border-0 bg-transparent resize-y focus-visible:ring-0 focus-visible:ring-offset-0",
                        readOnly && "resize-none text-muted-foreground cursor-default"
                    )}
                    disabled={isLoading || readOnly}
                />

                {!readOnly && (
                    <div className="flex items-center justify-between p-3 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt,text/plain"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <Upload size={16} />
                                <span className="hidden sm:inline">Upload file</span>
                            </Button>
                            {text && (
                                <span className="text-xs text-muted-foreground">
                                    {text.length} characters
                                </span>
                            )}
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={text.trim().length < 3 || isLoading}
                            size="lg"
                            className="gap-2 min-w-[140px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Analyze
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            {!readOnly && (
                <p className="text-center text-xs text-muted-foreground mt-3">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">Enter</kbd> to analyze
                </p>
            )}
        </div>
    );
}
