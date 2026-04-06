"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
    loading?: boolean;
    variant?: "default" | "destructive";
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    cancelText = "Cancel",
    confirmText = "Confirm",
    onConfirm,
    loading = false,
    variant = "default",
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[2rem] border border-white/10 bg-[#141210] shadow-2xl sm:max-w-md p-6 sm:p-8">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl text-white">{title}</DialogTitle>
                    <DialogDescription className="text-white/50">{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end mt-6">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl border border-white/10 bg-transparent text-white hover:bg-white/5 transition-colors"
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                        }}
                        disabled={loading}
                        variant={variant === "destructive" ? "destructive" : "default"}
                        className={
                            variant === "destructive"
                                ? "rounded-xl font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                                : "rounded-xl font-bold bg-candy-pink text-[#0c0a09] hover:brightness-110 shadow-glow-coral"
                        }
                    >
                        {loading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
